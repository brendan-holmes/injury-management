

class Database {
    // Private fields
    #injuries; // injuries
    #users; // users

    constructor() {
        const dbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbxmo.mongodb.net/${process.env.DB_COLL}?retryWrites=true&w=majority`;
        const db = require('monk')(dbUri);
        db.catch(error => console.log(error));
        this.injuries = db.get('injuries');
        this.users = db.get('users');
    }

    getUserByEmail = async (email) => {
        return await this.users.findOne({email: email});
    };

    getUserById = async (id) => {
        return await this.users.findOne({_id: id})
    };

    getAllInjuries() {
        return this.injuries.find();
    }

    addInjury (injury) {
        return this.injuries.insert(injury);
    }

    removeInjuryById(id){
        return this.injuries.remove({_id: id});
    }

    updateInjuryById(id, injury) {
        return this.injuries
            .update({_id: id}, {$set: injury});
    }

    getAllUsers(){
        return this.users
            .find();
    }

    createUser(user) {
        return this.users
            .insert(user);
    }
}

module.exports.Database =  Database;