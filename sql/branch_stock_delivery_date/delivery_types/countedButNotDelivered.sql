SELECT
	*
FROM
	branch_stock_delivery_date bsdd
	JOIN (
	SELECT
		DISTINCT on (pro.pid) *,
		pro.pid as product_id,
	CASE
		WHEN bsr.date_rule IS NOT NULL AND bsr.date_rule  <> '' THEN bsr.date_rule 
		ELSE pro.default_date_rule 
	END AS "product_date_rule" 
	FROM
		products pro
		LEFT OUTER JOIN branch_stock_rules bsr ON bsr.pid = pro.pid
		ORDER BY pro.pid 
	) t1 on t1.product_id = bsdd.product_id
WHERE
	bsdd.branch_id = ${uid} 
	AND (bsdd.ref_type_id < 900 OR bsdd.ref_type_id is null)
    AND ( counting_date + 3 > ${date} AND counting_date < ${date} ) 
    AND (
		bsdd.product_count IS NOT NULL 
		AND bsdd.is_delivery_finalised is false 
		AND bsdd.delivery_submission_time is null
		) 
