import { Injury } from "./types";

const root = 'http://api.example.com:3000'
const postInjuryEndpoint = `${root}/injuries`;
const listInjuriesEndpoint = `${root}/injuries`;
const deleteEndpoint = `${root}/delete`;
const updateEndpoint = `${root}/injuries`;
const loginEndpoint = `${root}/users/login`;
const registerEndpoint = `${root}/users/register`;
const logOutEndpoint = `${root}/users/logout`;
const checkLoggedInEndpoint = `${root}/users/checkloggedin`;

const post = async (endpoint: string, data: any) => {
    const response = await fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
        headers: {
            'content-type': 'application/json'
        }
    });

    return response;
}

export const api = {
    getAllInjuries: async () => {
        const response = await fetch(listInjuriesEndpoint, {
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data === undefined || data.injuries === undefined) {
            return [];
        }

        return data.injuries;
    },

    deleteInjury: async (id: string) => {
        const response = await fetch(deleteEndpoint + '/' + `${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });

        return await response.json();
    },

    postInjury: async (injury: Injury) => {
        const response = await post(postInjuryEndpoint, injury);
        return await response.json();
    },

    updateInjury: async (id: string, injury: Injury) => {
        const response = await fetch(updateEndpoint + '/' + `${id}`, {
            method: 'PUT',
            body: JSON.stringify(injury),
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });
        return response;
    },

    login: async (email: string, password: string) => {
        const response = await post(loginEndpoint, { email, password });
        return response;
    },

    checkLoggedIn: async () => {
        const response = await fetch(checkLoggedInEndpoint, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'content-type': 'application/json'
            }
        });
        return response;
    },
    
    register: async (name: string, email: string, password: string) => {
        const response = await post(registerEndpoint, { name, email, password });
        return response;
    },

    logOut: async () => {
        const response = await fetch(logOutEndpoint, {
            method: 'DELETE',
            credentials: 'include'
        });
        const data = await response.json();
        console.log(`[DEBUG] Log out response: ${JSON.stringify(data)}`);
        return response;
    }
}