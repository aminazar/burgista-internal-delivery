select
    *
from
(
    select
        bsddid
        product_count,
        submission_time,
        is_delivery_finalised,
        real_delivery,
        product_id
    from
        branch_stock_delivery_date
    where
        branch_id = ${uid}
        and counting_date <= ${date}
    order by
        submission_time desc
    limit 1
) last_count
join
    products
on
    last_count.product_id = products.pid
left outer join
    branch_stock_rules
on
    last_count.product_id = branch_stock_rules.pid
    and uid = ${uid}