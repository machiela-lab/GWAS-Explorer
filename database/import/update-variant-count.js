const fs = require('fs');
const mysql = require('mysql2');
const args = require('minimist')(process.argv.slice(2));
const { database } = require('../../server/config.json');
const { timestamp } = require('./utils/logging');
const { readFile } = require('./utils/file');
const { getRecords, pluck } = require('./utils/query');
const { getIntervals, getLambdaGC } = require('./utils/math');

/**
lambdagc_ewing|1.036
lambdagc_rcc|1.029
lambdagc_mel|0.83
*/

// display help if needed
if (!(args.phenotype && args.sex)) {
    console.log(`USAGE: node import-variants.js
            --phenotype "phenotype name or id"
            --sex "all" | "female" | "male"
            --lambdagc`);
    process.exit(0);
}

// parse arguments and set defaults
const { phenotype, sex } = args;
//const errorLog = getLogStream(`./failed-variants-${new Date().toISOString()}.txt`);
const errorLog = {write: e => console.log(e)};
const duration = timestamp();
const quote = identifier => '`' + identifier + '`';
const connection = mysql.createConnection({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password,
    namedPlaceholders: true,
    multipleStatements: true,
    // debug: true,
  }).promise();

// sex should be male, female, or all
if (!/^(all|female|male)$/.test(sex)) {
    console.error(`ERROR: Sex must be all, female, or male`);
    process.exit(1);
}

importVariants().then(e => {
    console.log(`[${duration()} s] Imported variant counts`);
    process.exit(0);
});

async function importVariants() {
    // find phenotypes either by name or id (if a numeric value was provided)
    const phenotypeKey = /^\d+$/.test(phenotype) ? 'id' : 'name';
    const phenotypes = await getRecords(connection, 'phenotype', {
        [phenotypeKey]: phenotype
    });

    if (phenotypes.length === 0) {
        console.error(`ERROR: Phenotype does not exist`)
        process.exit(1);
    }

    if (phenotypes.length > 1) {
        console.error(`ERROR: More than one phenotype was found with the same name. Please specify the phenotype id instead of the name.`)
        process.exit(1);
    }

    const phenotypeName = phenotypes[0].name;
    const phenotypeId = phenotypes[0].id;
    const variantTable = `variant_${phenotypeName}`;
    const partition = quote(`${phenotypeId}_${sex}`)

    console.log(`[${duration()} s] Storing lambdaGC and counts...`);
    await connection.execute(`
        INSERT INTO phenotype_metadata (phenotype_id, sex, chromosome, count)
        VALUES (
            :phenotypeId,
            :sex,
            :chromosome,
            (SELECT COUNT(*) AS count FROM phenotype_variant PARTITION (${partition}))
        ) ON DUPLICATE KEY UPDATE
            count = VALUES(count);
    `, {phenotypeId, sex, chromosome: 'all'});

    await connection.query(`
        INSERT INTO phenotype_metadata (phenotype_id, sex, chromosome, count)
        SELECT
            ${phenotypeId} as phenotype_id,
            "${sex}" as sex,
            chromosome,
            count(*) as count
        FROM phenotype_variant PARTITION (${partition})
        WHERE sex = "${sex}"
        GROUP BY chromosome
        ON DUPLICATE KEY UPDATE
            count = VALUES(count);
    `);

    // log imported variants
    console.log(`[${duration()} s] Storing import log...`);
    connection.execute(`
        UPDATE phenotype SET
            import_count = (
                SELECT count from phenotype_metadata
                WHERE
                    phenotype_id = :phenotypeId AND
                    sex = :sex AND
                    chromosome = :chromosome
            ),
            import_date = NOW()
        WHERE
            id = :phenotypeId`,
        {phenotypeId, sex, chromosome: 'all'}
    );

    await connection.query(`COMMIT`);
    await connection.end();
    return 0;
}
