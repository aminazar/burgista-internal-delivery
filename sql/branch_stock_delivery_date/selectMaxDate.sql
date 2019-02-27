select
	bsddid,
	pid,
	name as product_name,
	code as product_code,
	counting_date,
	last_count,
	product_count,
	default_date_rule,
	date_rule
from
	products
join (
	select
       s.counting_date,
       s.bsddid,
       s.product_id,
       s.product_count,
       last_count.counting_date as last_count,
       date_rule
	from
		branch_stock_delivery_date s
	left outer join (
			select
				branch_id,
				product_id,
				max(counting_date) as counting_date
			from
				branch_stock_delivery_date
			where
				counting_date <= ${date}
				and branch_id = ${uid}
				and submission_time is not null
			group by
				branch_id,
				product_id) last_count on
		s.product_id = last_count.product_id
		and s.branch_id = last_count.branch_id
	left outer join branch_stock_rules bsr on
		bsr.pid = s.product_id
		and bsr.uid = ${uid}
	where
	s.branch_id=${uid} and	
	(s.counting_date = ${date}
		or s.product_count is null
        or s.real_delivery + s.product_count < s.min_stock
        or s.real_delivery is null)
        and
            (s.counting_date + 3 > ${date} or s.insert_time >= ${date})
		 ) last_count_extended on
	products.pid = last_count_extended.product_id
where
	last_count_extended.date_rule <> ''
	or (last_count_extended.date_rule is null
	and products.default_date_rule <> '')
