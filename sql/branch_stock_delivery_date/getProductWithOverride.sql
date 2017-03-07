select
    *
from
    products
left outer join
    branch_stock_rules
on
    uid=${uid}
    and branch_stock_rules.pid = products.pid
where
    products.pid=${pid}