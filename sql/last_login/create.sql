CREATE TABLE last_login(
    uid serial not null primary key,
    login_uid serial not null references units(uid),
    login_date_time date not null
)