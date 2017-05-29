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
        branch_stock_delivery_date s
    join
    (
        select
            product_id,
            branch_id,
            max(counting_date) as counting_date
        from
            branch_stock_delivery_date
        where
            counting_date <= ${date}
        group by
            product_id,
            branch_id
    ) last_count
    on
        last_count.product_id = s.product_id
        and last_count.counting_date = s.counting_date
        and last_count.branch_id = s.branch_id
    where
        s.branch_id = ${uid}
        and
        (
            s.counting_date = ${date}
            or s.submission_time = ${date}
            or s.real_delivery + s.product_count < s.min_stock
            or s.real_delivery is null
        )
    ) aggreg
on
    aggreg.product_id = products.pid
left outer join
    branch_stock_rules
on
    products.pid = branch_stock_rules.pid
    and branch_stock_rules.uid = ${uid}
where
    prep_unit_id = ${prep_uid}
