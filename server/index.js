const express = require('express');
const cors = require('cors');
const {body, validationResult} = require('express-validator');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");

const app = express();
const db = monk(process.env.MONGO_URI || 'localhost/meower')
db.then(() => console.log('Connected correctly to server'))
const mews = db.get('mews');
const filter = new Filter();

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
const limiter = rateLimit({
    windowMs: 10 * 1000, // window of 10 seconds
    max: 10 // limit each IP to 10 requests per windowMs
  });

app.use(cors());
app.use(express.json());
app.use(limiter);

const PORT_NUM = 5000;

app.get('/', (req, res) => {
    res.json({
        message: 'Meower! 😹🐈'
    })
});

app.get('/mews', (req, res) => {
    mews
        .find()
        .then(mews => {
            res.json(mews);
        });
});

app.post('/mews', [
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

        const mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };

        // insert into DB
        mews
            .insert(mew)
            .then(createdMew => {
                res.json(createdMew);
            });
})

app.listen(PORT_NUM, () => {
    console.log(`Listening on http://localhost:${PORT_NUM}`);
});