---
banner: ./banner.png
slug: software/node
title: Node js
description: Node.js is first and foremost a runtime environment.
---

How do you build a modern website that’s fast and responsive, regardless of its
traffic? In the current age of JavaScript web development, the answer for many
of us is [Node.js](https://nodejs.org/en/). First introduced in 2009, this
open-source JavaScript runtime environment has since garnered widespread acclaim
and now has a huge community. It’s one of the go-to solutions for getting the
back end of a JavaScript website up and running fast. Indeed, in 2019,
StackOverflow ranked Node.js the
[most popular tool](https://insights.stackoverflow.com/survey/2019#technology-_-other-frameworks-libraries-and-tools)
in the Frameworks, Libraries, and Tools category, even above big names like
.NET, Unity, and TensorFlow. It’s also an essential element of the popular
[MEAN stack](https://www.ibm.com/cloud/learn/mean-stack-explained) (MongoDB,
Express, Angular, Node.js) for full stack web development.

Node.js allows you to use JavaScript for back-end development, as an
aptcounterpart to popular front-end JavaScript frameworks like React, Angular,
or Vue. Somewhat uniquely, it’s event-driven and non-blocking, meaning it can
handle a huge number of requests in a single thread, with few bottlenecks.
Real-time services—such as chat rooms, collaboration tools, and even
[Netflix](https://tsh.io/blog/why-use-nodejs/#caption-attachment-12839:~:text=Netflix%20chose%20Node.js)—shine
thanks to Node.js’s responsiveness and scalability. As a result, it’s a popular
choice for organizations who already work with JavaScript, as well as for
developers looking to quickly get a web server running.

---

# What is Node.js?

Node.js is first and foremost a runtime environment. It enables you to write
JavaScript code that executes server-side, and run that code outside of a
browser. It also functions as a back-end framework that streamlines much of the
initial setup of a web development environment. In simple terms, it provides you
the tools and language for building your backend, as well as a command line from
which to run it. There’s also a sizable library of third-party modules
(downloadable through [npm](https://www.npmjs.com/)), adding various
functionalities covering networking, data streams, input/output, and other core
functions.

Node.js is built off the hugely popular
[Chrome V8](https://nodejs.dev/learn/the-v8-javascript-engine) JavaScript
engine, which is continuously evolving and growing. As Node.js’s backbone, this
engine makes building websites and web apps with optimized performance not just
possible, but easy.

---

# How does Node.js work?

Node.js’s founder, Ryan Dahl, envisioned a framework that could integrate
[advanced push features](https://www.oreilly.com/library/view/node-up-and/9781449332235/pr02.html#forward:~:text=Rather%2C%20I%20was%20concerned%20about%20the,instead%20of%20having%20to%20constantly%20poll)
into web development. At the time, existing web platforms had only relied on the
user sending requests, and the server receiving them. Email websites used
polling (sending frequent, consistent HTTP requests from the user to the server)
to quickly update a user’s inbox whenever new mail would arrive. Dahl wanted a
web platform that could make “push” requests from the server to the user’s
browser, just as quickly as the user could make “pull” requests. But to do this,
the framework would need to handle a large number of open connections at once,
without sacrificing the performance of any one connection.

Existing web technologies would handle this through
[multithreading](https://www.linuxjournal.com/content/three-ways-web-server-concurrency)—for
each request received, the server would create a new execution thread from a
limited pool, and each thread’s code would run independently but sequentially.
If there weren’t any available threads, the user would wait for one.

Node.js does not require multiple threads. Instead, it can run many connections
at once by using a single JavaScript thread with an
[event loop](https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/).
Operations that would hold up the entire thread, such as input/output (I/O)
operations or CPU-intensive calculations, are added to the event loop’s queue.
These operations are known as
[blocking operations](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/),
and they can often cause long wait times and “this page is unresponsive” error
messages. Node.js convention places these big operations inside
[callback functions](https://nodejs.org/en/knowledge/getting-started/control-flow/what-are-callbacks/),
so that the rest of the code can continue to run without stopping in the middle
of a function.

The code continues, your website UI stays responsive and fast, and Node.js lets
your server OS handle the execution of the blocking operations. This approach is
commonly referred to as asynchronous programming, using non-blocking methods.

Here’s an example adapted from the
[Node.js documentation](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/).
Accessing the file system is one of the most time-consuming functions you can
have on a website. This is a file read that executes synchronously (in order of
lines):

    const fs = require('fs'); // loads the fs (file system) module
    const data = fs.readFileSync('/file.md'); // this operation waits until file is read
    console.log(data);
    moreWork(); // will run after console.log

And the asynchronous alternative that doesn’t block execution:

    const fs = require('fs');
    fs.readFile('/file.md', (err, data) => {
      // this will run once the read operation is complete
      if (err) throw err;
      console.log(data);
    });
    moreWork(); // will run before console.log, without waiting for the file read

This method allows JavaScript execution to continue, without waiting for
system-level operations (like disk or network access) to complete. This can make
a significant difference in performance and capacity. It’s the difference
between a website that freezes and goes gray when a user submits a form, and a
website that instantly responds, regardless of how long I/O is taking.

## Packages and modules

Apart from its inbuilt functionality, you can significantly expand Node.js’s
potential by using one of hundreds of user-created modules, which can be added
to the project through [npm](https://www.npmjs.com/) (“node package manager”).

Of particular note is the Express module, which you can use to configure
[HTTP routing](https://expressjs.com/en/guide/routing.html), create detailed
middleware, and quickly set up a fully functioning web server. For testing your
work, the [nodemon](https://www.npmjs.com/package/nodemon) tool is indispensable
for automatically restarting your server when you make changes. What’s more,
Node.js and Express can
[integrate cleanly with MongoDB](https://expressjs.com/en/guide/database-integration.html),
MySQL, PostgreSQL, and many other popular databases, making for seamless
back-end development.

---

# Benefits of using Node.js

Node.js’s workflow entails a unique set of advantages that make the environment
ideal in a number of scenarios. Let’s go over them.

## Highly performant for most use-cases

Node.js’s asynchronous, event-driven approach suits a vast range of websites.
Despite only using a single thread, the non-blocking I/O and the JavaScript
event loop allow Node.js to excel at handling any number of requests. Your users
will see a responsive website that doesn’t freeze when I/O is involved, and
which will load at lightning speed on the Chrome V8 engine. That being said,
Node.js is only comfortable with many smaller tasks—CPU-intensive requests will
hold up the thread, and should be avoided or offloaded (we explore this in the
drawbacks section).

## Easy to learn

Those already familiar with JavaScript can easily adapt to Node.js. What’s more,
Node.js can also be written in
[TypeScript](https://blog.logrocket.com/typescript-with-node-js-and-express/),
[CoffeeScript](https://www.npmjs.com/package/coffeescript), or any other
superscript that transpiles to JavaScript. Node.js gives you the ability to use
JavaScript end-to-end—a prospect that’s tempting for both organizations and
developers. What’s more, Node.js projects can cut down on unnecessary
boilerplate and file generation. When PayPal moved to Node.js, it was able to
build its new app in
[33% fewer lines of code, and 40% fewer files.](https://medium.com/paypal-engineering/node-js-at-paypal-4e2d1d08ce4f#ab17:~:text=Written%20in%2033%25%20fewer%20lines%20of,Constructed%20with%2040%25%20fewer%20files)

## Easier to scale

Node.js has been successfully implemented in huge, high-traffic web applications
such as
[PayPal](https://softwarebrothers.co/blog/companies-that-use-node-js/#topbar-navigation:~:text=PAYPAL%20%2D%20BETTER%20PERFORMANCE%20THANKS%20TO%20NODE.JS),
[Trello](https://web.archive.org/web/20180711202703/https:/blog.fogcreek.com/the-trello-tech-stack),
[Uber](https://eng.uber.com/uber-tech-stack-part-two/#td_social_sharing_article_top:~:text=Uber%E2%80%99s%20core%20trip%20execution%20engine%20was,asynchronous%20primitives%20and%20simple%2C%20single%2Dthreaded%20processing)[,](https://eng.uber.com/uber-tech-stack-part-two/#td_social_sharing_article_top:~:text=Uber%E2%80%99s%20core%20trip%20execution%20engine%20was,asynchronous%20primitives%20and%20simple%2C%20single%2Dthreaded%20processing)
[](https://eng.uber.com/uber-tech-stack-part-two/#td_social_sharing_article_top:~:text=Uber%E2%80%99s%20core%20trip%20execution%20engine%20was,asynchronous%20primitives%20and%20simple%2C%20single%2Dthreaded%20processing)and
[LinkedIn](https://medium.com/building-with-x/building-with-node-js-at-linkedin-ae4ea6af12f2).
After LinkedIn switched its mobile web app from Ruby on Rails to Node.js, it
needed
[only one](https://medium.com/building-with-x/building-with-node-js-at-linkedin-ae4ea6af12f2#07d8:~:text=the%20reduction%20in%20the%20number%20of%20machines%20used%20to%20host%20our%20service%20was%20greater%20than%2010%3A1)[-](https://medium.com/building-with-x/building-with-node-js-at-linkedin-ae4ea6af12f2#07d8:~:text=the%20reduction%20in%20the%20number%20of%20machines%20used%20to%20host%20our%20service%20was%20greater%20than%2010%3A1)[tenth](https://medium.com/building-with-x/building-with-node-js-at-linkedin-ae4ea6af12f2#07d8:~:text=the%20reduction%20in%20the%20number%20of%20machines%20used%20to%20host%20our%20service%20was%20greater%20than%2010%3A1)
their previous number of hosting machines. Node.js is highly efficient at
dealing with many connections, and can scale both horizontally and vertically.
You can easily build a
[load balancing tool in Express](https://thecodebarbarian.com/building-your-own-load-balancer-with-express-js)
that can hold its own against nginx and HAProxy. Node.js can scale right down,
too—its tiny size and modular design make it well suited for
[microservices](https://nodesource.com/blog/microservices-in-nodejs).

## Large ecosystem

The Node.js community is well-established and
[growing](https://w3techs.com/technologies/details/ws-nodejs#bd:~:text=Historical%20trend,-This),
and is very popular among web developers. Third-party contributions through npm
are the lifeblood of the Node.js ecosystem, and you’ll find no shortage of
modules, discussions, and tutorials to help you.

Recent graduates with the right expertise are in luck: job demand for Node.js is
[growing steadily](https://www.hiringlab.org/2019/12/12/big-picture-tech-skill-trends/#twitter-widget-0:~:text=Node.js%20has%20grown%20steadily%20in%20popularity.).
In HackerRank’s
[talent comparison](https://blog.hackerrank.com/early-tech-talent-trends/#ig-67f6d126-ca3e-77cd-e6e7-887c9ad1e38c:~:text=So%20if%20your%20hiring%20manager%20is,those%20frameworks%2C%20set%20expectations%20early.%20Determine),
36.4% of graduate hiring managers surveyed were looking for Node.js proficiency,
whereas only 18.3% of the student developers participating in the study reported
knowing it. And being a JavaScript tool, there’s also large overlap between
being a JavaScript developer and being a Node.js developer.

---

# Drawbacks of using Node.js

For all its benefits, Node.js also has drawbacks. In the following section, we
explore why Node.js may not be the best choice for certain use cases.

## Single-threaded

Though it provides a very clever alternative to resource-hungry multi-threaded
servers, there are limitations to the single-threaded approach Node.js provides.
Websites requiring CPU-intensive server-side operations
[struggle to see performance benefits](https://www.toptal.com/back-end/server-side-io-performance-node-php-java-go#lies-damned-lies-and-benchmarks:~:text=All%20of%20a%20sudden%2C%20Node%20performance,each%20request%20are%20blocking%20each%20other.)
from Node.js’s architecture. Node.js is built to handle huge throughput,
provided each request requires little work. Requests requiring heavy computation
will clog up the single thread if they’re not offloaded to a background server.

## Asynchronous and event-driven

Node.js’s biggest attraction can also be a pet peeve for some developers.
Writing and understanding code that executes asynchronously is a challenge.
Node.js relies heavily on nested callback functions, which are arguably much
more
[difficult to follow](https://www.toptal.com/back-end/server-side-io-performance-node-php-java-go#non-blocking-io-as-a-first-class-citizen-node:~:text=%2C%20it%20can%20be%20quite%20tiresome,more%20levels%20deep%20inside%20Node%20code.)
than regular synchronous code. Developers might attempt a Node.js app and very
quickly find themselves in a confusing, unreadable
[callback hell](http://callbackhell.com/). Though the best practices for keeping
your asynchronous code readable—and avoiding callback hell—are well-documented,
there’s still a learning curve.

## Comparatively immature programming guidelines

Although it’s been around for over a decade, Node.js lacks standards, best
practices, and clear programming guidelines that are present in comparable
frameworks. A side effect of its flexibility, Node.js’s magic stems from its
unopinionated project structure and liberal use of third-party modules, all of
which must be chosen individually for each project. For instance,
functionalities like ORM and database operations aren’t included in Node.js, but
instead are available as add-ons such as [Mongoose](https://mongoosejs.com/) or
[Sequelize](https://sequelize.org/).

As a result, each Node.js project will have a unique programming style that will
depend wholly upon that project’s requirements. Compared to alternatives like
Django or .NET Core, where native support and project defaults are baked-in,
Node.js’s style makes its workflow less consistent and harder to follow.

---

# What is Node.js used for?

Owing to its flexibility as both a runtime environment and a full-fledged
back-end framework, Node.js can fit into many roles in a variety of project
contexts. While a deep dive into all its potential use cases would justify a
separate article (or perhaps a wiki), let’s briefly touch on some of Node.js’s
common applications.

## Full stack web applications

There’s a reason Node.js is a mainstay of the classic
[MEAN stack](http://meanjs.org/). Web applications are increasingly using
JavaScript these days for their front end, and Node.js gives them a lightweight,
reliable back end that's also in JavaScript. With a full stack that’s entirely
JavaScript, you can more easily reuse and share code and knowledge. And since
JavaScript is browser-native, you can also see Node.js used in many single-page
web apps that run entirely on JavaScript.

## RESTful APIs

Node.js is also commonly found in RESTful APIs, often alongside MongoDB and
Express. You can easily
[build a REST API with Node.js](https://levelup.gitconnected.com/building-a-restful-api-with-node-js-831bff629e3b)
to facilitate
[easy communication](https://medium.com/the-node-js-collection/why-the-hell-would-you-use-node-js-4b053b94ab8e#0bdd:~:text=API%20ON%20TOP%20OF%20AN%20OBJECT%20DB)
between the client and your database.

## Web servers

Node.js excels at making your initial server setup quick and easy. With its
built-in HTTP module, and the ever-popular [Express](https://expressjs.com/),
you can create a web server in as little as
[five minutes](https://dev.to/lennythedev/quick-server-with-node-and-express-in-5-minutes-17m7).

---

# FAQ

## What’s the difference between Node.js and Express?

[Express](https://expressjs.com/) is one of the many modules available through
Node.js. It’s minimal and unopinionated, providing basic routing, static file
serving, and middleware capabilities. Express is a hugely popular module because
it can cut down your initial server management code significantly, leaving you
with a more elegantly structured codebase. Node.js and Express also form part of
the MEAN stack of web development, and so are often mentioned in the same
breath.

## Is Node.js easier to learn than Django and Ruby on Rails?

[Django](https://www.djangoproject.com/) abstracts all but the highest-level
development and is highly scalable. It also includes a number of pre-built
modules that reduce the amount of code you have to write from scratch, so it’s a
solid choice if you’re already familiar with Python.

Compared with Python and JavaScript, used respectively in Django and Node,
[Ruby on Rails](https://rubyonrails.org/) incorporates a lot more magic: it
implicitly imports packages and functionalities, and performs lots of small
tricks for the sake of elegance. Though these abstractions can be quite
empowering and make Rails easy to learn, it does make it more difficult to
troubleshoot and debug, compared with Python and JavaScript, where everything is
defined explicitly.

But developers that already use JavaScript will still find it easier to learn
Node.js, as compared with Django or Rails. Unlike both, Node.js is
unopinionated, and doesn’t have as much emphasis on out-of-the-box
functionality. This provides great flexibility, efficiency, and room for
creativity, but the lack of direction provided can be daunting for beginners.
That being said, if you already know JavaScript, half the work of learning
Node.js is already complete.

## Is Node.js faster than Django and Ruby on Rails?

Both Django and Ruby on Rails sell themselves as out-of-the-box solutions that
aim to make development as quick and painless as possible. To this end, they
both come bundled with a lot of features as standard. But you might never use
some of them in your web project. As a result, Node.js is almost always going to
be lighter. Many of its most useful features are in external modules, which you
add to your project individually as needed. Django and Ruby on Rails will
probably give you a faster development timeline, but by using the Chrome V8
engine, Node.js will almost always give you superior performance and
flexibility. That being said, Node.js is somewhat limited by its single thread
in the tasks it can perform. Support for multithreading is present in both
[Django](https://docs.celeryproject.org/en/latest/django/first-steps-with-django.html)
and
[Ruby for Rails](https://guides.rubyonrails.org/threading_and_code_execution.html),
so CPU-intensive websites might see better performance there.

## Who created Node.js?

[Ryan Dahl](https://github.com/ry) created Node.js in 2009. The project is
currently hosted by the vendor-neutral non-profit
[OpenJS Foundation](https://openjsf.org/projects/#fws_5f676ff720825:~:text=Node.js%C2%AE%20is%20a%20JavaScript%20runtime%20built%20on%20Chrome%E2%80%99s%20V8%20JavaScript%20engine.),
which manages many other JavaScript ecosystem projects as well.

---

# Summary

Few back-end web development tools are as popular as Node.js today. The
JavaScript approach to web development is justifiably in favor, and Node.js
gives you a back-end solution that’s scalable from the tiniest microservice to
the likes of
[Twitter](https://siliconangle.com/2017/08/02/twitter-uses-node-js-to-slim-down-and-speed-up-its-mobile-web-app-nodesummit/)
and
[Netflix](https://tsh.io/blog/why-use-nodejs/#caption-attachment-12839:~:text=Netflix%20chose%20Node.js).
It lets you write elegant, creative JavaScript without compromising on speed and
adaptability. If you can acclimatize to its asynchronous, event-driven
programming style, Node.js and its extensive library of modules will fit
seamlessly into front-end JavaScript using less code and fewer files. And with
its big community and guaranteed backing, there’s never been a better time to
start with Node.js.
