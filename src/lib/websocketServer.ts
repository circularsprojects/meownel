import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { attachRaw } from './kubernetes';
import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import 'dotenv/config';
import { fromNodeHeaders } from 'better-auth/node';

const server = createServer();
const wss = new WebSocketServer({ server, path: '/terminal' });

const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.POSTGRES_URL,
    })
});

wss.on('connection', async (ws: WebSocket, req) => {
    console.log("Websocket connection established");

    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    }).catch(err => {
        console.error("Error getting session:", err);
        return null;
    });
    if (!session) {
        console.log("Websocket connection unauthorized, closing");
        ws.close(1008, 'Unauthorized');
        return;
    }

    const urlParams = new URLSearchParams(req.url?.split('?')[1]);
    const podName = urlParams.get('podName');
    const containerName = urlParams.get('containerName');

    if (!podName || !containerName) {
        ws.close(1008, 'Missing podName or containerName');
        return;
    }
    
    attachRaw(ws, podName, containerName).catch(err => {
        console.error('Error attaching to pod:', err);
        ws.close(1011, 'Internal server error');
    });
});

const PORT = process.env.WEBSOCKET_PORT || 8080;
server.listen(PORT, () => {
    console.log(`WebSocket server is listening on ws://localhost:${PORT}/terminal`);
});

// server.on('upgrade', async (request, socket, head) => {
//     // This function is not defined on purpose. Implement it with your own logic.
//     const session = await auth.api.getSession({
//         headers: fromNodeHeaders(request.headers)
//     });
//     if (session) {
//         wss.handleUpgrade(request, socket, head, function done(ws) {
//             wss.emit('connection', ws, request);
//         });
//     } else {
//         socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
//         socket.destroy();
//         console.log("Websocket connection unauthorized, closing");
//         return;
//     }
// });