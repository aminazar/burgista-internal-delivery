select
    bsddid,
    pid,
    name as product_name,
    code as product_code,
    counting_date,
    bsddid,
    last_count,
    product_count
from
    products
left outer join
(
    select
        last_count.counting_date,
        bsddid,
        product_count,
        last_count.product_id,
        submission_time as last_count
    from
    (
        select
            branch_id,
            product_id,
            max(counting_date) as counting_date
        from
            branch_stock_delivery_date
        where
            (counting_date=${date} or (counting_date<${date} and product_count is null))
            and branch_id = ${uid}
        group by
            branch_id,
            product_id
    ) last_count
    join
        branch_stock_delivery_date s
    on
        last_count.counting_date = s.counting_date
        and last_count.product_id = s.product_id
        and last_count.branch_id = s.branch_id
) last_count_extended
on
    pid = last_count_extended.product_id