CREATE TABLE last_login(
    lid serial not null primary key,
    login_uid integer not null references units(uid) on delete cascade,
    login_date_time date not null,
    previous_login_date_time date
)