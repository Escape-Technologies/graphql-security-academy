---
title: 'Configure HTTP Headers for User Protection'
description: 'Understand the role of the Access-Control-Allow-Origin header in safeguarding users from cross-site request forgery (CSRF) attacks.'
category: 'HTTP'
difficulty: 'Medium'
owasp: 'API7:2023'
authors: ['escape']
---

Modern browsers all feature new security mechanisms offering developers ways to protect their users from online threats. A common threat is [cross-site request forgery (CSRF)](https://escape.tech/blog/understanding-and-dealing-with-cross-site-request-forgery-attacks/), which is an attack that tricks a user into performing an action they didn't intend to do. In this lesson, you'll learn how to setup the `Access-Control-Allow-Origin` header to protect your users from CSRF attacks.

## Cross-site request forgery

This lesson contains two websites: a vulnerable GraphQL server (in `src/`) and an evil website (in `evil/`). The vulnerable server is a simple GraphQL server that allows users to register to a forum. The evil website's goal is to trick users into registering to the forum without their consent.

To start the servers, run:

- `npm install` and `npm start` in one terminal.
- `npm run evil` in another terminal.

The two websites should open. Try creating an account on the forum, then copy the URL of the forum into the evil website. After refreshing the list of users, you should now see an _Evil >:}_ account at the bottom of the list.

The evil website performed a CSRF attack. It used your browser to send a request to the vulnerable server, which created an account for you without your consent. This is possible because the vulnerable server doesn't protect itself against CSRF attacks.

## Access-Control-Allow-Origin

Fortunately, modern browsers offer a way to prevent these malicious requests: the `Access-Control-Allow-Origin` header. This header allows a server to specify which websites are allowed to send requests to it. If a website tries to send a request to a server that doesn't allow it, the browser will block the request.

The [cors](https://www.npmjs.com/package/cors) package takes care of sending the header for us, but we need to configure it first. Open `src/index.js` and update the `app.post('/graphql', ...)` line:

```js
app.post(
  '/graphql',
  // Copy the value after `Server origin:` on the vulnerable server
  cors({ origin: '<Server origin>' }),
  bodyParser.json(),
  expressMiddleware(server),
);
```

This header tells all browsers to block requests coming from any website other than the right one. The evil website has a different origin (which is the combination of HTTP scheme, hostname and port) than the vulnerable server, so the browser will block the request.

The vulnerable server should restart automatically. Try to perform the attack again from the evil website: the request fails with a network error. **Our server is now safe from CSRF attacks!**
