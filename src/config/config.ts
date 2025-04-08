import dotenv from 'dotenv';

dotenv.config();

export const config = {
  app: {
    name: process.env.NAME || 'LITMARK_BACKEND',
    port: process.env.SERVER_PORT || '5000',
  },
  database: getActiveDatabase(process.env.ACTIVE_DB || 'mysql2'),
};

function getActiveDatabase(db: string) {
<<<<<<< HEAD
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
            client: 'pg',
            connection: process.env.POSTGRES_URL,
            migrations: {
                directory: `${__dirname}/../migrations`,
            }
        };
    }
=======
  if (db === 'mysql2') {
    return {
      client: db,
      connection: {
        user: process.env.DB_MYSQL_USER,
        password: process.env.DB_MYSQL_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT!) || 3306,
      },
    };
  }

  if (db === 'pg') {
    const devlopment = {
      connectionString: process.env.POSTGRES_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    };
    const test = {
      host: process.env.TEST_HOST,
      database: process.env.TEST_DATABASE,
      user: process.env.TEST_USER,
      password: process.env.TEST_PASSWORD,
      port: process.env.TEST_PORT,
    };
    return {
      client: db,
      connection: process.env.NODE_ENV === 'test' ? test : devlopment,
      migrations: {
        directory: `${__dirname}/../migrations`,
      },
    };
  }
>>>>>>> dev
}
