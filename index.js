
import { createServer } from 'http';
import { config } from 'dotenv';
import app from './app.js';
config()

const server = createServer(app)
const port = process.env.APPID || process.env.PORT

try {
    server.listen(port, (err) => {
        if (err) {
            console.log(err);
        }
        console.log(`Server running on port ${port}`);
    })
} catch (error) {
    console.log(error)

}
