CREATE TABLE branch_stock_rules(
    bsrid serial not null,
    pid serial not null references products(pid),
    uid serial not null references units(uid),
    max integer,
    min integer,
    start_date date,
    end_date date,
    date_rule varchar(256),
    mon_multiple integer,
    tue_multiple integer,
    wed_multiple integer,
    thu_multiple integer,
    fri_multiple integer,
    sat_multiple integer,
    sun_multiple integer,
    usage integer,
    PRIMARY KEY(pid, uid)
)