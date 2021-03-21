import { Injury, User } from "../types";

const { MongoClient, ObjectID } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wbxmo.mongodb.net/${process.env.DB_COLL}?retryWrites=true&w=majority`;

export class Database {
    injuries : Injury[] = [];
    db: any;

    constructor() {
        this.init();
    }

    init(){
        const client = new MongoClient(uri, { useUnifiedTopology: true });
        client.connect().then(() => {
            this.db = client.db(process.env.DB_COLL);
            console.log("Connected to database");
        }).catch((error: Error) => {
            console.log(`Error: Unable to connect to database. ${error}`)
        });
    }

    getUserByEmail = async (email: string) => {
        return await this.db.collection('users').findOne({email: email});
    };

    getUserById = async (id: string) => {
        return await this.db.collection('users').findOne({_id: ObjectID(id)});
    };

    getAllUsers = async () => {
        return await this.db.collection('users').find().toArray();
    }

    removeAllUsers() {
        const wasSuccessful = this.db.collection('users').deleteMany();
        return wasSuccessful;
    }

    createUser(user: User) {
        return this.db.collection('users')
            .insertOne(user);
    }

    addInjury = async (email: string, injury: Injury) => {
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
    
    getAllInjuries = async (email: string) => {
        const user = await this.getUserByEmail(email);
        if (user) {
            return user.injuries;
        }
        return []; // todo: return an error
    }

    updateInjuryById = async (email: string, id: string, injury: Injury) => {
        console.log(`Updating injury id: ${id}, email: ${email}`);
        
        try {
            const updatedDocument = await this.db.collection('users').updateOne(
                { 
                    "email": email, 
                    "injuries.injuryId": ObjectID(id) 
                },
                { $set: { 
                    "injuries.$.bodyPart": injury.bodyPart,
                    "injuries.$.side": injury.side,
                    "injuries.$.painLevel": injury.painLevel,
                    "injuries.$.firstOccurrence": injury.firstOccurrence,
                    "injuries.$.frequencyOfSymptoms": injury.frequencyOfSymptoms,
                    "injuries.$.cause": injury.cause,
                    "injuries.$.treatment": injury.treatment,
                    "injuries.$.triggers": injury.triggers,
             }}
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

    removeInjuryById = async (email: string, id: string) => {

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