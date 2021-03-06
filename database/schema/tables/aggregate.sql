DROP TABLE IF EXISTS ${table_name};
CREATE TABLE IF NOT EXISTS ${table_name} (
    `id` BIGINT AUTO_INCREMENT NOT NULL,
    `phenotype_id` INTEGER NOT NULL,
    `sex` VARCHAR(20),
    `ancestry` VARCHAR(20),
    `chromosome` ENUM(
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        'X',
        'Y'
    ) NOT NULL,
    `position_abs` BIGINT NOT NULL,
    `p_value_nlog` DOUBLE NOT NULL,
    PRIMARY KEY (id, phenotype_id)
);