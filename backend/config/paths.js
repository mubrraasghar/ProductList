import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getRootDir = () => path.join(__dirname, '..');
export const getFrontendDir = () => path.join(getRootDir(), 'frontend');
export const getFrontendDistDir = () => path.join(getFrontendDir(), 'dist'); 