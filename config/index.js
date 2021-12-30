import { development } from './development.env.js';
import { production } from './production.env.js';

export const nodEnv = process.env.NODE_ENV;

export default { development, production };
