select
	*,
	products.pid as product_id
from
	products
left outer join (
	select
		s.bsddid,
		s.product_count,
		last_count.submission_time,
		last_count.product_count as last_product_count,
		s.is_delivery_finalised,
		s.real_delivery,
		s.product_id,
		s.counting_date
	from
		branch_stock_delivery_date s
	left outer join (
		select
			s2.*
		from
			(
				select product_id,
				branch_id,
				max(counting_date) as counting_date
			from
				branch_stock_delivery_date
			where
				counting_date <= ${date}
				and branch_id = ${uid}
				and submission_time is not null
			group by
				product_id,
				branch_id) s1
		join branch_stock_delivery_date s2 on
			s1.product_id = s2.product_id
			and s1.branch_id = s2.branch_id
			and s1.counting_date = s2.counting_date ) last_count on
		last_count.product_id = s.product_id
		and last_count.branch_id = s.branch_id
	where
		s.branch_id = ${uid}
		and ( s.counting_date = ${date}
		or s.submission_time = ${date}
		or (s.real_delivery + s.product_count < s.min_stock
		and s.counting_date + 3 > ${date}
		and s.counting_date < ${date}
		and s.counting_date <= ${date})
		or (s.real_delivery is null
		and s.counting_date + 3 > ${date}
		and s.counting_date <= ${date}) ) ) aggreg on
	aggreg.product_id = products.pid
left outer join branch_stock_rules bsr on
	products.pid = bsr.pid
	and bsr.uid = ${uid}
where
	prep_unit_id = ${prep_uid}
	and (bsr.date_rule <> ''
	or (bsr.date_rule is null
	and products.default_date_rule <> ''))
