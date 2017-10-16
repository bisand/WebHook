var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = function(d) { //
  log_file.write(util.format(d) + '\n');
  log_stdout.write(util.format(d) + '\n');
};

var http = require('http')
var createHandler = require('node-github-webhook')
var handler = createHandler([ // multiple handlers 
  { path: '/blogevents', secret: '!PulverPadda01' }
])
// var handler = createHandler({ path: '/webhook1', secret: 'secret1' }) // single handler 
 
http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(7777)
 
handler.on('error', function (err) {
  console.error('Error:', err.message)
})
 
handler.on('push', function (event) {
  console.log(
    'Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref
  )
  switch(event.path) {
    case '/blogevents':
      // do sth about blogevents 
      break
    default:
      // do sth else or nothing 
      break
  }
})
