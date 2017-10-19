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

var sshExec = require('ssh-exec')
// using ~/.ssh/id_rsa as the private key 
sshExec('ls -lh', 'root@gollum', function (err, stdout, stderr) {
  logger.debug('Starting up server. Testing SSH: ', err, stdout, stderr);
})

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
  logger.debug('Received a push event for %s to %s', event.payload.repository.name, event.payload.ref);
  switch(event.path) {
    case '/blogevents':
      sshExec('rm -rf /tmp/' + event.payload.repository.name + ' && git clone ' + event.payload.repository.clone_url + ' /tmp/' + event.payload.repository.name + ' && cd /tmp/' + event.payload.repository.name + '/ && ls -hal && npm install && dotnet publish -o ./publish/', 'root@gollum', function (err, stdout, stderr) {
        logger.debug('Results from deployment: ', err, stdout, stderr);
      });
    break
    default:
      // do sth else or nothing 
      break
  }
})
