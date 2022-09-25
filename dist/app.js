"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const net = __importStar(require("net"));
const server = net.createServer((socket) => {
    console.log('Connection from', socket.remoteAddress.slice(7), 'port', socket.remotePort);
    socket.on('data', (buffer) => {
        // console.log('Request from', buffer.toString() , 'port', socket.remotePort);
        let tmp = buffer.toString();
        let ackg = tmp.slice(6, 12) + tmp.slice(0, 6) + tmp.slice(12, 16) + tmp[16] + tmp.slice(17, 22) + tmp.slice(22, 24) + tmp.slice(24) + '00';
        socket.write(ackg);
    });
    socket.on('end', () => {
        console.log('Closed', socket.remoteAddress, 'port', socket.remotePort);
    });
});
// OUTP_PLST010000010001610 
server.maxConnections = 20;
server.listen(51454);
//# sourceMappingURL=app.js.map