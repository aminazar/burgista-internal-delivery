select products.*,prices.price as price from products
left outer join prices on products.pid = prices.product_id and prices.valid_to IS NULL
where lower(products.name) = lower(${name});