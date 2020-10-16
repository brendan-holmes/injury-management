import {InjuryComponent} from './InjuryComponent.js';
import {Api} from './Api.js';
import {BodyDiagram} from './BodyDiagram.js';

const form = document.querySelector('.injury-form');
const loadingElement = document.querySelector('.loading');
const injuriesElement = document.querySelector('.injuries');

const showForm = () => form.style.display = '';
const hideForm = () => form.style.display = 'none';
const showLoadingElement = () => loadingElement.style.display = '';
const hideLoadingElement = () => loadingElement.style.display = 'none';

const api = new Api();
const bodyDiagram = new BodyDiagram();

function listAllInjuries () {
    injuriesElement.innerHTML = '';
    api.getAllInjuries()        
        .then(injuries => {
            hideLoadingElement();
            injuries.reverse();
            injuries.forEach(injury => {
                bodyDiagram.drawMarker(injury.bodyDiagramCoordinates)
                injuriesElement.append(new InjuryComponent(injury, api, listAllInjuries).getElement());
            });
        });
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    // Use logged in name instead of label name
    const name = formData.get('name');
    const content = formData.get('content');
    const bodyDiagramCoordinates = JSON.parse(sessionStorage.getItem('body-diagram-coordinates'));

    const injury = {
        name,
        content,
        bodyDiagramCoordinates
    };

    hideForm();
    showLoadingElement();

    console.log('Posting injury...');

    api.postInjury(injury)
        .then(createdInjury => {
            console.log(JSON.stringify(createdInjury));
            form.reset();
            showForm();
            listAllInjuries();
        });
});

showForm();
showLoadingElement();
listAllInjuries();