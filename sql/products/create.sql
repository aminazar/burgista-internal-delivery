CREATE TABLE products(
    pid serial not null primary key,
    prep_unit_id integer not null references units(uid),
    code varchar(10) not null unique,
    name varchar(50) not null unique,
    size integer not null,
    measuring_unit varchar(10) not null,
    default_max integer not null,
    default_min integer not null,
    default_date_rule varchar(256) not null,
    default_mon_multiple numeric default 1 not null,
    default_tue_multiple numeric default 1 not null,
    default_wed_multiple numeric default 1 not null,
    default_thu_multiple numeric default 1 not null,
    default_fri_multiple numeric default 1 not null,
    default_sat_multiple numeric default 1 not null,
    default_sun_multiple numeric default 1 not null,
    default_usage numeric default 1 not null
);