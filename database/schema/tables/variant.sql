DROP TABLE IF EXISTS ${table_name};
CREATE TABLE IF NOT EXISTS ${table_name} (
    id BIGINT AUTO_INCREMENT NOT NULL,
    chromosome INTEGER NOT NULL,
    position int NOT NULL,
    snp varchar(200) NOT NULL,
    allele_reference varchar(200) NULL,
    allele_alternate varchar(200) NULL,
    allele_frequency double NULL,
    p_value double NULL,
    p_value_nlog double NULL,
    p_value_nlog_expected double NULL,
    p_value_heterogenous double NULL,
    beta double NULL,
    standard_error double NULL,
    odds_ratio double NULL,
    ci_95_low double NULL,
    ci_95_high double NULL,
    n int NULL
    PRIMARY KEY (id, chromosome)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
PARTITION BY list(chromosome) (
    PARTITION `1` VALUES IN (1),
    PARTITION `2` VALUES IN (2),
    PARTITION `3` VALUES IN (3),
    PARTITION `4` VALUES IN (4),
    PARTITION `5` VALUES IN (5),
    PARTITION `6` VALUES IN (6),
    PARTITION `7` VALUES IN (7),
    PARTITION `8` VALUES IN (8),
    PARTITION `9` VALUES IN (9),
    PARTITION `10` VALUES IN (10),
    PARTITION `11` VALUES IN (11),
    PARTITION `12` VALUES IN (12),
    PARTITION `13` VALUES IN (13),
    PARTITION `14` VALUES IN (14),
    PARTITION `15` VALUES IN (15),
    PARTITION `16` VALUES IN (16),
    PARTITION `17` VALUES IN (17),
    PARTITION `18` VALUES IN (18),
    PARTITION `19` VALUES IN (19),
    PARTITION `20` VALUES IN (20),
    PARTITION `21` VALUES IN (21),
    PARTITION `22` VALUES IN (22),
    PARTITION `23` VALUES IN (23),
    PARTITION `24` VALUES IN (24)
);

