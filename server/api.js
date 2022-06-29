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

            let registered_users = `insert into movie_user(username, hash_password, firstname, lastname) values($1, $2, $3, $4)`
            await db.one(registered_users, [username, hash, firstname, lastname]);
            console.log(registered_users);

            if (!username || !firstname || !hash_password || !lastname) {
                res.json({
                    status: 'error',
                    message: 'Please fill all required fields.',
                });
            }

            // const token = jwt.sign(
            //     { username: registered_users.username},
            //     process.env.ACCESS_TOKEN_SECRET,
            //     {
            //     expiresIn: "2h",
            //     }
            // );

            res.json({
				status: 'success',
                message: 'successfully registered'
			});
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
            console.log(get_user.data);
            if (get_user === null){
                throw Error('User is not available');
            }
            let results = await bcrypt.compare(password, get_user.hash_password);
            console.log({results});

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
            const results = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=fe3d1ab3cd2a855479187dd7be1df63b&query=${movie_name}`);
            //console.log(req.user.id);
            //console.log(results);
            res.json(results.data);
        } catch (error) {
            console.log(error);
        }
    });

    app.get('/playlist', async function(req, res){
        try {
            const { movie_name } = req.query;
            const results = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=fe3d1ab3cd2a855479187dd7be1df63b&query=diehard`);
            //console.log(req.user.id);
            //console.log(results);
            res.json(results.data);
        } catch (error) {
            console.log(error);
        }
    })
};