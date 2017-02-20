CREATE TABLE branch_stock_rules(
    bsrid serial not null,
    pid serial not null references products(pid),
    uid serial not null references units(uid),
    max integer,
    min integer,
    start_date date,
    end_date date,
    date_rule varchar(256),
    multiples integer,
    PRIMARY KEY(pid, uid)
)