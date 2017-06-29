select products.* , units.is_kitchen as prep_is_kitchen, prices.price
from products
inner join units on products.prep_unit_id = units.uid
left join prices on products.pid = prices.product_id where prices.valid_to IS NULL;