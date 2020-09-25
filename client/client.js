import {DateFormatter} from './DateFormatter.js';

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const apiUrl = "/api/mews";

const showForm = () => form.style.display = '';
const hideForm = () => form.style.display = 'none';
const showLoadingElement = () => loadingElement.style.display = '';
const hideLoadingElement = () => loadingElement.style.display = 'none';

function listAllMews () {
    mewsElement.innerHTML = '';
    fetch(apiUrl)
        .then(response => response.json())
        .then(mews => {
            hideLoadingElement();
            mews.reverse();
            mews.forEach(mew => {
                const mewDiv = document.createElement('div');
                const mewHeaderDiv = document.createElement('div');
                
                const name = document.createElement('p');
                name.setAttribute('id', 'mew-name')
                name.setAttribute('class', 'mew-header-content')
                name.textContent = mew.name;
                mewHeaderDiv.appendChild(name);

                const headerSpacer = document.createElement('p');
                headerSpacer.setAttribute('class', 'mew-header-content mew-header-secondary-content')
                headerSpacer.textContent = ' · '
                mewHeaderDiv.appendChild(headerSpacer);

                const date = document.createElement('p');
                date.setAttribute('class', 'mew-header-content mew-header-secondary-content')
                date.textContent = new DateFormatter(mew.created).getFormattedDateShort();
                mewHeaderDiv.appendChild(date);

                const content = document.createElement('p');
                content.textContent = mew.content;

                mewDiv.appendChild(mewHeaderDiv);
                mewDiv.appendChild(content);

                mewsElement.append(mewDiv);
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
})

showForm();
showLoadingElement();
listAllMews();