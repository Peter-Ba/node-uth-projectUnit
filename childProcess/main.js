const fs = require('fs');
const {
  fork
} = require('child_process');


/* 
What are the four different ways to create a child process? 
What are the differences between them?
Which of these four have a synchronous version?
*/

// Discuss with your partner the approach you both find best, to create the seperate write folders and create them.

const outputFilepaths = [
  './output/a_to_e.txt',
  './output/e_to_i.txt',
  './output/i_to_o.txt',
  './output/o_to_u.txt',
  './output/u_to_a.txt',
];

const replaceTransformStreams = [{
    searchValue: /a/gim,
    replaceValue: 'e'
  },
  {
    searchValue: /e/gim,
    replaceValue: 'i'
  },
  {
    searchValue: /i/gim,
    replaceValue: 'o'
  },
  {
    searchValue: /o/gim,
    replaceValue: 'u'
  },
  {
    searchValue: /u/gim,
    replaceValue: 'a'
  },
];

for (let i = 0; i < outputFilepaths.length; i++) {
  const childProcess = fork('./childProcess/childProcess.js');
  const currentTransformStream = replaceTransformStreams[i];
  const currentFile = outputFilepaths[i];

  childProcess.send({
    currentTransformStream,
    currentFile
  });
  childProcess.on('message', (message) => {
    console.log(message);
  })
}