export default function LoginApiEndpoint(){
    return{
        init(){
            this.loginApiEndpoint();
            const token = localStorage.getItem('token');
            // console.log(token);
        },
        info_message: '',
        error: false,
        user: {username: '',password: ''},
        loginApiEndpoint(){

            setTimeout(() =>  { 
                this.info_message = '';
                this.error = false;
              }, 3000);

            const { username, password} = this.user;
                if (this.user.username === '' && !this.user.password === ''){
                    this.info_message = 'Please fill in all the required fields';
                    this.error = true;
                }else{
                    const URL_BASE = import.meta.env.VITE_SERVER_URL;
                    const url = `${URL_BASE}/api/login?username=${username}&password=${password}`
                    fetch(url, {
                        // Adding method type
                        method: "POST",
                        
                        // Adding body or contents to send
                        body: JSON.stringify({
                            username: this.user.username,
                            password: this.user.password
                        }),
                        
                        // Adding headers to the request
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        }
                    })
                        .then(r => r.json())
                        .then(result => this.user = result)
                        .then(() => {
                          
                            
                            if(this.user.status === 'success'){
                                this.info_message = 'Successfully loggedIn'
                                // console.log(this.user);
                                this.error = false;
                                localStorage.setItem('token', this.user.data.token);
                            }else{
                                this.info_message = 'Incorrect username or password'
                                this.error = true;
                            }
                        })
                        .catch(error => console.error(error))
                }
        },
        showLoginRegister(){
            const token = localStorage.getItem('token');
            if (token === undefined || token === null){
                return true
            }else{
                return false
            }
        }
    }

}
