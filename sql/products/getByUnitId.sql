select products.*,prices.price as price from products
left join prices on products.pid = prices.product_id where prices.valid_to IS NULL and products.prep_unit_id = ${prep_unit_id}
