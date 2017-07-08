select
    products.*,branch_stock_rules.*,units.name as unit_name, units.is_kitchen as unit_is_kitchen
from
    products
join
    units
on
    units.uid = products.prep_unit_id
left outer join
    branch_stock_rules
on
    branch_stock_rules.uid=${uid}
    and branch_stock_rules.pid = products.pid
where
    products.pid=${pid}