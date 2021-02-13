export class Api {
    constructor () {
        this.postInjuryEndpoint = '/api/injuries';
        this.listInjuriesEndpoint = '/api/injuries';
        this.deleteEndpoint = '/api/delete';
        this.updateEndpoint = '/api/injuries';
        this.loginEndpoint = '/api/users/login'
    }

    async getAllInjuries () {
        const response = await fetch(this.listInjuriesEndpoint);
        return await response.json();
    }

    async deleteInjury (id) {
        console.log(`Deleting injury with id: ${id}.`);
        const response = await fetch(this.deleteEndpoint + '/' + `${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    }

    async postInjury (injury) {
        const response = await fetch(this.postInjuryEndpoint, {
            method: 'POST',
            body: JSON.stringify(injury),
            headers: {
                'content-type': 'application/json'
            }
        });
        return await response.json();
    }

    async updateInjury (id, injury) {
        console.log(`Updating injury with id: ${id}. ${injury}`);
        const response = await fetch(this.updateEndpoint + '/' + `${id}`, {
            method: 'PUT',
            body: JSON.stringify(injury),
            headers: {
                'content-type': 'application/json'
            }
        });
        return await response.json();
    }

    async loginUser (email, password) {
        console.log(`Attempting to login with email ${email}`);

        const userLoginDetails = {
            email,
            password
        };

        const response = await fetch(this.loginEndpoint, {
            method: 'POST',
            body: JSON.stringify(userLoginDetails),
            headers: {
                'content-type': 'application/json'
            }
        });
        // return await response.json();
        return await response;//.text().then(text => console.log(text));
    }
}