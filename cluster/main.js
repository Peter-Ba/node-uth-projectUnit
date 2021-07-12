const fs = require('fs');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const { pipeline } = require('stream');
const Replace = require('./Replace');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs && i < 5; i += 1) {
    cluster.fork({ CPU_ID: i });
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} completed task`);
  });
} else {
  const replaceTransformStreams = [
    new Replace({ searchValue: /a/gim, replaceValue: 'e' }),
    new Replace({ searchValue: /e/gim, replaceValue: 'i' }),
    new Replace({ searchValue: /i/gim, replaceValue: 'o' }),
    new Replace({ searchValue: /o/gim, replaceValue: 'u' }),
    new Replace({ searchValue: /u/gim, replaceValue: 'a' }),
  ];

  const outputFilepaths = [
    './output/a_to_e.txt',
    './output/e_to_i.txt',
    './output/i_to_o.txt',
    './output/o_to_u.txt',
    './output/u_to_a.txt',
  ];

  const readStream = fs.createReadStream('./data/large.txt');
  const writeStream = fs.createWriteStream(outputFilepaths[process.env.CPU_ID]);

  console.time();
  pipeline(
    readStream,
    replaceTransformStreams[process.env.CPU_ID],
    writeStream,
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.timeEnd();
        process.exit();
      }
    }
  );
}
