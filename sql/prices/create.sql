CREATE TABLE prices(
    price_id serial not null primary key,
    product_id integer not null references products(pid) on delete cascade,
    price money not null,
    valid_from date not null,
    valid_to date
)

