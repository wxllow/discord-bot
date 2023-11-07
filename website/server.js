module.exports = () => {
    const fs = require('fs');
    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();
    let port = process.env.PORT || 3000;

    app.enable('trust proxy');
    app.set("etag", false);
    app.use(express.static(__dirname));
    app.use(bodyParser.json());

    // Create a function to start the server and handle port conflicts
    const startServer = () => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${port} is already in use. Trying the next available port...`);
                port++;
                startServer(); // Try the next port
            } else {
                console.error(err);
            }
        });
    };

    // Start the server with error handling
    startServer();

    app.get('/api/settings', (req, res) => {
        const data = fs.readFileSync('settings.json');
        const settings = JSON.parse(data);
        res.json(settings);
    });

    app.post('/api/settings', (req, res) => {
        const updatedSettings = req.body;
        fs.writeFileSync('settings.json', JSON.stringify(updatedSettings, null, 2));
        res.json({ message: 'Settings updated successfully' });
    });
};
