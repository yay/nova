import fs from 'fs';
import path from 'path';

fs.symlinkSync(path.resolve('.', '../server/src'), './server', 'dir');