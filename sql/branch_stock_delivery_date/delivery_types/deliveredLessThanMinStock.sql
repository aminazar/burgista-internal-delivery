SELECT
	*
FROM
	branch_stock_delivery_date bsdd
	JOIN (
	SELECT
		DISTINCT on (pro.pid) *,
		pro.pid as product_id,
	CASE
			WHEN pro.default_date_rule = NULL THEN
			bsr.date_rule 
			WHEN pro.default_date_rule = '' THEN
			bsr.date_rule ELSE pro.default_date_rule 
		END AS "product_date_rule" 
	FROM
		products pro
		LEFT OUTER JOIN branch_stock_rules bsr ON bsr.pid = pro.pid
		ORDER BY pro.pid 
	) t1 on t1.product_id = bsdd.product_id
WHERE
	bsdd.branch_id = ${uid}
	AND (bsdd.ref_type_id < 900 OR bsdd.ref_type_id is null)
    AND ( counting_date + 3 > ${date} AND counting_date < ${date} ) -- in earlier days
    AND bsdd.product_count is not null -- have product count
    AND (
        bsdd.product_count + bsdd.real_delivery < bsdd.min_stock  -- check expected count
        AND bsdd.delivery_submission_time is not null -- check delivery is submitted
        -- AND bsdd.is_delivery_finalised is true -- check delivery is finalized
        )
