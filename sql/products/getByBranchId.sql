select products.*,prices.price as price
from
    products
join
    (select *  from units where units.is_kitchen = (select is_kitchen from units where uid = ${branch_id})
    and is_branch = false ) u
on
    products.prep_unit_id = u.uid
left join
    prices
on
    products.pid = prices.product_id
where
    prices.valid_to IS NULL
