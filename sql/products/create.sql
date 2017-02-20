CREATE TABLE products(
    pid serial not null primary key,
    prep_unit_id serial not null references units(uid),
    code varchar(10) not null unique,
    name varchar(50) not null,
    size integer not null,
    measuring_unit varchar(5) not null,
    default_max integer not null,
    default_min integer not null,
    default_date_rule varchar(256) not null,
    default_multiples integer default 1 not null
);