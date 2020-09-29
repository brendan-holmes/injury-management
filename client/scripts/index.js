import {InjuryComponent} from './InjuryComponent.js';
import {Api} from './Api.js';

const form = document.querySelector('.injury-form');
const loadingElement = document.querySelector('.loading');
const injuriesElement = document.querySelector('.injuries');

const showForm = () => form.style.display = '';
const hideForm = () => form.style.display = 'none';
const showLoadingElement = () => loadingElement.style.display = '';
const hideLoadingElement = () => loadingElement.style.display = 'none';

const api = new Api();

function listAllInjuries () {
    injuriesElement.innerHTML = '';
    api.getAllInjuries()        
        .then(injuries => {
            hideLoadingElement();
            injuries.reverse();
            injuries.forEach(injury => {
                injuriesElement.append(new InjuryComponent(injury, api, listAllInjuries).getElement());
            });
        });
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name');
    const content = formData.get('content');

    const injury = {
        name,
        content
    };

    hideForm();
    showLoadingElement();

    console.log('Posting injury...');

    api.postInjury(injury)
        .then(createdInjury => {
            console.log(createdInjury);
            form.reset();
            showForm();
            listAllInjuries();
        });
});

showForm();
showLoadingElement();
listAllInjuries();