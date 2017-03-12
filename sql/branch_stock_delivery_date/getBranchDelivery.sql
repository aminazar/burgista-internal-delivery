select
    *,products.pid as product_id
from
    products
left outer join (
    select
        bsddid,
        product_count,
        submission_time,
        is_delivery_finalised,
        real_delivery,
        last_count.product_id,
        last_count.counting_date
    from
        branch_stock_delivery_date
    join
    (
        select
            product_id,
            branch_id,
            max(counting_date) as counting_date
        from
            branch_stock_delivery_date
        group by
            product_id,
            branch_id
    ) last_count
    on
        last_count.product_id = branch_stock_delivery_date.product_id
        and last_count.counting_date = branch_stock_delivery_date.counting_date
        and last_count.branch_id = branch_stock_delivery_date.branch_id
    where
        branch_stock_delivery_date.branch_id = ${uid}
    ) aggreg
on
    aggreg.product_id = products.pid
left outer join
    branch_stock_rules
on
    products.pid = branch_stock_rules.pid
--where
--    prep_unit_id = ${prep_uid}
--    and uid = ${uid}