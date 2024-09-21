const express = require('express');
const cors = require('cors');
const db = require('./connection');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello from backend");
});

try {
    db(process.env.MONGODB_URL)
    app.listen(8080, () => console.log("Server running on port http://localhost:8080"));
} catch (err) {
    console.log(err);
}
