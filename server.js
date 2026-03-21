const http = require('http');
const fs = require('fs');
const path = require('path');

let gameState = null;
let clients = [];

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); 

    if (req.method === 'GET' && req.url === '/') {
        fs.readFile(path.join(__dirname, '7ROOF M3 3ZEZ.html'), (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading HTML');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    } else if (req.method === 'GET' && req.url === '/game_logo.png') {
        const logoPath = 'C:\\Users\\PCD\\.gemini\\antigravity\\brain\\c15c2e02-5921-4339-8e11-2ee6a59e772a\\talal_logo_2_1774032839194.png';
        fs.readFile(logoPath, (err, data) => {
            if (err) { res.writeHead(404); res.end('Logo Not Found'); return; }
            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(data);
        });
    } else if (req.method === 'GET' && req.url === '/events') {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        
        if (gameState) res.write(`data: ${JSON.stringify(gameState)}\n\n`);
        
        clients.push(res);
        req.on('close', () => {
            clients = clients.filter(client => client !== res);
        });
    } else if (req.method === 'POST' && req.url === '/update') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                gameState = JSON.parse(body);
                clients.forEach(client => client.write(`data: ${JSON.stringify(gameState)}\n\n`));
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
    console.log(`🐝 خادم مزامنة لعبة حروف عزيز يعمل الآن!`);
    console.log(`🌐 ابحث عن الآي بي المحلي الخاص بك (IPv4)`);
    console.log(`   ثم افتح الرابط التالي في التابلت أو التلفزيون:`);
    console.log(`   http://<YOUR_LOCAL_IP>:3000`);
    console.log(`=======================================`);
});
