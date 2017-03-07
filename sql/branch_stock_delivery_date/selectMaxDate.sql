select
    counting_date,
    bsddid,
    pid,
    product_code,
    product_name,
    last_count
from (
    select
        bsddid,
        pid,
        products.code as product_code,
        products.name as product_name,
        counting_date,
        branch_id
    from
        products
    left outer join
        branch_stock_delivery_date
    on
        product_id = pid
        and branch_id=${uid}
        and counting_date <= ${date}
        and (counting_date=${date} or product_count is null)
) as main_list
left outer join (
    select
        max(submission_time) as last_count,
        product_id,
        branch_id
    from
        branch_stock_delivery_date
    where
        branch_id=${uid}
        and counting_date <= ${date}
        and product_count is not null
    group by
    product_id,
    branch_id
) as last_count_list
on
    main_list.pid = last_count_list.product_id