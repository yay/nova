import fs from 'fs';
import path from 'path';

fs.symlinkSync(path.resolve('.', '../server/src'), './src/server', 'dir');