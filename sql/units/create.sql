CREATE TABLE units(
    uid serial not null primary key,
    name varchar(40) not null unique,
    username varchar(40) not null unique,
    secret varchar(256) not null,
    is_branch boolean not null,
    is_kitchen boolean NOT NULL DEFAULT false
)