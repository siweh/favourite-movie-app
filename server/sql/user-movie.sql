create table user(
	id serial not null primary key,
	username text not null,
	hash_password varchar not null,
	firstname text not null,
	lastname text not null
);

create table movie(
    id serial primary key,
    movie_name text not null,
    movie_url text not null
);

create table user_playlist (
	id serial primary key,
    users_id int,
    movie_id int,
	foreign key (users_id) references user(id),
    foreign key (movie_id) references movie(id)
);

