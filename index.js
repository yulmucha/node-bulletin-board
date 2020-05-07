const http = require('http');
const fs = require('fs');

function makeTemplate(posts) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회</th>
                </tr>
            </thead>
            <tbody>
            ${posts}
            </tbody>        
        </table>
    </body>
    </html>`;
}

function redirect(url, response) {
    response.writeHead(302, { Location: url });
    response.end();
}

const app = http.createServer((request, response) => {
    if (false) {
        response.writeHead(403);
        response.end();
    }
    if (request.url === '/') {
        redirect('/posts', response);
    } else if (request.url === '/posts') {
        response.writeHead(200);
        response.end(makeTemplate(''));
    } else if (request.url.startsWith('/posts/')) {
        const postNumber = request.url.slice(request.url.lastIndexOf('/') + 1);
        console.log(postNumber);
    } else {
        response.writeHead(404);
        response.end();
    }
});

app.listen(3000);