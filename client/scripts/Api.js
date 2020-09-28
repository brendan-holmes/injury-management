export class Api {
    constructor () {
        this.postMewEndpoint = '/api/mews';
        this.listMewsEndpoint = '/api/mews';
        this.deleteEndpoint = '/api/delete';
        this.updateEndpoint = '/api/mews';
        this.loginEndpoint = '/api/users/login'
    }

    async getAllMews () {
        const response = await fetch(this.listMewsEndpoint);
        return await response.json();
    }

    async deleteMew (id) {
        console.log(`Deleting mew with id: ${id}.`);
        const response = await fetch(this.deleteEndpoint + '/' + `${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    }

    async postMew (mew) {
        const response = await fetch(this.postMewEndpoint, {
            method: 'POST',
            body: JSON.stringify(mew),
            headers: {
                'content-type': 'application/json'
            }
        });
        return await response.json();
    }

    async updateMew (id, mew) {
        console.log(`Updating mew with id: ${id}. ${mew}`);
        const response = await fetch(this.updateEndpoint + '/' + `${id}`, {
            method: 'PUT',
            body: JSON.stringify(mew),
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