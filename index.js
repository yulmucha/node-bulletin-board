const http = require('http');
const mysql = require('mysql');

const conn = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: ''
});

async function getPosts() {
    conn.connect(err => {
        if (err) {
            throw err;
        }
        // console.log('Connected');
    });

    const posts = [];
    // conn.query(`SELECT * FROM post`, (error, results, fields) => {
    //     if (error) {
    //         throw error;
    //     }
    //     // console.log(results);
    //     for (let r of results) {
    //         posts.push({
    //             id: r.id,
    //             title: r.title,
    //             text: r.text,
    //             views: r.views
    //         });
    //     }
    // });
    const postsPromise = new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM post`, (error, results, fields) => {
            if (error) {
                throw error;
            }
            // console.log(results);
            for (let r of results) {
                posts.push({
                    id: r.id,
                    title: r.title,
                    writer: r.writer,
                    postedDateTime: r.postedDateTime,
                    views: r.views
                });
            }
            resolve(posts);
        });
    });

    conn.end();

    return postsPromise;
}

function makeTableRows(posts) {
    let tableRows = '';
    for (let post of posts) {
        tableRows += `
        <tr>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.writer}</td>
            <td>${post.postedDateTime}</td>
            <td>${post.views}</td>
        </tr>`
    }
    return tableRows;
}

function makePostsTemplate(posts) {
    const rows = makeTableRows(posts)
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Node.js 게시판</title>
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
                ${rows}
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
        const postsPromise = getPosts();
        postsPromise.then(posts => {
            const template = makePostsTemplate(posts);
            response.writeHead(200);
            response.end(template);
        });
    } else if (request.url.startsWith('/posts/')) {
        const postNumber = request.url.slice(request.url.lastIndexOf('/') + 1);
        console.log(postNumber);
    } else {
        response.writeHead(404);
        response.end();
    }
});

app.listen(3000);