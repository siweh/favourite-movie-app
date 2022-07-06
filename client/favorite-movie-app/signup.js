import axios from "axios";

export default function RegisterApiEndpoint() {
  return {
    init() {
    //   this.registerApiEndpoint();
    },
    info_message: '',
    error: false,
    username: "",
    hash_password: "",
    firstname: "",
    lastname: "",
    registerApiEndpoint() {
        if(this.firstname && this.lastname && this.username && this.hash_password){
            const URL_BASE = import.meta.env.VITE_SERVER_URL;
            const url = `${URL_BASE}/api/register`
            axios.post(url, {
                firstname: this.firstname,
                hash_password: this.hash_password,
                username: this.username,
                lastname: this.lastname,
            })
            .then((response) => {
            console.log(response);
            }).catch(error => {
                console.log(error.response)
            });
            this.info_message = 'Successfully registered';
            this.error = false;
            
        }else{
            this.info_message = 'Please fill in all the required fields';
            this.error = true;
        }
    }
  }
}