CREATE TABLE branch_stock_delivery_date(
    bsddid serial not null primary key,
    product_id integer not null references products(pid) on delete cascade,
    branch_id integer not null references units(uid) on delete cascade,
    counting_date date not null,
    submission_time timestamp with time zone,
    delivery_submission_time timestamp with time zone,
    min_stock integer not null,
    product_count integer,
    real_delivery integer,
    insert_time timestamp with time zone,
    is_delivery_finalised boolean not null default false,
    unique(branch_id,product_id,counting_date)
)

