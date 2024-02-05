import express from 'express'
import {config} from './config/config';

const app = express()
const port = config.app.port
const name = config.app.name
app.use(express.json())

import imageRoutes from './entities/image/image.routes'
import chipRoutes from './entities/chip/chip.routes'
import folderRoutes from './entities/folder/folder.routes'
import userRoutes from './entities/user/user.routes'
import authRoutes from './auth/routes/auth.routes'

app.use('/api/image', imageRoutes);
app.use('/api/chip', chipRoutes);
app.use('/api/folder', folderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (request, response) => {
    response.send('Hello world')
});

app.listen(port, () => {
    console.log(`${name} started at http://localhost:${port}`);
});
