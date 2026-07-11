import dotenv from 'dotenv';

dotenv.config();

export const config = {
  app: {
    name: process.env.NAME || 'LITMARK_BACKEND',
    port: process.env.SERVER_PORT || '5000',
  },
  jwt: {
    token: process.env.JWT_TOKEN as string,
  },
  cloudinary: {
    cloudName: process.env.CLOUDNARY_NAME,
    apiKey: process.env.CLOUDNARY_KEY,
    apiSecret: process.env.CLOUDNARY_SECRET,
  },
  google: {
    searchApiKey: process.env.GOOGLE_SEARCH_API_KEY,
    searchId: process.env.GOOGLE_SEARCH_ID,
  },
  nodeEnv: process.env.NODE_ENV,
  database: getActiveDatabase(process.env.ACTIVE_DB || 'mysql2'),
};

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
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
    };
    return {
      client: db,
      connection: process.env.NODE_ENV === 'test' ? test : devlopment,
      migrations: {
        directory: `${__dirname}/../migrations`,
      },
    };
  }
}
