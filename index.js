const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const admZip = require('adm-zip');
const serveStatic = require('serve-static');
const { exec } = require('node:child_process');

console.log('Starting...');
const port = 8080;

const app = express();
app.disable('x-powered-by');
app.disable('etag');

app.get('/', (req, res) => {
  res.sendFile(`index.html`, { root: './web-page/' });
});

function shouldCompress(req) {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return true;
};

app.use(compression({
  filter: shouldCompress,
  threshold: 0
  }),
  serveStatic((__dirname + '/web-page/'), {
    setHeaders: function(res, path) {
      file_path = serveStatic.mime.lookup(path);
      if (file_path === 'text/html' || file_path === 'text/css' || file_path === 'application/javascript') {
        res.setHeader('Cache-Control', 'public, max-age=0');
      } else {
        res.setHeader('cache-control', 'public, max-age=2592000');
      }
    }
  }),
  express.static(__dirname + '/web-page/'), (_, res, next) => {
    res.status(404)
    res.sendFile(__dirname + '/web-page/404.html')
  });

app.get('/download', (req, res) => {
  res.send('test');
});

app.head(/.*$/, (req, res) => {
  res.status(200).send(null);
  console.log('200 - OK [Pong!]');
});

app.listen(port, (error) => {
  if (error) throw error;
  console.info(`App listening on port ${port}!`);
  commandListener();
});

//# Check for new vanilla packs once per hour:
setInterval(() => {
  //dconst 
},3600000);

//# Functions:
async function commandListener() {
  const stdOutput = await new Promise(async (resolve) => {
    const options = {};
    let input = await new Promise((inputResolve => {
      process.stdin.once('data', data => inputResolve(data.toString().trim()));
    }));
    let output = 'null\n';

    if (input.startsWith('dir:"')) {
      let index;
      options.cwd = '';
      for (index = 5; input[index] !== '\"'; index++) {
        options.cwd += input[index];
      }
      input = input.slice(index + 2);
    }

    if (input.startsWith('debug:')) {
      try {
        output = `Success!\n${eval(input.slice(6))}`;
      } catch (error) {
        output = `Error!\n${error}`;
      }
      resolve(`${output}\n`);
    }

    if (input === 'exit' || input === 'stop') {
      process.exit(1);
    }

    if (input === 'clear') {
      output = '\x1Bc\n';
      resolve(output);
    }

    exec(input, options, (error, stdout, stderr) => {
      if (stdout) {
        output = stdout;
      } else if (stderr) {
        output = stderr;
      } else if (error) {
        output = `[${error.code} ${error.name}] - ${error.message}`;
      }
      resolve(output);
    });
  });

  process.stdout.write(`> ${stdOutput}`);
  setTimeout(commandListener, 250);
}