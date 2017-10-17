var log4js = require('log4js');
log4js.configure({
  appenders: { file: { type: 'file', filename: 'debug.log' } },
  categories: { default: { appenders: ['file'], level: 'debug' } }
});
var logger = log4js.getLogger('file');
logger.level = 'debug';
logger.debug("Starting server...");

var http = require('http')
var createHandler = require('node-github-webhook')
var handler = createHandler([ // multiple handlers 
  { path: '/blogevents', secret: '!PulverPadda01' }
])
// var handler = createHandler({ path: '/webhook1', secret: 'secret1' }) // single handler 

var exec = require('ssh-exec')
// using ~/.ssh/id_rsa as the private key 
exec('ls -lh', 'root@gollum').pipe(process.stdout)

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)
 
handler.on('error', function (err) {
  logger.error('Error:', err.message);
})
 
handler.on('*', function (event) {
  logger.debug('Received a push event: ', event);
  logger.debug('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref);
  switch(event.path) {
    case '/blogevents':
      ssh.command('echo', 'test', function(procResult) {
        console.log(procResult.stdout);
      });
      break
    default:
      // do sth else or nothing 
      break
  }
})
