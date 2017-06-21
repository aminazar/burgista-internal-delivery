select products.* , units.is_kitchen as prep_is_kitchen
from products inner join units on products.prep_unit_id = units.uid