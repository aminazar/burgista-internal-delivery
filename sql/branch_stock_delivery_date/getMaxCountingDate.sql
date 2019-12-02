SELECT
    bsdd.*,
	t1.counting_date as last_counting_date,
	bsdd.product_count as last_product_count
FROM
	branch_stock_delivery_date bsdd
	JOIN ( 
        SELECT 
            product_id,
            branch_id,
            MAX ( counting_date ) AS counting_date
        FROM 
            branch_stock_delivery_date 
        WHERE branch_id = ${uid} AND counting_date < ${date} AND submission_time is not null
        GROUP BY product_id, branch_id ) t1 
    ON t1.product_id = bsdd.product_id 
	AND t1.branch_id = bsdd.branch_id 
	AND t1.counting_date = bsdd.counting_date
