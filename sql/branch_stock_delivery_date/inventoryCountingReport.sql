select
    u.name as branch_name,
    products.name as product_name,
    u.uid as branch_id,
    products.code as product_code,
    s.bsddid as delivery_id,
    s.counting_date,
    s.product_count,
    s.real_delivery,
    products.default_date_rule as rrule,
    branch_stock_rules.date_rule as overridden_rrule,
    products.pid as product_id
from
(
    select
        branch_id,
        product_id,
        max(counting_date) as counting_date
     from
        branch_stock_delivery_date
    where
        product_count is not null
        and real_delivery is not null
    group by
        branch_id,product_id
    union(
        select
            o.branch_id,
            o.product_id,
            max(o.counting_date) as counting_date
        from
            branch_stock_delivery_date o
        join
        (
            select
                branch_id,
                product_id,
                max(counting_date)
            from
                branch_stock_delivery_date
            where
                product_count is not null
                and real_delivery is not null
            group by
                branch_id,
                product_id
        ) i
        on
            o.counting_date<i.max
            and o.branch_id=i.branch_id
            and o.product_id=i.product_id
        where
            o.product_count is not null
        group by
            o.branch_id,
            o.product_id
    )
) last_counts
join
    branch_stock_delivery_date s
on
    s.product_id = last_counts.product_id
    and s.branch_id = last_counts.branch_id
    and s.counting_date = last_counts.counting_date
join
    units u
on
    u.uid = s.branch_id
join
    products
on
    products.pid = s.product_id
left outer join
    branch_stock_rules
on
    branch_stock_rules.pid = s.product_id
    and branch_stock_rules.uid = s.branch_id
order by
    last_counts.branch_id,
    last_counts.product_id,
    last_counts.counting_date desc