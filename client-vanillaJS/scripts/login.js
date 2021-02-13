import {Api} from './Api.js';
const api = new Api();

const form = document.querySelector('form');

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    api.loginUser(email, password);
});