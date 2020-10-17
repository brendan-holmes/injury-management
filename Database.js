const monk = require('monk')

class Database {
    // Private fields
    #injuries; // injuries
    #users; // users

    constructor() {
        const dbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbxmo.mongodb.net/${process.env.DB_COLL}?retryWrites=true&w=majority`;
        const db = monk(dbUri);
        db.catch(error => console.log(error));
        this.users = db.get('users');
    }

    getUserByEmail = async (email) => {
        return await this.users.findOne({email: email});
    };

    getUserById = async (id) => {
        return await this.users.findOne({_id: id})
    };

    getAllUsers() {
        return this.users
            .find();
    }

    removeAllUsers() {
        return this.users
            .remove();
    }

    createUser(user) {
        return this.users
            .insert(user);
    }

    addInjury = async (email, injury) => {
        injury.id = monk.id();
        try {
            return await this.users.update(
                {email: email}, 
                {$push: {"injuries": injury}});    
        } catch (error) {
            console.log(error);
        }
        return []; // todo: return an error
    }
    
    getAllInjuries = async (email) => {
        const user = await this.getUserByEmail(email);
        if (user) {
            return user.injuries;
        }
        return []; // todo: return an error
    }

    updateInjuryById = async (email, id, injury) => {
        // NOT TESTED
        try {
            return await this.users.update(
                {email: email, "injuries.id": id}, 
                {$set: {injury}});    
        } catch (error) {
            console.log(error);
        }
        return []; // todo: return an error
    }

    removeInjuryById = (email, id) => {
        // NOT WORKING

        console.log(`Deleting injury from database with id: ${id}`);

        try {
            return this.users.remove (
                {email: email, "injuries.id": id});    
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports.Database =  Database;