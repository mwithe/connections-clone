const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const data =
    [{
        words: ['APPLE', 'MICROSOFT', 'AMAZON', 'GOOGLE'],
        group: 1
    },
    {
        words: ['CPU', 'MEMORY', 'RAM', 'HARDDRIVE'],
        group: 2
    },
    {
        words: ['HORSE', 'SHEEP', 'PIG', 'OX'],
        group: 3
    },
    {
        words: ['PEACH', 'ORANGE', 'LIME', 'PLUM'],
        group: 4
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

    for (let i = 0; i <= 1; i++) {
        console.log('index value', data[i].words)
        if (receivedData.toString() == data[i].words.toString()) {
            console.log('Match')
            res.send({ result: true, group: data[i].group });
        }
    }
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});