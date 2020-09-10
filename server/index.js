const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT_NUM = 5000;

app.get('/', (req, res) => {
    res.json({
        message: 'Meower! 😹🐈'
    })
});

app.post('/mews', (req, res) => {
    console.log(req.body);
})

app.listen(PORT_NUM, () => {
    console.log(`Listening on http://localhost:${PORT_NUM}`);
});