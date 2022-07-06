export default function Movies(){
    return{
        init(){

        },
        movies: [],
        playlist: [],
        movie_name: '',
        info_message: '',
        error: false,
        movieList(){

            setTimeout(() =>  { 
                this.info_message = '';
                this.error = false;
              }, 3000);

            if(this.movie_name === ''){
                this.info_message = 'Please fill in all the required fields';
                    this.error = true;
            }else{
                const URL_BASE = import.meta.env.VITE_SERVER_URL;
                const url = `${URL_BASE}/movies?movie_name=${this.movie_name}`
                fetch(url)
                        .then(r => r.json())
                        .then(result => this.movies = result.data)
                        .then(() => {
                            console.log(this.movies);
                        });
                        console.log(this.movies);
                        console.log(this.movie_name);
            }
            return this.movies;
        },

        addToPlaylist(movie){
            const token = localStorage.getItem('token');

            if (token !== undefined || token !== null){
                const URL_BASE = import.meta.env.VITE_SERVER_URL;
                const url = `${URL_BASE}/playlist`
                fetch(url, {
                        // Adding method type
                        method: "POST",
                        
                        // Adding body or contents to send
                        body: JSON.stringify({
                            "movie":{
                                movie_name: movie.movie_name,
                                movie_url: movie.movie_url
                            },
                            "token": token
                        }),
                        
                        // Adding headers to the request
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    })
                    .then(r => r.json())
                    .then(result => console.log(result))
                    .catch(error => console.error(error))
            }
            
        },

        getPlaylist(){
            const token = localStorage.getItem('token');

            if (token !== undefined || token !== null){
                const URL_BASE = import.meta.env.VITE_SERVER_URL;
                const url = `${URL_BASE}/api/playlist?${token}`
                fetch(url)
                    .then(r => r.json())
                    .then(result => console.log(result))
                    .catch(error => console.error(error))
            }
            
        },
        

        showMovieList(){
            const token = localStorage.getItem('token');
            if (token === undefined || token === null){
                return false
            }else{
                return true
            }    
        },

        logOut(){
            localStorage.clear();
            location.reload();
        }
    }
}