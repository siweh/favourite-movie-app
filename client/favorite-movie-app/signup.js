import axios from "axios";

export default function RegisterApiEndpoint() {
  return {
    init() {
    //   this.registerApiEndpoint();
    },
    username: "",
    hash_password: "",
    firstname: "",
    lastname: "",
    registerApiEndpoint() {
            axios.post("http://localhost:3002/api/register", {
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
    }
  }
}