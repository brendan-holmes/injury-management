import { Injury, User } from "../types";

if (process.env.NODE_ENV !== 'production') {
    // Use .env file in development, and in production environment variables
    // are saved manually
    require('dotenv').config({ path: '.env.local' });
}

const subdomain                 = require('express-subdomain');
const express                   = require('express');
const cors                      = require('cors');
const {body, validationResult}  = require('express-validator');
const { Database }              = require('./Database');
const rateLimit                 = require('express-rate-limit');
const path                      = require('path');
const bcrypt                    = require('bcrypt');
const passport                  = require('passport');
const flash                     = require('express-flash');
const session                   = require('express-session');
const initializePassport        = require('./passport-config');

const apiRouter = express.Router();
const appRouter = express.Router();
const app = express();
const database = new Database();
const limiter = rateLimit({
    windowMs: 10 * 1000, // window of 10 seconds
    max: 100 // limit each IP to 10 requests per windowMs
});
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
app.set('view-engine', 'ejs');

app.use(cors({origin: 'http://app.example.com:3000', credentials:true}));
app.use(express.json());
app.use(limiter);
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    cookie: {
        domain: 'example.com',
        secure: false,
        sameSite: true,
    },
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
}));

initializePassport(passport, database.getUserByEmail, database.getUserById);
app.use(passport.initialize());
app.use(passport.session());

apiRouter.get('/injuries', checkAuthenticated, (req: any, res: any) => {
    database.getAllInjuries(req.user.email)
        .then((injuries: Injury[]) => {
            res.json({injuries: injuries});
        });
});

apiRouter.post('/injuries', checkAuthenticated, [
    body('bodyPart').not().isEmpty(),
    body('bodyDiagramCoordinates').not().isEmpty(),
], 
    (req: any, res: any) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Missing one or more fields in injury!'
            })
        }

        const injury: Injury = {
            bodyPart: req.body.bodyPart ? req.body.bodyPart.toString() : '',
            bodyDiagramCoordinates: req.body.bodyDiagramCoordinates,
            created: new Date(),
            side: req.body.side ? req.body.side.toString() : '',
            painLevel: req.body.painLevel ? req.body.painLevel.toString() : '',
            firstOccurrence: req.body.firstOccurrence ? req.body.firstOccurrence.toString() : '',
            frequencyOfSymptoms: req.body.frequencyOfSymptoms ? req.body.frequencyOfSymptoms.toString() : '',
            cause: req.body.cause ? req.body.cause.toString() : '',
            triggers: req.body.triggers ? req.body.triggers.toString() : '',
            treatment: req.body.treatment ? req.body.treatment.toString() : '',
        };

        // insert into DB
        database.addInjury(req.user.email, injury)
            .then((createdInjury: Injury) => {
                res.json(createdInjury);
            });
})

apiRouter.delete('/delete/:id', checkAuthenticated, (req: any, res: any) => {
    const id = req.params.id;
    database.removeInjuryById(req.user.email, id)
        .then((wasSuccessful: boolean) => {
            if (wasSuccessful) {
                res.send({
                    message: "injury was deleted successfully!"
                    });
            } else {
                res.status(404).send({
                    message: `Cannot delete injury with id=${id}. Maybe injury was not found!`
                    });
            }
        })
        .catch((err: Error) => {
            console.log(err);
            res.status(500).send({
                message: "Could not delete injury with id=" + id
        });
    });
});

apiRouter.put('/injuries/:id', checkAuthenticated, (req: any, res: any) => {
    const id = req.params.id;
    const body = req.body

    console.log('Updating injury with id: ' + id + body);

    const injury: Injury = {
        bodyPart: req.body.bodyPart ? req.body.bodyPart.toString() : '',
        bodyDiagramCoordinates: req.body.bodyDiagramCoordinates,
        created: new Date(),
        side: req.body.side ? req.body.side.toString() : '',
        painLevel: req.body.painLevel ? req.body.painLevel.toString() : '',
        firstOccurrence: req.body.firstOccurrence ? req.body.firstOccurrence.toString() : '',
        frequencyOfSymptoms: req.body.frequencyOfSymptoms ? req.body.frequencyOfSymptoms.toString() : '',
        cause: req.body.cause ? req.body.cause.toString() : '',
        triggers: req.body.triggers ? req.body.triggers.toString() : '',
        treatment: req.body.treatment ? req.body.treatment.toString() : '',
    };

    console.log(injury);

    database.updateInjuryById(req.user.email, id, injury)
        .then((data: any) => {
        if (!data) {
            res.status(404).send({
            message: `Cannot update injury with id=${id}. Maybe injury was not found!`
            });
        } else {
            res.send({
            message: "Injury was updated successfully!"
            });
        }
        })
        .catch((err: Error) => {
            res.status(500).send({
                message: `Could not update injury with id ${id}. ${err}`
            });
        });
})

apiRouter.get('/users', (req: any, res: any) => {
    database.getAllUsers()
        .then((users: User[]) => res.json(users));
});

apiRouter.delete('/users', (req: any, res: any) => {
    database.removeAllUsers()
        .then((wasSuccessful: boolean) => {
            if (wasSuccessful) {
                res.status(200).send({message: "Successfully deleted all users."});
            }
            else {
                res.status(500).send({message: "Unable to delete all users."});
            }
        });
});

apiRouter.post('/users/login', checkNotAuthenticated, passport.authenticate('local'), (req: any, res: any) => {
    if (req.isAuthenticated()) {
        res.status(200).json({message: 'User successfully logged in.', userName: req.user.name});
    } else {
        res.status(401).json({message: 'Unable to login.'});
    }
});

apiRouter.post('/users/checkloggedin', (req: any, res: any) => {
    if (req.isAuthenticated()) {
        res.status(200).json({message: 'User logged in from existing session.', userName: req.user.name});
    } else {
        res.status(200).json({message: 'User not logged in from existing session.', userName: null});
    }
});

apiRouter.post('/users/register', checkNotAuthenticated, async (req: any, res: any) => {
    try {
        const numSaltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, numSaltRounds);

        const user = {
            name: req.body.name, 
            email: req.body.email,
            password: hashedPassword,
            injuries: []
        };
        database.createUser(user);
        res.status(200).json({message: 'Successfully registered user.'}); // 200 OK
    } catch (error) {
        console.log(error);
        res.status(401).json({message: `Error registering user: ${error}`}); // 401 Unauthorized/unauthenticated
    }
})

apiRouter.delete('/users/logout', (req: any, res: any) => {
    if (!req.isAuthenticated()) {
        console.log(`Warning: Calling logout but user is not authenticated.`);
    }
    
    req.logOut();
    res.status(200).json({message: 'User logged out.'});
});

apiRouter.get('/', function(req: any, res: any) {
    res.send('Welcome to our API!');
});

appRouter.use(express.static(path.join(__dirname, '../../build')));
appRouter.get('/', function (req: any, res: any) {
    res.sendFile('index.html');
  });

app.use(subdomain('api', apiRouter))
app.use(subdomain('app', appRouter))
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

function checkAuthenticated(req: any, res: any, next: any) {
    if(req.isAuthenticated()) {
        return next();
    }

    // Automatically sign in to dev account
    if(process.env.NODE_ENV !== 'production' &&
        process.env.USE_DEV_ACCOUNT === 'true') {
            req.body.email = "dev@dev";
            req.body.password = "dev";
            passport.authenticate('local', (error: Error, user: any, info: any) => {
                if (error) {
                    console.log(`Error doing automatic dev login. Error: ${error}`);
                    res.status(401).send(error);
                } else if (!user) {
                    console.log(`Error doing automatic dev login. Info: ${info}`);
                    res.status(401).send(info);
                } else {
                    // success condition
                    req.user = user;
                    if(!req.user) {
                        return res.status(403).send({message: "User is not defined"});
                    }
                    return next();
                }
            })(req, res);
    } else {
        return res.status(401).json({message: 'Not authenticated.'}); // 401 Unauthorized/unauthenticated
    }
}

function checkNotAuthenticated(req: any, res: any, next: any) {
    if(req.isAuthenticated()) {
        return res.status(403).json({message: 'User is already logged in.'}); // 403 Forbidden
    }
    return next();
}