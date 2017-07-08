select branch_stock_delivery_date.*,units.name as branch_name,products.name as product_name, products.code as product_code
    , prices.price as product_price, price * real_delivery as subtotal
from branch_stock_delivery_date
left outer join
    prices
on
    branch_stock_delivery_date.product_id = prices.product_id
    and valid_from <= branch_stock_delivery_date.counting_date
    and (valid_to is null or valid_to >= branch_stock_delivery_date.counting_date)
join
    products
on
    branch_stock_delivery_date.product_id = products.pid
join
    units
on
    branch_stock_delivery_date.branch_id = units.uid
where counting_date >= ${start_date}
    and counting_date <= ${end_date}
    and real_delivery is not null
    and branch_id = ${branch_id};