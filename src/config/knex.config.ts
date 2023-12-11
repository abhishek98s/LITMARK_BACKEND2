import {config} from './config';
import knex from 'knex'

const knexConfig = {
    ...config.database,
    migrations: {
        directory: '../migrations',
        extensions: ['ts']
    }
}

export default knex(knexConfig)