CREATE TABLE units(
    uid serial not null primary key,
    name varchar(40) not null unique,
    username varchar(40) not null unique,
    secret varchar(256) not null,
    branch_or_prep boolean not null
)