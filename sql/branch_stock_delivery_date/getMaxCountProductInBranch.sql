SELECT
	*
FROM 
    products p
	left outer join branch_stock_rules bsr on bsr.pid = p.pid
WHERE bsr.uid = ${uid} AND p.pid in (${product_ids:csv})
