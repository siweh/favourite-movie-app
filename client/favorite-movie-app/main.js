import './style.css'

import Alpine from 'alpinejs'
import LoginApiEndpoint from './login';
import RegisterApiEndpoint from './register';
 
window.Alpine = Alpine

Alpine.start()

Alpine.data('loginData', LoginApiEndpoint);

Alpine.data('registerData', RegisterApiEndpoint);

// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `

document.querySelector('#app').innerHTML = "I 💚 Alpine JS!"