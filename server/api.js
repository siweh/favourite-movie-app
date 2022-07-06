const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const axios = require('axios')

module.exports = function(app, db){
    app.get('/api/test', function(req, res){
        res.json({
            name: 'Siweh'
        });
    });
    app.get('/api/users', async function(req, res){
        let users = [];
        const get_all_users = `select * from movie_user`

        users = await db.any(get_all_users);

        res.json({
            data: users,
            message: 'Retrieved ALL users'
        });
    });

    app.post('/api/register', async function(req, res){
        try {
            const { username, firstname, hash_password, lastname} = req.body;

            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(hash_password, salt);

           

            if (username && firstname && hash_password && lastname) {
                let registered_users = `insert into movie_user(username, hash_password, firstname, lastname) values($1, $2, $3, $4)`
                await db.none(registered_users, [username, hash, firstname, lastname]);
                console.log(registered_users);   

                res.json({
				status: 'success',
                message: 'successfully registered'
			});
            }else{
                res.json({
                    status: 'error',
                    message: 'Please fill all required fields.',
                });
            }
            
        } catch (error) {
            console.log(error);
            res.json({
				status: 'error',
				error: error.message
			});
        }
    });

    app.post('/api/login', async function(req, res){
        try{
    
            //console.log(req.query);
            const { username, password } = req.body;

            const get_user = await db.oneOrNone(`select * from movie_user where username = $1`, [username]);
            //console.log(get_user.data);
            if (get_user === null){
                throw Error('User is not available');
            }
            let results = await bcrypt.compare(password, get_user.hash_password);
            //console.log({results});

            if (!results){
                throw Error('Invalid password');
            }

            // const access_token = jwt.sign(get_user, process.env.ACCESS_TOKEN_SECRET);
            console.log(get_user);

            // Create token
        const token = jwt.sign(
            { username: get_user.username},
            process.env.ACCESS_TOKEN_SECRET,
            {
            expiresIn: "2h",
            }
        );
      // save user token
    //   get_user.token = token;
  
      // return new user
    //   res.status(201).json(token);

            res.json({
                status: 'success',
			    data: {"token": token}
		    });
        }catch(error){
            console.log(error);
            res.json({
				status: 'Can not find user',
				error : error.stack
			});
        }
    });

    app.get('/movies', async function(req, res){
        try {
            const { movie_name } = req.query;
            let movie = {"movie_name": "", "movie_url":""};
            let movies = [];
            const results = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=fe3d1ab3cd2a855479187dd7be1df63b&query=${movie_name}`);
            //console.log(req.user.id);
            console.log(results.data.results);
            // console.log(req.query);
            results.data.results.map(m => {
                // if (m.poster_path === undefined || m.poster_path === null){

                // }
                movies.push({"movie_name": m.title, "movie_url":`https://image.tmdb.org/t/p/w500${m.poster_path}`});
            });
            //movies.push({"movie_name": movie_name, "movie_url":"https://diehard.com"}); for testing

            //console.log(movies);
            res.json({data: movies});
        } catch (error) {
            console.log(error);
        }
    });

    app.post('/playlist', async function(req, res){
        try {
            const { token, movie } = req.body;
            const userdata = jwt.decode(token)
            console.log(userdata);
            const username = userdata.username
            console.log(username);
            console.log(movie);

            if (movie) {
                let user = await db.oneOrNone(`select id from movie_user where username = $1`, [username]);
                console.log(user.id);
                let add_to_playlist = `insert into user_playlist(movie_name, movie_url, users_id) values($1, $2, $3)`
                await db.none(add_to_playlist, [movie.movie_name, movie.movie_url, user.id]);
                console.log(add_to_playlist);
                
            }else{
                throw Error("please add a movie")
            }

            res.json({
				status: 'success',
                message: 'movie successfully added to playlist'
			});
        } catch (error) {
            console.log(error);
        }
    })

    app.get('/playlist', async function(req, res){
        try {
            const { token } = req.query;
            const userdata = jwt.decode(token)
            console.log(userdata);
            const username = userdata.username
            console.log(username);

            const playlist = await db.many(`select * from user_playlist up join movie_user u on u.id = up.users_id where u.username = $1`, [username]);
            console.log(playlist);

            res.json({data: playlist});
        } catch (error) {
            console.log(error);
        }
    })
};