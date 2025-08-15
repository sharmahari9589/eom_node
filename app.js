import express, { static as expressStatic, urlencoded, json } from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import version1APi from "./src/api/v1/index.js";
import { db } from './src/api/v1/config/mongodb.js';
import path from 'path';
import { fileURLToPath } from 'url';
import stripeWebhookRouter from "./src/api/v1/webhook/stripeWebhook.js"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

//----------use dependencies----------------------------------
app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());

app.use("/api/stripe/webhook", stripeWebhookRouter);

// Body parsings
app.use(urlencoded({ extended: true, limit: '50mb' }));
app.use(json({ limit: '50mb' }));

// Compression
app.use(compression());

app.use('/image', expressStatic(path.join(__dirname, 'image',)));

// -------------- db check--------------------
db();
// -------------- db check--------------------

//----------redirect routes-----------------------------------
app.use("/v1", version1APi);


// //----------for invalid requests start -----------------------
// app.all('*', async (req, res) => {
//     await badRequest(res, 'Invalid URI');
// });

export default app;