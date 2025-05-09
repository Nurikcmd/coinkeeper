
    create table categories (
        id bigserial not null,
        user_id bigint not null,
        color varchar(255),
        icon varchar(255),
        name varchar(255) not null,
        primary key (id)
    );

    create table transactions (
        amount numeric(38,2) not null,
        category_id bigint not null,
        date timestamp(6) not null,
        id bigserial not null,
        user_id bigint not null,
        comment varchar(255),
        type varchar(255) not null check (type in ('INCOME','EXPENSE')),
        primary key (id)
    );

    create table users (
        created_at timestamp(6),
        id bigserial not null,
        email varchar(255) not null unique,
        name varchar(255) not null,
        password varchar(255) not null,
        primary key (id)
    );

    alter table if exists categories 
       add constraint FKghuylkwuedgl2qahxjt8g41kb 
       foreign key (user_id) 
       references users;

    alter table if exists transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories;

    alter table if exists transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users;

    create table categories (
        id bigserial not null,
        user_id bigint not null,
        color varchar(255),
        icon varchar(255),
        name varchar(255) not null,
        primary key (id)
    );

    create table transactions (
        amount numeric(38,2) not null,
        category_id bigint not null,
        date timestamp(6) not null,
        id bigserial not null,
        user_id bigint not null,
        comment varchar(255),
        type varchar(255) not null check (type in ('INCOME','EXPENSE')),
        primary key (id)
    );

    create table users (
        created_at timestamp(6),
        id bigserial not null,
        email varchar(255) not null unique,
        name varchar(255) not null,
        password varchar(255) not null,
        primary key (id)
    );

    alter table if exists categories 
       add constraint FKghuylkwuedgl2qahxjt8g41kb 
       foreign key (user_id) 
       references users;

    alter table if exists transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories;

    alter table if exists transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users;

    create table categories (
        id bigserial not null,
        user_id bigint not null,
        color varchar(255),
        icon varchar(255),
        name varchar(255) not null,
        primary key (id)
    );

    create table transactions (
        amount numeric(38,2) not null,
        category_id bigint not null,
        date timestamp(6) not null,
        id bigserial not null,
        user_id bigint not null,
        comment varchar(255),
        type varchar(255) not null check (type in ('INCOME','EXPENSE')),
        primary key (id)
    );

    create table users (
        created_at timestamp(6),
        id bigserial not null,
        email varchar(255) not null unique,
        name varchar(255) not null,
        password varchar(255) not null,
        primary key (id)
    );

    alter table if exists categories 
       add constraint FKghuylkwuedgl2qahxjt8g41kb 
       foreign key (user_id) 
       references users;

    alter table if exists transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories;

    alter table if exists transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users;

    create table categories (
        id bigserial not null,
        user_id bigint not null,
        color varchar(255),
        icon varchar(255),
        name varchar(255) not null,
        primary key (id)
    );

    create table transactions (
        amount numeric(38,2) not null,
        category_id bigint not null,
        date timestamp(6) not null,
        id bigserial not null,
        user_id bigint not null,
        comment varchar(255),
        type varchar(255) not null check (type in ('INCOME','EXPENSE')),
        primary key (id)
    );

    create table users (
        created_at timestamp(6),
        id bigserial not null,
        email varchar(255) not null unique,
        name varchar(255) not null,
        password varchar(255) not null,
        primary key (id)
    );

    alter table if exists categories 
       add constraint FKghuylkwuedgl2qahxjt8g41kb 
       foreign key (user_id) 
       references users;

    alter table if exists transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories;

    alter table if exists transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users;

    create table categories (
        id bigserial not null,
        user_id bigint not null,
        color varchar(255),
        icon varchar(255),
        name varchar(255) not null,
        primary key (id)
    );

    create table transactions (
        amount numeric(38,2) not null,
        category_id bigint not null,
        date timestamp(6) not null,
        id bigserial not null,
        user_id bigint not null,
        comment varchar(255),
        type varchar(255) not null check (type in ('INCOME','EXPENSE')),
        primary key (id)
    );

    create table users (
        created_at timestamp(6),
        id bigserial not null,
        email varchar(255) not null unique,
        name varchar(255) not null,
        password varchar(255) not null,
        primary key (id)
    );

    alter table if exists categories 
       add constraint FKghuylkwuedgl2qahxjt8g41kb 
       foreign key (user_id) 
       references users;

    alter table if exists transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories;

    alter table if exists transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users;

    create table categories (
        id bigserial not null,
        user_id bigint not null,
        color varchar(255),
        icon varchar(255),
        name varchar(255) not null,
        primary key (id)
    );

    create table transactions (
        amount numeric(38,2) not null,
        category_id bigint not null,
        date timestamp(6) not null,
        id bigserial not null,
        user_id bigint not null,
        comment varchar(255),
        type varchar(255) not null check (type in ('INCOME','EXPENSE')),
        primary key (id)
    );

    create table users (
        created_at timestamp(6),
        id bigserial not null,
        email varchar(255) not null unique,
        name varchar(255) not null,
        password varchar(255) not null,
        primary key (id)
    );

    alter table if exists categories 
       add constraint FKghuylkwuedgl2qahxjt8g41kb 
       foreign key (user_id) 
       references users;

    alter table if exists transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories;

    alter table if exists transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users;

    create table categories (
        id bigserial not null,
        user_id bigint not null,
        color varchar(255),
        icon varchar(255),
        name varchar(255) not null,
        primary key (id)
    );

    create table transactions (
        amount numeric(38,2) not null,
        category_id bigint not null,
        date timestamp(6) not null,
        id bigserial not null,
        user_id bigint not null,
        comment varchar(255),
        type varchar(255) not null check (type in ('INCOME','EXPENSE')),
        primary key (id)
    );

    create table users (
        created_at timestamp(6),
        id bigserial not null,
        email varchar(255) not null unique,
        name varchar(255) not null,
        password varchar(255) not null,
        primary key (id)
    );

    alter table if exists categories 
       add constraint FKghuylkwuedgl2qahxjt8g41kb 
       foreign key (user_id) 
       references users;

    alter table if exists transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories;

    alter table if exists transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users;

    create table categories (
        id bigserial not null,
        user_id bigint not null,
        color varchar(255),
        icon varchar(255),
        name varchar(255) not null,
        primary key (id)
    );

    create table transactions (
        amount numeric(38,2) not null,
        category_id bigint not null,
        date timestamp(6) not null,
        id bigserial not null,
        user_id bigint not null,
        comment varchar(255),
        type varchar(255) not null check (type in ('INCOME','EXPENSE')),
        primary key (id)
    );

    create table users (
        created_at timestamp(6),
        id bigserial not null,
        email varchar(255) not null unique,
        name varchar(255) not null,
        password varchar(255) not null,
        primary key (id)
    );

    alter table if exists categories 
       add constraint FKghuylkwuedgl2qahxjt8g41kb 
       foreign key (user_id) 
       references users;

    alter table if exists transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories;

    alter table if exists transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users;

    create table categories (
        id bigserial not null,
        user_id bigint not null,
        color varchar(255),
        icon varchar(255),
        name varchar(255) not null,
        primary key (id)
    );

    create table transactions (
        amount numeric(38,2) not null,
        category_id bigint not null,
        date timestamp(6) not null,
        id bigserial not null,
        user_id bigint not null,
        comment varchar(255),
        type varchar(255) not null check (type in ('INCOME','EXPENSE')),
        primary key (id)
    );

    create table users (
        created_at timestamp(6),
        id bigserial not null,
        email varchar(255) not null unique,
        name varchar(255) not null,
        password varchar(255) not null,
        primary key (id)
    );

    alter table if exists categories 
       add constraint FKghuylkwuedgl2qahxjt8g41kb 
       foreign key (user_id) 
       references users;

    alter table if exists transactions 
       add constraint FKsqqi7sneo04kast0o138h19mv 
       foreign key (category_id) 
       references categories;

    alter table if exists transactions 
       add constraint FKqwv7rmvc8va8rep7piikrojds 
       foreign key (user_id) 
       references users;
