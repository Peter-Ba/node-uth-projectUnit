const { Worker } = require('worker_threads');

const workerFile = './workerThreads/writeToFile.js';

const readFileName = './data/large.txt';

const writeFileNames = [
  './output/a_to_e.txt',
  './output/e_to_i.txt',
  './output/i_to_o.txt',
  './output/o_to_u.txt',
  './output/u_to_a.txt',
];

const transformOptions = [
  { searchValue: /a/gim, replaceValue: 'e' },
  { searchValue: /e/gim, replaceValue: 'i' },
  { searchValue: /i/gim, replaceValue: 'o' },
  { searchValue: /o/gim, replaceValue: 'u' },
  { searchValue: /u/gim, replaceValue: 'a' },
];

for (let i = 0; i < writeFileNames.length; i++) {
  const writeFileName = writeFileNames[i];
  const transformOption = transformOptions[i];
  const workerData = { readFileName, writeFileName, transformOption };

  const worker = new Worker(workerFile, { workerData });
  worker.on('message', ({ message }) => console.log(message));
  worker.on('error', console.error);
}
