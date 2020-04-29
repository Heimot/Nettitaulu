import { SOCKET_URL } from '../fetch/url';
import socketIOClient from "socket.io-client";

let userData = sessionStorage.getItem('userData');

export const userDataGrabber = (result) => {
    userData = result.token;
};

const endpoint = SOCKET_URL;
const socket = socketIOClient(endpoint, {
    query: 'token=' + sessionStorage.getItem('userData'),
    forceNew: true,
    secure: true
});

export default socket;
