const assert = require('assert');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const sqlite = require('better-sqlite3');

// retrieve arguments
const argv = process.argv.slice(2);
if (argv.length !== 2 || argv.includes('-h')) {
    console.log(`USAGE: node import.js input.txt output.db`)
    process.exit(0);
}

// parse arguments and set defaults
let [ inputFilePath, databaseFilePath ] = argv;
databaseFilePath = databaseFilePath || 'output.json';

// input file should exist
if (!fs.existsSync(inputFilePath)) {
    console.error(`ERROR: ${inputFilePath} does not exist.`)
    process.exit(1);
}

// db file should not already exist
if (fs.existsSync(databaseFilePath)) {
    console.error(`ERROR: ${databaseFilePath} already exists.`)
    process.exit(2);
}

// set up utility functions/constants
const startTime = new Date();
const duration = _ => ((new Date() - startTime) / 1000).toPrecision(4);
const readFile = filepath => fs.readFileSync(path.resolve(__dirname, filepath), 'utf8');


// parses each line in the file
const parseLine = line => line.trim().split(/\t/).map(value => {
    if (value === 'NA') return null; // nulls are represented as 'NA' values
    else if (!isNaN(value)) return parseFloat(value); // try to parse nums as floats
    return value;
});

// gets the first line in a file
const getFirstLine = filepath => {
    const size = 2048;
    const buffer = Buffer.alloc(size);
    fs.readSync(fs.openSync(filepath, 'r'), buffer, 0, size);
    const contents = buffer.toString();
    return contents.substring(0, contents.indexOf('\n')).trim();
}

// validate headers
const headers = ['phenotype1', 'phenotype2', 'r2'];
const firstLine = parseLine(getFirstLine(inputFilePath));
assert.deepStrictEqual(firstLine, headers, `Headers do not match expected values: ${headers}`);

// create correlations_stage (temp) and correlations tables
const db = new sqlite(databaseFilePath);
db.exec(readFile('schema-correlations.sql'));

const insert = db.prepare(`
    INSERT INTO correlations_stage VALUES (
        :phenotype1_title,
        :phenotype1_value,
        :phenotype2_title,
        :phenotype2_value,
        :r2
    )
`);

// stream the correlations input file line by line
const readerCorrelations = readline.createInterface({
    input: fs.createReadStream(inputFilePath)
});

let count = 0;

db.exec('BEGIN TRANSACTION');

readerCorrelations.on('line', line => {
    // skip first line
    if (count++ === 0) return;
    // trim, split by spaces, and parse 'NA' as null
    const values = parseLine(line);
    const [phenotype1, phenotype2, r2] = values; 
    const params = {
        phenotype1_title: phenotype1, 
        phenotype1_value: null,
        phenotype2_title: phenotype2, 
        phenotype2_value: null,
        r2
    };   

    insert.run(params);

    // show progress message every 10 rows
    if (count % 10 === 0)
        console.log(`[${duration()} s] Inserted ${count} rows`);
});

readerCorrelations.on('close', () => {
    db.exec('COMMIT');

    // store correlations table
    console.log(`[${duration()} s] Storing correlations...`);
    db.exec(`
        INSERT INTO correlations SELECT
            null, "phenotype1_title", "phenotype1_value", "phenotype2_title", "phenotype2_value", "r2"
        FROM correlations_stage;
    `);

    // drop staging table
    db.exec(`DROP TABLE correlations_stage`);

    // create indexes
    console.log(`[${duration()} s] Indexing...`);
    db.exec(readFile('indexes-correlations.sql'));

    // close database
    console.log(`[${duration()} s] Finalizing database...`);
    db.close();
    console.log(`[${duration()} s] Created database`);
});