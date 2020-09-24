const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const mewsElement = document.querySelector('.mews');
const API_PORT = 80;
//const API_URL = `http://localhost:${API_PORT}/api/mews`;
//const API_URL = `http://localhost/api/mews`;
const apiUrl = "/api/mews";

const showForm = () => form.style.display = '';
const hideForm = () => form.style.display = 'none';
const showLoadingElement = () => loadingElement.style.display = '';
const hideLoadingElement = () => loadingElement.style.display = 'none';

function timeSincePost(date) {
    var milliseconds = Date.now() - date;
    var seconds = milliseconds / 1000;
    var minutes = seconds / 60;
    var hours = minutes / 60;
    var days = hours / 24;
    var weeks = days / 7;
    var years = days / 365;

    if (seconds < 30) {
        return 'Just now';
    } else if (seconds < 60) {
        return `${Math.round(seconds)} second${Math.round(seconds) > 1 ? 's' : ''} ago`;
    } else if (minutes < 60) {
        return `${Math.round(minutes)} minute${Math.round(minutes) > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
        return `${Math.round(hours)} hour${Math.round(hours) > 1 ? 's' : ''} ago`;
    } else if (days < 7) {
        return `${Math.round(days)} day${Math.round(days) > 1 ? 's' : ''} ago`;
    } else if (weeks < 60) {
        return `${Math.round(weeks)} week${Math.round(weeks) > 1 ? 's' : ''} ago`;
    } else {
        return `${Math.round(years)} year${Math.round(years) > 1 ? 's' : ''} ago`;
    }

    return 
}

function listAllMews () {
    mewsElement.innerHTML = '';
    fetch(apiUrl)
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
                date.textContent = timeSincePost(new Date(mew.created));

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