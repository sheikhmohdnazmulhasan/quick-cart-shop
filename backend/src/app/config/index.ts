import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    port: process.env.PORT,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
    jwt_secret: process.env.JWT_SECRET
}