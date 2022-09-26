import * as net from 'net';
import { WebSocketServer } from 'ws';
var events = require('events');

// Event Emitter 
var eventEmitter = new events.EventEmitter();


//global variable to store galc and camera serial number
let galcSerialNumber = '';
let cameraSerialNumber = '';


// --------------------Websocket-------------------------------------------------------------------

//create object of websocket to commuicate with local angular application
const wss: WebSocketServer = new WebSocketServer({ port: 8080 });

//websocket event to communicate with angular app
wss.on('connection', (ws) => {
  console.log('websocket server started');
  //detect "send" event and send data to angular application when it triggers
  eventEmitter.on('send', (data) => {
    ws.send(data);
  })
})

function sendDataToWSS(data: string) {
  console.log(data);

  eventEmitter.emit('send', data);
}

// ----------------------------GALC server---------------------------------------

// creating GALC server to communicate with toyota GALC client
const galcServer = net.createServer((socket) => {
  console.log('Camera Connection from', socket.remoteAddress.slice(7), 'port', socket.remotePort.toString());
  console.log("before data event");

  //ackg variable is just used to modify the received data according to a code and sends back to GALC client
  let ackg: string = '';

  socket.on('data', (buffer: Buffer) => {
    galcSerialNumber = buffer.toString();
    sendDataToWSS("G@"+galcSerialNumber);
    console.log("GALC serial number: ", galcSerialNumber);
    socket.write(galcSerialNumber);
  });

  socket.on('end', () => {
    console.log('Closed', socket.remoteAddress, 'port', socket.remotePort);
  });
});


// OUTP_PLST010000010001610 
galcServer.maxConnections = 1;
galcServer.listen(51454);



// ---------------------------camera client-----------------------------------------------------

const camClient = net.connect({ port: 9876, host: '127.0.0.1', timeout: 10000 }, () => {
  console.log('connected to server!');
});

camClient.on('data', (data) => {
  console.log("cameraData", data.toString());
  sendDataToWSS("C@" + data);
  compareAndSend(galcSerialNumber, data.toString());
  console.log("after compareData");

  camClient.end();
});
camClient.on('error', (ev) => {
  console.log(ev);

})
camClient.on('end', () => {
  console.log('disconnected from server');
});


// --------------------compare data from galc and camera--------------------------------------
function compareAndSend(galcSerialNumber, cameraSerialNumber) {
  console.log(cameraSerialNumber, galcSerialNumber);

  if (galcSerialNumber === cameraSerialNumber) {
    // console.log("main: serial number matched");
    sendDataToWSS('M');

  } else if (galcSerialNumber === '' && cameraSerialNumber === '') {
    sendDataToWSS('GC');

  } else if (galcSerialNumber === '') {
    sendDataToWSS('G');

  } else if (cameraSerialNumber === '') {
    sendDataToWSS('C');

  } else if (galcSerialNumber != cameraSerialNumber) {
    sendDataToWSS('N');
  }
}



