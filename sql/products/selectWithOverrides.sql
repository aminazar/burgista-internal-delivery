select
    branch_stock_rules.*,products.*,products.pid as pid
from
    products
join
    units up
on
    up.uid = products.prep_unit_id
join
    units ur
on
    ur.uid = ${uid}
left outer join
    branch_stock_rules
on
    branch_stock_rules.uid=${uid}
    and branch_stock_rules.pid = products.pid
where
    ur.is_kitchen = up.is_kitchen