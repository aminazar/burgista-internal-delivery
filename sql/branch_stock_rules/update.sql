UPDATE branch_stock_rules
SET max = ${max}
    , min = ${min}
    , start_date = ${start_date}
    , end_date = ${end_date}
    , date_rule = ${date_rule}
    , mon_multiple = ${mon_multiple}
    , tue_multiple = ${tue_multiple}
    , wed_multiple = ${wed_multiple}
    , thu_multiple = ${thu_multiple}
    , fri_multiple = ${fri_multiple}
    , sat_multiple = ${sat_multiple}
    , sun_multiple = ${sun_multiple}
    , usage = ${usage}
WHERE pid = ${pid} and uid = ${uid}