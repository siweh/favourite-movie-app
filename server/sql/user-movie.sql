create table movie_user(
	id serial not null primary key,
	username text not null,
	hash_password varchar not null,
	firstname text not null,
	lastname text not null
);

create table user_playlist (
	id serial primary key,
    users_id int,
	movie_name text not null,
	movie_url text not null,
	foreign key (users_id) references movie_user(id)
);