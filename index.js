import path from 'node:path';
import { readFileSync } from 'node:fs';
import parser from './parsers.js';
import formatter from './formatter.js';

const genDiff = (data1, data2, format = 'stylish') => {
  const resolvePath = (filepath) => path.resolve(filepath);
  const getExtension = (filename) => path.extname(filename).slice(1);

  const getData = (filePath) => parser({
    data: readFileSync(filePath, 'utf-8'),
    format: getExtension(filePath),
  });

  const path1 = resolvePath(data1);
  const path2 = resolvePath(data2);

  const datan1 = getData(path1);
  const datan2 = getData(path2);

  return formatter(datan1, datan2, format);
};

export default genDiff;
