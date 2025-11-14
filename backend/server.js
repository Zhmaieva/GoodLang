import express from "express";
import {translationsController} from "./controllers/translationController.js";
import {healthController} from "./controllers/healthController.js";
import {accountsController} from "./controllers/accountsController.js";
import {paymentsController} from "./controllers/paymentsController.js";

const args = process.argv;
const portIndex = args.indexOf('-p');
const port = (portIndex !== -1 && args[portIndex + 1]) ? parseInt(args[portIndex + 1], 10) : 3000;

const app = express();

// Manual CORS header
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // No Content
    }
    //setTimeout(next, 6000);
    next();
});

paymentsController.mapRawJsonRoutes(app);

app.use(express.json());

translationsController.mapRoutes(app);
healthController.mapRoutes(app);
accountsController.mapRoutes(app);
paymentsController.mapRoutes(app);

// Catch-all handler for undefined routes
app.use(async (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler (Catches all unhandled exceptions)
app.use(async (err, req, res, next) => {
    console.error(err.stack);  // Log the error stack for debugging (optional)
    res.status(500).json({ message: 'Something went wrong, please try again later.' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});