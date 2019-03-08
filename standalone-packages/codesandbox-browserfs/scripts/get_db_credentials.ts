// #! /usr/bin/env node

// import {readFileSync, writeFileSync, existsSync} from 'fs';
// import {Dropbox} from 'dropbox';
// import express = require('express');
// import {parse as parseUrl} from 'url';
// import {json as jsonBodyParser} from 'body-parser';
// import {Server} from 'http';

// const CLIENT_ID = 'c6oex2qavccb2l3';

// // Required for DropboxJS to work.
// // https://github.com/dropbox/dropbox-sdk-js/issues/188
// (global as any).fetch = require('isomorphic-fetch');

// const tokenPath = process.argv[2];
// if (!tokenPath) {
//   console.log(`Usage: ${process.argv[0]} ${process.argv[1]} path/to/token.json`);
//   process.exit(1);
// }

// // Check if there are some credentials already stored
// let token: any = null
// if (existsSync(tokenPath)) {
//   const tokenData = readFileSync(tokenPath, 'utf8')
//   try {
//     token = JSON.parse(tokenData)
//   } catch (e) {
//     // Do nothing.
//   }
// }

// // Use them to authenticate if there are
// if (token) {
//   const client = new Dropbox(token);
//   client.usersGetCurrentAccount(undefined).then((res) => {
//     console.log(`Token authenticates to ${res.name.display_name}'s Dropbox.`);
//   }).catch((e) => {
//     console.log(`Invalid / outdated token found on disk at ${tokenPath}; re-authenticating...`);
//     authenticate();
//   });
// } else {
//   authenticate();
// }

// function authenticate() {
//   const client = new Dropbox({ clientId: CLIENT_ID });
//   const authUrl = client.getAuthenticationUrl("http://localhost:3030/auth");
//   const app = express();
//   app.use(jsonBodyParser());
//   let server: Server;

//   app.get('/auth', function(req, res) {
//     res.status(200);
//     // Write code that POST's code to server from client.
//     res.write(Buffer.from(`<!DOCTYPE html>
// <html>
//   <head>
//     <title>BrowserFS Dropbox Authentication</title>
//   </head>
//   <body>
//     <h1 id="status">Sending access token to BrowserFS...</h1>

//     <p id="details">Please wait one moment...</p>

//     <script type="text/javascript">
//       (function() {
//         var status = document.getElementById('status');
//         var detail = document.getElementById('detail');
//         // Send full URL, including #, to server.
//         var xhr = new XMLHttpRequest();
//         xhr.onload = function() {
//           var statusCode = xhr.status;
//           var statusText = xhr.statusText;
//           if (statusCode >= 200 && statusCode < 300) {
//             document.title = "Success!";
//             status.innerText = "Success!";
//             details.innerText = xhr.responseText;
//           } else {
//             document.title = "Failed";
//             status.innerText = "Failed";
//             details.innerText = xhr.responseText;
//           }
//         };
//         xhr.open('POST', 'http://localhost:3030/authurl');
//         xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
//         xhr.send(JSON.stringify({url: window.location.href}));
//       })();
//     </script>
//   </body>
// </html>`, 'utf8'));
//     res.end();
//   });

//   app.post('/authurl', function(req, res) {
//     if (!req.body || !req.body.url) {
//       console.error(`Unable to retrieve Dropbox access token.`);
//       res.status(400);
//       res.send();
//       server.close(() => process.exit(1));
//     } else {
//       const rawUrl = req.body.url;
//       // Dropbox URLs use query params, but use # instead of ? to denote them.
//       // Switch to '?' so the url package can parse them.
//       const url = parseUrl(rawUrl.replace("#", "?"), true);
//       console.log(req.url);
//       console.log(url);
//       const token = url.query['access_token'];
//       if (token) {
//         res.status(200);
//         writeFileSync(tokenPath, Buffer.from(`{ "accessToken": "${token}" }`, 'utf8'));
//         const successMsg = `Successfully saved Dropbox token to ${tokenPath}. You may now close your browser.`;
//         console.log(successMsg);
//         res.write(Buffer.from(successMsg, 'utf8'));
//       } else {
//         res.status(400);
//         const failureMsg = `Unable to retrieve Dropbox token. Please try again.`;
//         console.log(failureMsg);
//         res.write(Buffer.from(failureMsg, 'utf8'));
//       }
//       res.end();
//       setTimeout(() => {
//         server.close(function() {
//           // Exit w/ error if failed to get token.
//           process.exit(token ? 0 : 1);
//         });
//       }, 500);
//     }
//   });

//   server = app.listen(3030, function() {
//     console.log(`Navigate to ${authUrl} and log in to Dropbox.`);
//   });
// }
