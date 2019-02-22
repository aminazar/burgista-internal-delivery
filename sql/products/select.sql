select products.*,prices.price as price, units.name as prep_unit_name, units.is_kitchen as prep_unit_is_kitchen
from products
join
    units
on
    units.uid = products.prep_unit_id
left join
    prices
on
    products.pid = prices.product_id where prices.valid_to IS NULL;