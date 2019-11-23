SELECT 
    branch_id,
    product_id,
    MAX (counting_date) AS counting_date
FROM branch_stock_delivery_date 
WHERE counting_date <= ${date} AND branch_id = ${uid}  AND submission_time IS NOT NULL