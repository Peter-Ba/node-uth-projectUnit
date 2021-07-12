const { Worker } = require('worker_threads')

const workerFile = './workerThreads/writeToFile.js';

const readFileName = './data/large-text.txt';

const writeFileNames = ['./workerThreads/writeFiles/write-file-1.txt', 
                        './workerThreads/writeFiles/write-file-2.txt', 
                        './workerThreads/writeFiles/write-file-3.txt', 
                        './workerThreads/writeFiles/write-file-4.txt', 
                        './workerThreads/writeFiles/write-file-5.txt']; 

const transformOptions = [{ searchValue: /a/gim, replaceValue: 'e' },
                            { searchValue: /e/gim, replaceValue: 'i' },
                            { searchValue: /i/gim, replaceValue: 'o' },
                            { searchValue: /o/gim, replaceValue: 'u' },
                            { searchValue: /u/gim, replaceValue: 'a' }];

for (let i = 0; i < writeFileNames.length; i++) {
    const writeFileName = writeFileNames[i];
    const transformOption = transformOptions[i];
    const workerData = { readFileName, writeFileName, transformOption };
    
    const worker = new Worker(workerFile, { workerData })
    worker.on('message', (({ message }) => console.log(message)))
    worker.on('error', console.error);
}
