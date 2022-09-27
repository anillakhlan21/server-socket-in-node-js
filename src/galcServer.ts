import * as net from 'net';
import { WebSocketServer } from 'ws';
var events = require('events');

// Event Emitter 
var eventEmitter = new events.EventEmitter();


//global variable to store galc and camera serial number
let galcSerialNumber = '#';
let cameraSerialNumber = '#';


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

  // eventEmitter.emit('send', data);


// ----------------------------GALC server---------------------------------------

// creating GALC server to communicate with toyota GALC client
const galcServer = net.createServer((socket) => {
  console.log('Camera Connection from', socket.remoteAddress.slice(7), 'port', socket.remotePort.toString());
  console.log("before data event");

  //ackg variable is just used to modify the received data according to a code and sends back to GALC client
  let ackg: string = '';

  socket.on('data', (buffer: Buffer) => {
    galcSerialNumber = buffer.toString();
    console.log("GALC serial number: ", galcSerialNumber);
    eventEmitter.emit("send","G@"+galcSerialNumber);

    //acknowledgement data sending
    socket.write(galcSerialNumber);

    //compare and send color signal to websocket if both serial number is not '#'
    if(cameraSerialNumber !='#'){
      compareAndSend(galcSerialNumber,cameraSerialNumber);
      galcSerialNumber='#';
      cameraSerialNumber='#';
    }
  });

  socket.on('end', () => {
    console.log('Closed', socket.remoteAddress, 'port', socket.remotePort);
  });
});


// OUTP_PLST010000010001610 
galcServer.maxConnections = 1;
galcServer.listen(51454);



// ---------------------------camera client-----------------------------------------------------

const camClient = net.connect({ port: 9876, host: '127.0.0.1'}, () => {
  console.log('connected to server!');
});

camClient.on('data', (data) => {
  cameraSerialNumber = data.toString();
  console.log("cameraData", cameraSerialNumber);
  eventEmitter.emit("send","C@" + data);

  if(galcSerialNumber != '#'){
    compareAndSend(galcSerialNumber, cameraSerialNumber);
    galcSerialNumber = '#';
    cameraSerialNumber = '#';
  }
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
    eventEmitter.emit('send','M');

  } else if (galcSerialNumber === ' ' && cameraSerialNumber === ' ') {
    eventEmitter.emit('send','GC');

  } else if (galcSerialNumber === ' ') {
    eventEmitter.emit('send','G');

  } else if (cameraSerialNumber === '') {
    eventEmitter.emit('send','C');

  } else if (galcSerialNumber != cameraSerialNumber) {
    eventEmitter.emit('send','N');
  }
}



