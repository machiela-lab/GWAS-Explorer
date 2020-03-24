-- variants table
ALTER TABLE $PHENOTYPE_variant
    ADD INDEX idx_$PHENOTYPE_variant__sex        (sex),
    ADD INDEX idx_$PHENOTYPE_variant__chromosome    (chromosome),
    ADD INDEX idx_$PHENOTYPE_variant__position      (position),
    ADD INDEX idx_$PHENOTYPE_variant__p_value       (p_value),
    ADD INDEX idx_$PHENOTYPE_variant__p_value_nlog  (p_value_nlog),
    ADD INDEX idx_$PHENOTYPE_variant__snp           (snp),
    ADD INDEX idx_$PHENOTYPE_variant__show_qq_plot  (show_qq_plot),
    ADD INDEX idx_$PHENOTYPE_variant__sex_chromosome  (sex, chromosome);

-- aggregated variants table
ALTER TABLE $PHENOTYPE_aggregate
    ADD INDEX idx_$PHENOTYPE_aggregate__sex          (sex),
    ADD INDEX idx_$PHENOTYPE_aggregate__position_abs    (position_abs),
    ADD INDEX idx_$PHENOTYPE_aggregate__p_value_nlog    (p_value_nlog);