const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/:n', (req, res) => {
  let n = parseInt(req.params.n);
  let count = 0;

  /* LONG RUNNING PROCESS */
  if (n > 5000000000) n = 5000000000;

  for (let i = 0; i <= n; i++) {
    count += 1;
  }

  res.send('Finished running process');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
