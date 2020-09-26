import {DateFormatter} from './DateFormatter.js';

export class MewComponent {
    constructor(mew, apiEndpoints, refresh) {
        this.mew = mew;
        this.apiEndpoints = apiEndpoints;
        this.refresh = refresh;
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
            this.apiEndpoints.deleteMew(this.mew._id)
                .then(this.refresh())
        });
        buttons.appendChild(deleteButton);

        mewDiv.appendChild(mewHeaderDiv);
        mewDiv.appendChild(content);
        mewDiv.appendChild(buttons);

        return mewDiv;
    }
}