

class Database {
    // Private fields
    #mews;
    #mewsers;

    constructor() {
        const dbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbxmo.mongodb.net/${process.env.DB_COLL}?retryWrites=true&w=majority`;
        const db = require('monk')(dbUri);
        db.catch(error => console.log(error));
        this.mews = db.get('mews');
        this.mewsers = db.get('users');
    }

    getUserByEmail = async (email) => {
        return await this.mewsers.findOne({email: email});
    };

    getUserById = async (id) => {
        return await this.mewsers.findOne({_id: id})
    };

    getAllMews() {
        return this.mews.find();
    }

    addMew (mew) {
        return this.mews.insert(mew);
    }

    removeMewById(id){
        return this.mews.remove({_id: id});
    }

    updateMewById(id, mew) {
        return this.mews
            .update({_id: id}, {$set: mew});
    }

    getAllUsers(){
        return this.mewsers
            .find();
    }

    createUser(mewser) {
        return this.mewsers
            .insert(mewser);
    }
}

module.exports.Database =  Database;