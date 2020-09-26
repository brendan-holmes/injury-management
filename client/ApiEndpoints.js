export class ApiEndpoints {
    constructor () {
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
}