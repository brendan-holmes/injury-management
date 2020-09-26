import {DateFormatter} from './DateFormatter.js';

export class MewComponent {
    constructor(mew, apiEndpoints, refreshMews) {
        this.mew = mew;
        this.apiEndpoints = apiEndpoints;
        this.refreshMews = refreshMews;
    }

    getElement() {
        const mewDiv = document.createElement('div');
        mewDiv.setAttribute('class', 'mew');
        mewDiv.setAttribute('id', this.mew._id)
        const mewHeaderDiv = document.createElement('div');
        
        const name = document.createElement('p');
        name.setAttribute('id', 'mew-name')
        name.setAttribute('class', 'mew-header-content')
        name.textContent = this.mew.name;
        mewHeaderDiv.appendChild(name);

        const headerSpacer = document.createElement('p');
        headerSpacer.setAttribute('class', 'mew-header-content mew-header-secondary-content')
        headerSpacer.textContent = ' · '
        mewHeaderDiv.appendChild(headerSpacer);

        const date = document.createElement('p');
        date.setAttribute('class', 'mew-header-content mew-header-secondary-content')
        date.textContent = new DateFormatter(this.mew.created).getFormattedDateShort();
        mewHeaderDiv.appendChild(date);

        const content = document.createElement('p');
        content.setAttribute('class', 'mew-content')
        content.textContent = this.mew.content;

        const buttons = document.createElement('div');
        const deleteButton = document.createElement('a');
        deleteButton.setAttribute('class', 'mew-button delete-button');
        const deleteIcon = document.createElement('i');
        deleteIcon.innerHTML = '<i class="far fa-trash-alt"></i>'
        deleteButton.appendChild(deleteIcon);
        deleteButton.addEventListener('click', () => {
            console.log('Delete button clicked! Mew id: ', this.mew._id);
            this.apiEndpoints.deleteMew(this.mew._id);
            mewDiv.style.display = 'none';
        });
        buttons.appendChild(deleteButton);
        const editButton = document.createElement('a');
        editButton.setAttribute('class', 'mew-button delete-button');
        const editIcon = document.createElement('i');
        editIcon.innerHTML = '<i class="fas fa-pencil-alt"></i>'
        editButton.appendChild(editIcon);
        editButton.addEventListener('click', () => {
            console.log('Edit button clicked! Mew id: ', this.mew._id);
            
            // Set mew in edit mode
            // Replace name with text input
            name.style.display = 'none';
            const nameInput = document.createElement('input');
            nameInput.value = name.textContent;
            name.insertAdjacentElement('afterend', nameInput);
            
            // Replace content with text input
            content.style.display = 'none';
            const contentInput = document.createElement('input');
            contentInput.setAttribute('class', 'mew-content');
            contentInput.value = content.textContent;
            content.insertAdjacentElement('afterend', contentInput);
            
            // Add Save and Cancel buttons
            buttons.style.display = 'none';
            const editOkButton = document.createElement('button');
            editOkButton.textContent = 'OK';
            editOkButton.setAttribute('class', 'mew-edit-button');
            editOkButton.addEventListener('click', () => {
                console.log('OK button clicked.');
                const newMew = this.mew;
                newMew.name = nameInput.value;
                newMew.content = contentInput.value;
                this.apiEndpoints.updateMew(this.mew._id, newMew)
                    .then((res) => {console.log(res)});
                name.textContent = newMew.name;
                content.textContent = newMew.content;
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
            editCancelButton.setAttribute('class', 'mew-edit-button');
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

        mewDiv.appendChild(mewHeaderDiv);
        mewDiv.appendChild(content);
        mewDiv.appendChild(buttons);

        return mewDiv;
    }
}