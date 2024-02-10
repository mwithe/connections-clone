const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const data =
    [{
        words: ['apple', 'banana', 'orange', 'watermelon'],
        group: 1
    },
    {
        words: ['cpu', 'memory', 'harddrive', 'ram'],
        group: 2
    }];

app.get('/', (req, res) => {
    res.send('Hello, Node server is running!')
});

app.get('/api', (req, res) => {
    res.send(data)
});

app.post('/submit', (req, res) => {
    const receivedData = req.body.sort();
    console.log('Received Data (post): ', receivedData);

    for (let i = 0; i < data.length; i++) {
        console.log('index value', data[i].words)
        if (receivedData.toString() == data[i].words.toString()) {
            res.json({ message: 'Correct Answer!' })
        }
    }
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});