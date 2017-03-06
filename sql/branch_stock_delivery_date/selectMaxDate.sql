select max(counting_date) as last_count, bsddid, pid, product_code, product_name from (
    select
        bsddid, pid, products.code as product_code, products.name as product_name, counting_date
    from
        products
    left outer join
        branch_stock_delivery_date
    on
        product_id = pid
        and branch_id=3
        and product_count is not null
        and counting_date = (
            select
                max(counting_date)
            from
                branch_stock_delivery_date
            where
                counting_date <= current_date
                and branch_id=${uid}
                and product_id=${pid}
                and product_count is null
        )
)
group by
    bsdid, pid