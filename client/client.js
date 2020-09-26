import {MewComponent} from './MewComponent.js';
import {ApiEndpoints} from './ApiEndpoints.js';

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');

const showForm = () => form.style.display = '';
const hideForm = () => form.style.display = 'none';
const showLoadingElement = () => loadingElement.style.display = '';
const hideLoadingElement = () => loadingElement.style.display = 'none';

const apiEndpoints = new ApiEndpoints();

function listAllMews () {
    mewsElement.innerHTML = '';
    apiEndpoints.getAllMews()        
        .then(mews => {
            hideLoadingElement();
            mews.reverse();
            mews.forEach(mew => {
                mewsElement.append(new MewComponent(mew, apiEndpoints, listAllMews).getElement());
            });
        });
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const mew = {
        name,
        content
    };

    hideForm();
    showLoadingElement();

    console.log('Posting mew...');

    apiEndpoints.postMew(mew)
        .then(createdMew => {
            console.log(createdMew);
            form.reset();
            showForm();
            listAllMews();
        });
});

showForm();
showLoadingElement();
listAllMews();