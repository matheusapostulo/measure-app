import {z} from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    GEMINI_API_KEY: z.string(),
});

const env = envSchema.parse(process.env);

export default env;

