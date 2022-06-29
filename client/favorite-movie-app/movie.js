export default function Movies(){
    return{
        init(){

        },
        movie_name: '',
        info_message: '',
        error: false,
        movieList(){
            if(this.movie_name === ''){
                this.info_message = 'Please fill in all the required fields';
                    this.error = true;
            }else{
                var url = `http://localhost:3002/movies?movie_name=${this.movie_name}`
                fetch(url)
                        .then(r => r.json())
                        .then(result => this.movie_name = result)
                        .then(() => {
                            console.log(this.movie_name);
                        });
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
        }
    }
}