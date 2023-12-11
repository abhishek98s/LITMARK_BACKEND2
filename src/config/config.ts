import dotenv from 'dotenv'

dotenv.config()

export const config = {
    app: {
        name: process.env.NAME || 'LITMARK_BACKEND',
        port: process.env.SERVER_PORT || '5000'
    }
}