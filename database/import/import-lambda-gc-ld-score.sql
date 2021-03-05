START TRANSACTION;

-- FLUSH TABLES;

-- needed if local_infile is disabled, need root privileges
-- SET GLOBAL local_infile = 'ON';

SET autocommit = 0;

CREATE TEMPORARY TABLE `lambdagc_stage` (
    `phenotype_id` integer,
    `sex` varchar(200),
    `ancestry` varchar(200),
    `platform` varchar(200),
    `method` varchar(200),
    `intercept` double,
    `error` double
);

LOAD DATA LOCAL INFILE "../raw/ldscore_summary.tsv" INTO TABLE lambdagc_stage
    FIELDS TERMINATED BY '\t' OPTIONALLY ENCLOSED BY '"'
    IGNORE 1 ROWS (@phenotype, @platform, @ancestry, @method, @intercept, @error)
    SET 
        phenotype_id = (SELECT id from phenotype where name = REGEXP_REPLACE(@phenotype, '_(fe)?male$', '')),
        sex =  if(
            REGEXP_LIKE(@phenotype, '_(fe)?male$'),
            REGEXP_SUBSTR(@phenotype, '(fe)?male$'),
            'all'
        ),
        ancestry = lower(@ancestry),
        platform = @platform,
        method = @method,
        intercept = @intercept,
        error = @error;

insert into phenotype_metadata(phenotype_id, sex, ancestry, chromosome, lambda_gc_ld_score)
select phenotype_id, sex, ancestry, 'all' as chromosome, intercept as lambda_gc_ld_score from lambdagc_stage
where platform in ('meta', 'meta-all-categories')
on duplicate key update lambda_gc_ld_score = values(lambda_gc_ld_score);

COMMIT;