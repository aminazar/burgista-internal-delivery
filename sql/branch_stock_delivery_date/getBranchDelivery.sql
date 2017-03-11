select
    *
from
    products
join (
    select
        bsddid,
        product_count,
        max(submission_time),
        is_delivery_finalised,
        real_delivery,
        product_id,
        max(counting_date)
    from
        products
    left outer join
    (
        select
            bsddid,
            product_count,
            submission_time,
            is_delivery_finalised,
            real_delivery,
            product_id,
            counting_date
        from
            branch_stock_delivery_date
        where
            branch_id = ${uid}
            and (
                counting_date = ${date}
                or (counting_date < ${date} and real_delivery is null)
                )
    ) last_count
    on
        last_count.product_id = products.pid
    where
        products.prep_unit_id = ${prep_uid}
    group by
        bsddid,
        product_count,
        is_delivery_finalised,
        real_delivery,
        product_id
    ) aggreg
on
    aggreg.product_id = products.pid
left outer join
    branch_stock_rules
on
    products.pid = branch_stock_rules.pid
    and uid = ${uid}