select products.* , units.is_kitchen as prep_is_kitchen, prices.price
from products
join units on products.prep_unit_id = units.uid
left outer join prices on products.pid = prices.product_id and prices.valid_to IS NULL;