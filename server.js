const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// مستودع الغرف (كل غرفة تحتوي على حالتها وعملائها المتصلين)
let rooms = {};

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 

    let reqUrl;
    try {
        reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    } catch (err) {
        res.writeHead(400);
        res.end('Bad Request');
        return;
    }
    const pathname = reqUrl.pathname;
    const room = reqUrl.searchParams.get('room') || 'default';

    if (req.method === 'GET' && pathname === '/') {
        fs.readFile(path.join(__dirname, '7ROOF M3 3ZEZ.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading HTML');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    } else if (req.method === 'GET' && pathname === '/game_logo.png') {
        const logoPath = 'C:\\Users\\PCD\\.gemini\\antigravity\\brain\\c15c2e02-5921-4339-8e11-2ee6a59e772a\\talal_logo_2_1774032839194.png';
        fs.readFile(logoPath, (err, data) => {
            if (err) { res.writeHead(404); res.end('Logo Not Found'); return; }
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(data);
        });
    } else if (req.method === 'GET' && pathname === '/questions.js') {
        fs.readFile(path.join(__dirname, 'questions.js'), (err, data) => {
            if (err) { res.writeHead(404); res.end('Not Found'); return; }
            res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
            res.end(data);
        });
    } else if (req.method === 'GET' && pathname === '/questions_batch1.js') {
        fs.readFile(path.join(__dirname, 'questions_batch1.js'), (err, data) => {
            if (err) { res.writeHead(404); res.end('Not Found'); return; }
            res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
            res.end(data);
        });
    } else if (req.method === 'GET' && pathname === '/questions_batch2.js') {
        fs.readFile(path.join(__dirname, 'questions_batch2.js'), (err, data) => {
            if (err) { res.writeHead(404); res.end('Not Found'); return; }
            res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
            res.end(data);
        });
    } else if (req.method === 'GET' && pathname === '/questions_batch3.js') {
        fs.readFile(path.join(__dirname, 'questions_batch3.js'), (err, data) => {
            if (err) { res.writeHead(404); res.end('Not Found'); return; }
            res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
            res.end(data);
        });
    } else if (req.method === 'GET' && pathname === '/questions_batch4.js') {
        fs.readFile(path.join(__dirname, 'questions_batch4.js'), (err, data) => {
            if (err) { res.writeHead(404); res.end('Not Found'); return; }
            res.writeHead(200, { 'Content-Type': 'application/javascript; charset=utf-8' });
            res.end(data);
        });
    } else if (req.method === 'GET' && pathname === '/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        
        if (!rooms[room]) {
            rooms[room] = { gameState: null, clients: [] };
        }
        
        if (rooms[room].gameState && rooms[room].gameState.isRoomLocked) {
             res.write(`event: room_locked\ndata: {}\n\n`);
             res.end();
             return;
        }
        
        if (rooms[room].gameState) res.write(`data: ${JSON.stringify(rooms[room].gameState)}\n\n`);
        
        rooms[room].clients.push(res);
        req.on('close', () => {
            if(rooms[room]) {
                rooms[room].clients = rooms[room].clients.filter(client => client !== res);
            }
        });
    } else if (req.method === 'POST' && pathname === '/update') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                if (!rooms[room]) {
                    rooms[room] = { gameState: null, clients: [] };
                }
                rooms[room].gameState = JSON.parse(body);
                rooms[room].clients.forEach(client => client.write(`data: ${JSON.stringify(rooms[room].gameState)}\n\n`));
                res.writeHead(200);
                res.end('OK');
            } catch (e) {
                res.writeHead(400);
                res.end('Bad JSON');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`=======================================`);
    console.log(`🐝 خادم مزامنة لعبة أداة الغرف يعمل الآن!`);
    console.log(`🌐 يمكنك لعب أكثر من فريق بوقت واحد بأمان`);
    console.log(`   http://localhost:3000`);
    console.log(`=======================================`);
});
