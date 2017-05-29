CREATE TABLE branch_stock_rules(
    bsrid serial not null,
    pid integer not null references products(pid) on delete cascade,
    uid integer not null references units(uid) on delete cascade,
    max integer,
    min integer,
    start_date date,
    end_date date,
    date_rule varchar(256),
    mon_multiple numeric,
    tue_multiple numeric,
    wed_multiple numeric,
    thu_multiple numeric,
    fri_multiple numeric,
    sat_multiple numeric,
    sun_multiple numeric,
    usage numeric,
    PRIMARY KEY(pid, uid)
)