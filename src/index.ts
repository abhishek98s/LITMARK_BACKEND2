import express from 'express';
import cors from 'cors';

import { config } from './config/config';
import { swagger } from './swagger/swagger';
import { logMiddleware } from './logger/logger';
import imageRoutes from './entities/image/image.routes';
import userRoutes from './entities/user/user.routes';
import chipRoutes from './entities/chip/chip.routes';
import folderRoutes from './entities/folder/folder.routes';
import bookmarkRoutes from './entities/bookmark/bookmark.routes';
import authRoutes from './auth/routes/auth.routes';
import bodyParser from 'body-parser';

const app = express()
const port = config.app.port;
const name = config.app.name;
app.use(cors());
app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(logMiddleware)

app.use('/api/image', imageRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chip', chipRoutes);
app.use('/api/folder', folderRoutes);
app.use('/api/bookmark', bookmarkRoutes);
app.use('/api/auth', authRoutes);

swagger(app)

app.get('/', (request, response) => {
    response.send('Hello world')
});

app.listen(port, () => {
    console.log(`${name} started at http://localhost:${port}`);
});
