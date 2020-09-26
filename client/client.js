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

function handleResponse(response) {
    if (!response.ok) {
        return response.json()
            .catch(() => {
                // Couldn't parse the JSON
                throw new Error(response.status)
            })
            .then(({message}) => {
                // Got valid JSON with error response, use it
                throw new Error(message || response.status);
            });
    }

    return response.json()
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

    fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify(mew),
        headers: {
            'content-type': 'application/json'
        }
    })
    .then(handleResponse)
    .then(createdMew => {
        console.log(createdMew);
        form.reset();
        showForm();
        listAllMews();
    })
});

showForm();
showLoadingElement();
listAllMews();