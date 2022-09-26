import { dataFromCamera } from "./main";

const net = require('net');  

//camera client
const client = net.connect(9876, '127.0.0.1', () => {
  console.log('connected to server!');  
});  
client.on('data', (data) => {  
  console.log(data.toString());  
  dataFromCamera(data.toString());
  client.end();  
});  
client.on('end', () => {  
  console.log('disconnected from server');  
});  


