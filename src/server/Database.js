const { MongoClient, ObjectID } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbxmo.mongodb.net/${process.env.DB_COLL}?retryWrites=true&w=majority`;

class Database {
    // Private fields
    #injuries; // injuries
    #db; // users

    constructor() {
        this.init();
    }

    async init(){
        try {
            const client = new MongoClient(uri, { useUnifiedTopology: true });
            await client.connect();
            this.db = client.db(process.env.DB_COLL);
            // this.users = db.collection('users');
            await client.db("admin").command({ ping: 1 });
            console.log("Connected to database server");
        } catch (error) {
            console.log(error);
        }
    }

    getUserByEmail = async (email) => {
        return await this.db.collection('users').findOne({email: email});
    };

    getUserById = async (id) => {
        return await this.db.collection('users').findOne({_id: ObjectID(id)});
    };

    getAllUsers = async () => {
        return await this.db.collection('users').find().toArray();
    }

    removeAllUsers() {
        const wasSuccessful = this.db.collection('users').deleteMany();
        return wasSuccessful;
    }

    createUser(user) {
        return this.db.collection('users')
            .insertOne(user);
    }

    addInjury = async (email, injury) => {
        injury.injuryId = ObjectID();
        try {
            return await this.db.collection('users').updateOne(
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
        console.log(`Updating injury id: ${id}, email: ${email}`);
        
        try {
            const updatedDocument = await this.db.collection('users').updateOne(
                { 
                    "email": email, 
                    "injuries.injuryId": ObjectID(id) 
                },
                { $set: { "injuries.$.bodyPart": injury.bodyPart }}
            );
            let wasSuccessful = false;
            if (updatedDocument) {
                wasSuccessful = updatedDocument.result.nModified > 0;
            }
            return wasSuccessful;  
        } catch (error) {
            console.log(error);
        }
        return []; // todo: return an error
    }

    removeInjuryById = async (email, id) => {

        console.log(`Deleting injury id: ${id}, email: ${email}`);

        try {
            const updatedDocument = await this.db.collection('users').updateOne(
                {"email": email},
                { $pull: { "injuries": { "injuryId": ObjectID(id)}}}
            );

            let wasSuccessful = false;
            if (updatedDocument) {
                wasSuccessful = updatedDocument.result.nModified > 0;
            }
            return wasSuccessful;   
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports.Database =  Database;