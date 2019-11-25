SELECT
	* ,
	CASE
		WHEN pro.default_date_rule = null THEN bsr.date_rule
		WHEN pro.default_date_rule = '' THEN bsr.date_rule
		ELSE pro.default_date_rule
	END as "product_date_rule"
FROM
	branch_stock_delivery_date bsdd
	INNER JOIN products pro ON pro.pid = bsdd.product_id 
	LEFT OUTER JOIN branch_stock_rules bsr on bsr.pid = bsdd.product_id
WHERE
	bsdd.branch_id = ${uid} 
	AND ( counting_date + 3 > ${date} OR bsdd.insert_time >= ${date} )
	
	