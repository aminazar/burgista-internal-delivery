SELECT
	CASE	
		WHEN bsr.date_rule IS NOT NULL AND bsr.date_rule <> '' THEN bsr.date_rule 
		ELSE pro.default_date_rule 
	END AS "product_date_rule",
	bsr.*,
	pro.*,
	pro.pid AS pid,
	bsdd.* 
FROM
	products pro
	JOIN units up ON up.uid = pro.prep_unit_id
	JOIN units ur ON ur.uid = ${uid}
	LEFT OUTER JOIN branch_stock_rules bsr ON bsr.uid = ${uid}
	AND bsr.pid = pro.pid
	INNER JOIN branch_stock_delivery_date bsdd ON bsdd.product_id = pro.pid 
	OR bsdd.product_id = bsr.pid 
WHERE
	bsdd.branch_id = ${uid} 
	AND (bsdd.ref_type_id < 900 OR bsdd.ref_type_id is null)
    AND ( counting_date + 4 > ${date} AND counting_date < ${date} ) -- in earlier days
    AND bsdd.product_count is null 
    AND bsdd.delivery_submission_time is null
    AND bsdd.is_delivery_finalised is false -- check delivery is not finalized
ORDER BY counting_date desc

