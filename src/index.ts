import express from 'express'
import {config} from './config/config';
import { swagger } from './docs/swagger';
import cors from 'cors';

const app = express()
const port = config.app.port
const name = config.app.name
app.use(express.json())
app.use(cors());

import imageRoutes from './entities/image/image.routes'
import userRoutes from './entities/user/user.routes'
import chipRoutes from './entities/chip/chip.routes'
import folderRoutes from './entities/folder/folder.routes'
import authRoutes from './auth/routes/auth.routes'

import { logMiddleware } from './logger/logger';

app.use(logMiddleware)

app.use('/api/image', imageRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chip', chipRoutes);
app.use('/api/folder', folderRoutes);
app.use('/api/auth', authRoutes);

swagger(app)

app.get('/', (request, response) => {
    response.send('Hello world')
});

app.listen(port, () => {
    console.log(`${name} started at http://localhost:${port}`);
});
