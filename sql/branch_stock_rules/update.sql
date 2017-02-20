UPDATE branch_stock_rules
SET max = ${max}
    , min = ${min}
    , start_date = ${start_date}
    , end_date = ${end_date}
    , date_rule = ${date_rule}
    , usage = ${usage}
WHERE pid = ${pid} and uid = ${uid}