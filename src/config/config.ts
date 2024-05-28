import dotenv from 'dotenv'

dotenv.config()

export const config = {
    app: {
        name: process.env.NAME || 'LITMARK_BACKEND',
        port: process.env.SERVER_PORT || '5000'
    },
    database: getActiveDatabase(process.env.ACTIVE_DB || 'mysql2')
}

function getActiveDatabase(db: string) {
    if (db === 'mysql2') {
        return {
            client: db,
            connection: {
                user: process.env.DB_MYSQL_USER,
                password: process.env.DB_MYSQL_PASSWORD,
                database: process.env.DB_NAME,
                host: process.env.DB_HOST || '127.0.0.1',
                port: parseInt(process.env.DB_PORT!) || 3306,
            }
        };
    }

    if (db === 'pg') {
        return {
            client: db,
            connection: process.env.POSTGRES_URL,
            migrations: {
                directory: `${__dirname}/../migrations`,
            }
        };
    }
}
