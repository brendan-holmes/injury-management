const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const HEROKU_PORT = 80;
const API_PORT = HEROKU_PORT;
const API_URL = `http://localhost:${API_PORT}/mews`;

const showForm = () => form.style.display = '';
const hideForm = () => form.style.display = 'none';
const showLoadingElement = () => loadingElement.style.display = '';
const hideLoadingElement = () => loadingElement.style.display = 'none';

function listAllMews () {
    mewsElement.innerHTML = '';
    fetch(API_URL, {
        headers: {
            "Access-Control-Allow-Origin": "*" //`${API_URL}`
        }})
        .then(response => response.json())
        .then(mews => {
            hideLoadingElement();
            mews.reverse();
            mews.forEach(mew => {
                const div = document.createElement('div');
                
                const header = document.createElement('h3');
                header.textContent = mew.name;

                const content = document.createElement('p');
                content.textContent = mew.content;

                const date = document.createElement('small');
                date.textContent = new Date(mew.created);

                div.appendChild(header);
                div.appendChild(content);
                div.appendChild(date);

                mewsElement.append(div);
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

    fetch(API_URL, {
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
})

showForm();
showLoadingElement();
listAllMews();