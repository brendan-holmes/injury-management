const { MongoClient, ObjectID } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbxmo.mongodb.net/${process.env.DB_COLL}?retryWrites=true&w=majority`;

class Database {
    // Private fields
    #injuries; // injuries
    #users; // users

    constructor() {
        this.init();
    }

    async init(){
        try {
            const client = new MongoClient(uri, { useUnifiedTopology: true });
            await client.connect();
            const database = client.db(process.env.DB_COLL);
            this.users = database.collection("users");
            await client.db("admin").command({ ping: 1 });
            console.log("Connected successfully to database server.");
        } catch (error) {
            console.log(error);
        }
    }

    getUserByEmail = async (email) => {
        const query = {email: email};
        return await this.users.findOne(query);
    };

    getUserById = async (id) => {
        const query = {_id: ObjectID(id)};
        return await this.users.findOne(query);
    };

    getAllUsers = async () => {
        const users = await this.users.find().toArray();
        return users;
    }

    removeAllUsers() {
        const wasSuccessful = this.users.deleteMany();
        return wasSuccessful;
    }

    createUser(user) {
        return this.users
            .insertOne(user);
    }

    addInjury = async (email, injury) => {
        injury.injuryId = ObjectID();
        try {
            return await this.users.updateOne(
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
            const updatedDocument = await this.users.updateOne(
                { 
                    "email": email, 
                    "injuries.injuryId": ObjectID(id) 
                },
                { $set: { "injuries.$.content": injury.content }}
            );    
            //console.log(`matchedCount: ${updatedDocument.matchedCount}`);
            //console.log(`modifiedCount: ${updatedDocument.modifiedCount}`);
            let wasSuccessful = false;
            if (updatedDocument) {
                //console.log(`nModified = ${updatedDocument.result.nModified}`); // troubleshooting
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
            const updatedDocument = await this.users.updateOne(
                {"email": email},
                { $pull: { "injuries": { "injuryId": ObjectID(id)}}}
            );

            //console.log(`matchedCount: ${updatedDocument.matchedCount}`);
            //console.log(`modifiedCount: ${updatedDocument.modifiedCount}`);
            let wasSuccessful = false;
            if (updatedDocument) {
                //console.log(`nModified = ${updatedDocument.result.nModified}`); // troubleshooting
                wasSuccessful = updatedDocument.result.nModified > 0;
            }
            return wasSuccessful;   
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports.Database =  Database;