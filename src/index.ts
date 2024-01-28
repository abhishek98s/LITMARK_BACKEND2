import express from 'express'
import {config} from './config/config';

const app = express()
const port = config.app.port
const name = config.app.name
app.use(express.json())

import imageRoutes from './entities/image/image.routes'

app.use('/api/image', imageRoutes);

app.get('/', (request, response) => {
    response.send('Hello world')
});

app.listen(port, () => {
    console.log(`${name} started at http://localhost:${port}`);
});
