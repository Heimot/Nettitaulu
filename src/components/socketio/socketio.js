import socket from './socket-ioConn';

export const socketConnChat = () => {
    socket.emit('chat', {
        message: true
    });
}

export const socketConnID = (_id) => {
    socket.emit('idUpdate', {
        id: _id,
        message: true
    });
}

export const socketConnRullakko = () => {
    socket.emit('rullakotUpdt', {
        message: true
    });
}