SELECT
	branch_stock_rules.*,
	products.*,
	products.pid AS pid 
FROM
	products
	JOIN units up ON up.uid = products.prep_unit_id
	JOIN units ur ON ur.uid = ${uid}
	LEFT OUTER JOIN branch_stock_rules ON branch_stock_rules.uid =${uid} 
	AND branch_stock_rules.pid = products.pid 
WHERE
	ur.is_kitchen = up.is_kitchen