import * as net from 'net';
import { dataFromCamera, dataFromGALC } from './main';
import { WebSocketServer } from 'ws';

var events = require('events');
var eventEmitter = new events.EventEmitter();


let galcSerialNumber = '';
let cameraSerialNumber = '';

const wss: WebSocketServer = new WebSocketServer({port: 8080});

wss.on('connection', (ws)=>{
  console.log('websocket server started');
  
  eventEmitter.on('send',(data)=>{
    ws.send(data);
  // sendDataToWSS();
  // console.log(data);
  
    
  })
})
const galcServer = net.createServer((socket) => {
  console.log('Camera Connection from', socket.remoteAddress.slice(7), 'port', socket.remotePort.toString());
  console.log("before data event");
  
  let ackg: string = '';
  // socket.write("hiiii");
  socket.on('data', (buffer: Buffer) => {
    galcSerialNumber = buffer.toString();
      console.log(galcSerialNumber);
      socket.write(galcSerialNumber);      
    // }

  });
  socket.on('end', () => {
    console.log('Closed', socket.remoteAddress, 'port', socket.remotePort);
  });
});

function sendDataToWSS(data: string){
  console.log(data);
  
    eventEmitter.emit('send', data);
}

const camClient = net.connect({port:9876, host:'127.0.0.1', timeout: 10000}, () => {
  console.log('connected to server!');  
}); 

camClient.on('data', (data) => {  
  console.log("cameraData",data.toString());  
  compareAndSend(galcSerialNumber,data.toString());
  console.log("after compareData");
  
  camClient.end();  
});  
camClient.on('error',(ev)=>{
  console.log(ev);
  
})
camClient.on('end', () => {  
  console.log('disconnected from server');  
});
function compareAndSend(galcSerialNumber,cameraSerialNumber){
  console.log(cameraSerialNumber, cameraSerialNumber);
  
  if(galcSerialNumber === cameraSerialNumber){
    // console.log("main: serial number matched");
    sendDataToWSS('M');
    
}else if(galcSerialNumber === '' &&  cameraSerialNumber === ''){
    // console.log("main: empty galc & camera serial number");
    sendDataToWSS('GC');
    
}else if(galcSerialNumber === ''){
    // console.log("main: empty galc serial number");
    sendDataToWSS('G');

}else if(cameraSerialNumber === ''){
    // console.log("main: empty camera serial number");
    sendDataToWSS('C');

}else if(galcSerialNumber != cameraSerialNumber){
    // console.log("main: serial number unmatched");
    sendDataToWSS('N');

}

}


 
// OUTP_PLST010000010001610 
galcServer.maxConnections = 1;
galcServer.listen(51454);