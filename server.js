const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(`${__dirname}/dist`));

app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log('server started at port: ' + PORT);
});
