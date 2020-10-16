if (process.env.NODE_ENV !== 'production') {
    // Use .env file in development, and in production environment variables
    // are saved manually
    require('dotenv').config();
}

const express                   = require('express');
const cors                      = require('cors');
const {body, validationResult}  = require('express-validator');
const { Database }              = require('./Database.js');
const Filter                    = require('bad-words');
const rateLimit                 = require('express-rate-limit');
const path                      = require('path');
const bcrypt                    = require('bcrypt');
const passport                  = require('passport');
const flash                     = require('express-flash');
const session                   = require('express-session');
const initializePassport        = require('./passport-config');
const methodOverride            = require('method-override');

const app = express();
const database = new Database();
const filter = new Filter();
const limiter = rateLimit({
    windowMs: 10 * 1000, // window of 10 seconds
    max: 100 // limit each IP to 10 requests per windowMs
  });
const port = process.env.PORT || 5000;

initializePassport(passport, database.getUserByEmail, database.getUserById);

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}
app.set('view-engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(limiter);
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/api/injuries', (req, res) => {
    database.getAllInjuries()
        .then(injuries => {
            res.json(injuries);
        });
});

app.post('/api/injuries', [
    body('name')
        .not().isEmpty(),
    body('content')
        .not().isEmpty()
], 
    (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Name and Content are required!'
            })
        }

        const injury = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            bodyDiagramCoordinates: req.body.bodyDiagramCoordinates,
            created: new Date()
        };

        // insert into DB
        database.addInjury(injury)
            .then(createdInjury => {
                res.json(createdInjury);
            });
})

app.delete('/api/delete/:id', (req, res) => {
    const id = req.params.id;

    console.log('Deleting injury with id: ' + id);

    database.removeInjuryById(id)
        .then(data => {
        if (!data) {
            res.status(404).send({
            message: `Cannot delete injury with id=${id}. Maybe injury was not found!`
            });
        } else {
            res.send({
            message: "injury was deleted successfully!"
            });
        }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({
                message: "Could not delete injury with id=" + id
        });
    });
});

app.put('/api/injuries/:id', (req, res) => {
    const id = req.params.id;
    const body = req.body

    console.log('Updating injury with id: ' + id + body);

    const injury = {
        name: filter.clean(req.body.name.toString()),
        content: filter.clean(req.body.content.toString()),
        bodyDiagramCoordinates: req.body.bodyDiagramCoordinates.toString(),
        created: body.created.toString()
    };

    console.log(injury);

    database.updateInjuryById(id, injury)
        .then(data => {
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
        .catch(err => {
            res.status(500).send({
                message: "Could not update injury with id=" + id
            });
        });
})

app.get('/api/users', (req, res) => {
    database.getAllUsers()
        .then(users => {
            res.json(users);
        });
});

app.post('/api/users/login', checkNotAuthenticated, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    return res.redirect('/')
});

app.post('/api/users/register', checkNotAuthenticated, async (req, res) => {
    try {
        const numSaltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, numSaltRounds);

        const user = {
            name: req.body.name, 
            email: req.body.email,
            password: hashedPassword
        };
        database.createUser(user);
        res.redirect('/login'); 
    } catch (error) {
        console.log(error);
        res.redirect('/register'); 
    }
})

app.delete('/api/users/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

// Serve any static files
app.use(express.static(path.join(__dirname, 'client')));

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render(path.join(__dirname, 'client', './views/login.ejs'));
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    // res.sendFile(path.join(__dirname, 'client', 'register.html'));
    res.render(path.join(__dirname, 'client', './views/register.ejs'));
})

app.get('/', checkAuthenticated, function(req, res) {
    res.render(path.join(__dirname, 'client', './views/index.ejs'), { name: req.user.name });
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});

function checkAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }

    // Automatically sign in to dev account
    if(process.env.NODE_ENV !== 'production' &&
        process.env.USE_DEV_ACCOUNT === 'true') {
            req.body.email = "dev@dev";
            req.body.password = "dev";
            passport.authenticate('local', (error, user, info) => {
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
        return res.redirect('/login');
    }
}

function checkNotAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');    
    }

    return next();
}