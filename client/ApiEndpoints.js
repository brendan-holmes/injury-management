export class ApiEndpoints {
    constructor () {
        this.postMewEndpoint = '/api/mews';
        this.listMewsEndpoint = '/api/mews';
        this.deleteEndpoint = '/api/delete';
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
}