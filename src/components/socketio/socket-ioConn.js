import { SOCKET_URL } from '../fetch/url';
import socketIOClient from "socket.io-client";

let params = {};

export const userDataGrabber = (result) => {
    params = {
        query: 'token=' + result.token,
        forceNew: true,
        secure: true
    }
    window.location.reload();
};

if (sessionStorage.getItem('userData') !== null) {
    params = {
        query: 'token=' + sessionStorage.getItem('userData'),
        forceNew: true,
        secure: true
    }
}

const endpoint = SOCKET_URL;
const socket = socketIOClient(endpoint, params);
console.log(params)

export default socket;
