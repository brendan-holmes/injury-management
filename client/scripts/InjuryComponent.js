import {DateFormatter} from './DateFormatter.js';

export class InjuryComponent {
    constructor(injury, api, refreshInjuries) {
        this.injury = injury;
        this.api = api;
        this.refreshInjuries = refreshInjuries;
    }

    getElement() {
        const injuryDiv = document.createElement('div');
        injuryDiv.setAttribute('class', 'injury');
        injuryDiv.setAttribute('id', this.injury._id)
        const injuryHeaderDiv = document.createElement('div');
        
        const name = document.createElement('p');
        name.setAttribute('id', 'injury-name')
        name.setAttribute('class', 'injury-header-content')
        name.textContent = this.injury.name;
        injuryHeaderDiv.appendChild(name);

        const headerSpacer = document.createElement('p');
        headerSpacer.setAttribute('class', 'injury-header-content injury-header-secondary-content')
        headerSpacer.textContent = ' · '
        injuryHeaderDiv.appendChild(headerSpacer);

        const date = document.createElement('p');
        date.setAttribute('class', 'injury-header-content injury-header-secondary-content')
        date.textContent = new DateFormatter(this.injury.created).getFormattedDateShort();
        injuryHeaderDiv.appendChild(date);
        
        const content = document.createElement('p');
        content.setAttribute('class', 'injury-content')
        content.textContent = this.injury.content;

        const buttons = document.createElement('div');
        const deleteButton = document.createElement('a');
        deleteButton.setAttribute('class', 'injury-button delete-button');
        const deleteIcon = document.createElement('i');
        deleteIcon.innerHTML = '<i class="far fa-trash-alt"></i>'
        deleteButton.appendChild(deleteIcon);
        deleteButton.addEventListener('click', () => {
            console.log('Delete button clicked! Injury id: ', this.injury._id);
            this.api.deleteInjury(this.injury._id);
            injuryDiv.style.display = 'none';
        });
        buttons.appendChild(deleteButton);
        const editButton = document.createElement('a');
        editButton.setAttribute('class', 'injury-button delete-button');
        const editIcon = document.createElement('i');
        editIcon.innerHTML = '<i class="fas fa-pencil-alt"></i>'
        editButton.appendChild(editIcon);
        editButton.addEventListener('click', () => {
            console.log('Edit button clicked! Injury id: ', this.injury._id);
            
            // Set injury in edit mode
            // Replace name with text input
            name.style.display = 'none';
            const nameInput = document.createElement('input');
            nameInput.value = name.textContent;
            name.insertAdjacentElement('afterend', nameInput);
            
            // Replace content with text input
            content.style.display = 'none';
            const contentInput = document.createElement('input');
            contentInput.setAttribute('class', 'injury-content');
            contentInput.value = content.textContent;
            content.insertAdjacentElement('afterend', contentInput);
            
            // Add Save and Cancel buttons
            buttons.style.display = 'none';
            const editOkButton = document.createElement('button');
            editOkButton.textContent = 'OK';
            editOkButton.setAttribute('class', 'injury-edit-button');
            editOkButton.addEventListener('click', () => {
                console.log('OK button clicked.');
                const newInjury = this.injury;
                newInjury.name = nameInput.value;
                newInjury.content = contentInput.value;
                this.api.updateInjury(this.injury._id, newInjury)
                    .then((res) => {console.log(res)});
                name.textContent = newInjury.name;
                content.textContent = newInjury.content;
                nameInput.remove();
                contentInput.remove();
                editOkButton.remove();
                editCancelButton.remove();
                name.style.display = '';
                content.style.display = '';
                buttons.style.display = '';
            });
            buttons.insertAdjacentElement('beforebegin', editOkButton);

            const editCancelButton = document.createElement('button');
            editCancelButton.textContent = 'Cancel';
            editCancelButton.setAttribute('class', 'injury-edit-button');
            editCancelButton.addEventListener('click', () => {
                nameInput.remove();
                contentInput.remove();
                editOkButton.remove();
                editCancelButton.remove();
                name.style.display = '';
                content.style.display = '';
                buttons.style.display = '';
            });
            buttons.insertAdjacentElement('afterend', editCancelButton);
        });
        buttons.appendChild(editButton);

        injuryDiv.appendChild(injuryHeaderDiv);
        injuryDiv.appendChild(content);
        injuryDiv.appendChild(buttons);

        return injuryDiv;
    }
}