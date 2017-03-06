CREATE TABLE branch_stock_delivery_date(
    bsddid serial not null primary key,
    product_id integer not null references products(pid) on delete cascade,
    branch_id integer not null references units(uid) on delete cascade,
    counting_date date not null,
    submission_time time,
    min_stock integer not null,
    product_count integer,
    real_delivery integer,
)