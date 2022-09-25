import * as net from 'net';

const server = net.createServer((socket) => {
  console.log('Connection from', socket.remoteAddress.slice(7), 'port', socket.remotePort);

  socket.on('data', (buffer: Buffer) => {
    // console.log('Request from', buffer.toString() , 'port', socket.remotePort);
    let tmp: string = buffer.toString();
    let ackg: string = tmp.slice(6,12)+tmp.slice(0,6)+tmp.slice(12,16)+ tmp[16] + tmp.slice(17,22) + tmp.slice(22,24) +tmp.slice(24)+'00';
    socket.write(ackg);
  });
  socket.on('end', () => {
    console.log('Closed', socket.remoteAddress, 'port', socket.remotePort);
  });
});
// OUTP_PLST010000010001610 
server.maxConnections = 20;
server.listen(51454);