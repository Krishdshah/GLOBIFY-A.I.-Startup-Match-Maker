const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Additional routes and middleware can be added here

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;