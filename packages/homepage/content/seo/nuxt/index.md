---
banner: ./banner.png
slug: framework/nuxt
title: Nuxt js
description: Nuxt.js is a companion Node.js framework created on top of Vue.js.
---

Nowadays, deciding on a JavaScript framework for a project is like selecting
food from a wide and varied buffet rather than from a tried and true menu. The
number of options has become overwhelming, but choosing the right one for your
needs is more important than ever before. You can find frameworks that are fast,
feature-packed and well-documented, but very few offer those benefits on
anything less than a steep learning curve. But that’s the ambition of one such
alternative, [Nuxt.js](https://nuxtjs.org/).

---

# What is Nuxt.js?

Nuxt.js is a companion Node.js framework created on top of Vue.js. Using the
Vue.js ecosystem and its libraries like `vue`, `vue-router` and `vuex`, it
automates and simplifies the creation of statically generated or server-side
rendered (SSR) websites. Developing with Nuxt.js is efficient and accessible to
developers of all skill levels.

Alongside alternatives like React’s Next.js, Nuxt.js can seem quite similar.
Both are considered minimalistic frameworks, have automatic code-splitting
functionality and automate the building of server-side-rendered projects.

But despite their twin-like names, Nuxt.js is different from Next.js in some
[crucial areas](https://nodesource.com/blog/next-nuxt-nest/). It works
exclusively with Vue.js apps, so it's less opinionated on things like project
syntax. There’s no need to lock yourself into using JSX-based components, and
there’s far less manual configuration required. Routing and navigation are set
up automatically using your project directory. ES6 and ES7 compilation require
no extra work. And you get an auto-updating server, allowing for much quicker
development.

Perhaps most importantly, Nuxt.js offers unparalleled performance, accessibility
and SEO. In [benchmarks](https://nodesource.com/blog/next-nuxt-nest/) against
Next.js and Nest.js, Nuxt.js scores highest in those three areas: 98, 100 and
100 respectively, for a simple application.

---

# How does Nuxt.js work?

Nuxt.js aggregates libraries from the Vue.js ecosystem like `vue`, `vue-router`,
`vuex` and `vue-server-renderer` into a single package. Each library provides
essential functionality that Nuxt.js then abstracts for developers.

`vue` provides the core Vue.js functionality for the front end. It enables a
component-based, modular project structure for an application as well as
front-end interactivity.

`vue-router` configures routes and navigation based on Vue components,
automatically prepared based on a standardized project structure.

When using the ‘store’ option to create a project, Nuxt.js includes `vuex` to
handle global state management. Useful for more advanced applications, `vuex`
extends the existing state management abilities of Vue.js, allowing all parts of
an application to read and write state information to a central store.

When paired with Nuxt.js’s own server-rendering functionality, these core Vue.js
libraries allow Nuxt.js to automatically server render `vue` components inside
the pages directory. But note that for single page applications, Nuxt.js can
also statically generate (pre-render) assets for static hosting. And Nuxt.js
supports an extensive array of [modules](https://nuxtjs.org/guide/modules/) that
can be added to your project.

Taken together, these libraries make creating a blazing-fast, SEO-friendly
application from scratch as simple as installing Nuxt.js and running
`npx create-nuxt-app <project-name>`.

---

# Benefits of using Nuxt.js

## Server-side rendering with Vue.js

Instead of using the client’s machine, Nuxt.js renders Vue.js components on a
Node.js server. The client receives pre-rendered HTML instead of JavaScript that
must execute before a usable page appears. Since all the work happens on the
server, there’s no need to pass data back and forth between the client and the
server.

This is favorable for many reasons. Server-side rendering promotes data
security, as there are no client requests to make outside of fetching templates
to render. Private API keys and encryption details aren’t exposed to the
client’s machine; they are kept on the server. Additionally, JavaScript files
(which can be huge) don't have to finish loading on the client side for a web
page to render, expediting page load times. Search-engine optimization improves
as well. Loading pages on the server prevents search engine crawlers from having
to execute JavaScript on their end to render sites. Since they receive raw HTML
markup, crawlers can more easily index your website. Finally, refining
components and pages for SEO by adding metadata comes built in with the Nuxt.js
`vue-meta` library.

Nuxt.js makes all these benefits accessible by automating of most of the
workflow required to get an SSR project up and running.

## Static site generation

Should you choose to forego using a server for your project, Nuxt.js also allows
you to create statically generated websites by simply running `nuxt generate`.
Nuxt.js takes the project’s components and generates pre-rendered pages for them
at build time, saving the client’s machine from having to do any rendering at
run time.

This approach offers numerous benefits for sites or applications with static
content. There’s no need to wait on API calls or JavaScript files to execute for
pages to load. A significant portion of these actions are taken care of at build
time, so pages load extremely quickly. Static sites, made up as they are of
static files, don’t need a server to dynamically update data, which makes
deployment easy and cheap. And without a database or any server logic, there’s
nothing for hackers to exploit: just raw HTML that anyone can access.

## Automatic code splitting

When generating routes for Vue.js components, Nuxt.js creates separate build
files for each route and page, thus avoiding having to load every single
component in the project on each page load. Only components on the current page
are loaded, resulting in shorter load times.

Known as automatic code splitting, this process creates small chunks of code
from large codebases. With these smaller chunks, Nuxt.js allocates memory in
smaller units, ensuring those files get it that really need it. And Nuxt.js
handles this automatically for all projects.

## Small framework size

One reason for Nuxt.js’s spectacular performance is its minimalism. With its
modular ecosystem, Nuxt.js maintains a lightweight core framework for its main
functionality and makes extra features optional, so sites needn’t load
unnecessary, bloated JavaScript. Nuxt.js projects start, finish and load
lightweight thanks to its built-in code splitting. Your projects get heavier
only if you need them to.

---

# Drawbacks of using Nuxt.js

## Much smaller market share

Compared to Next.js, Nuxt.js is young, and both its share of the job market and
its community are small. Based on
[npm downloads](https://www.npmtrends.com/next-vs-nuxt) and
[stars on GitHub repositories](https://github.com/nuxt/nuxt.js/), Next.js is
close to three times more popular than Nuxt.js. As a result, Nuxt.js doesn’t
offer the benefits of as large a community as Next.js.

A smaller community means a smaller pool of developers in which you can ask
questions, solve problems and build new projects. Despite the simplicity and
great documentation that Nuxt.js offers, it may thus take longer to solve a
Nuxt.js problem than in Next.js.

In the industry, the state of affairs for Nuxt.js is similar. Largely due to the
immense popularity of React.js in the industry, companies are more likely to use
Next.js or other React-based companion frameworks than adopt a completely
different approach in the form of Vue.js or Nuxt.js. So, whether you’re an
employer or a potential employee, using Nuxt.js over Next.js might present
problems.

---

# What is Nuxt.js used for?

## Web applications with Vue.js

Developing universal web applications is one of Nuxt.js’s
[most common use cases](https://awesome-nuxt.js.org/resources/showcase.html).
You can build a web application with Nuxt.js in three ways: server-rendered,
single page application and statically generated.

For server-rendered apps, Nuxt.js inserts itself as middleware into your
existing server. Single-page applications generated with Nuxt.js can be run
either with a server or, if you prefer, without, in a kind of hybrid mode
somewhere between server-rendered and statically generated. In this serverless
hybrid mode, statically generated apps create their HTML and assets at build
time.

Employing any of the three modes for a project requires just a few commands.
There’s no complex configuration needed; Nuxt.js takes care of it all behind the
scenes.

While all of the foregoing is possible with the base framework, Nuxt.js also
supports additional modules to extend its functionality, allowing you to build
apps of any complexity in a wide variety of configurations.

## Static websites (JAM stack)

Statically generated websites built using Nuxt.js are faster, easier to build
and more SEO-optimized than competitors like Next.js. The possibilities are
many, and you can find [examples](https://www.awwwards.com/websites/nuxt-js/) of
JAM stack websites built with Nuxt.js all over the internet.

A single `nuxt generate` command starts Nuxt.js automatically creating HTML for
each of its defined routes at build time.

---

# FAQ

## How can I deploy a Nuxt.js app?

As we mentioned earlier, there are three main
[approaches](https://nuxtjs.org/guide/commands/) to deploying a Nuxt.js app:
server-rendered, single-page application and statically generated.

For a server-side-rendered or "universal” deployment, Nuxt.js projects must be
built first and then started, using the following two commands:

    nuxt build
    nuxt start

For single-page applications whose content is updated at run time (via real-time
API calls), projects must be built first, with content generated automatically
after the build. Depending on whether you want the app to run server-side,
either set Nuxt.js to SPA mode or just run `build`:

---

    # To run Nuxt.js in SPA mode
    nuxt build --spa

---

    # For SSR apps
    nuxt build

For a statically generated deployment, projects must generate static files so
they can be hosted without a server. Depending on the Nuxt.js version, this is
done via the following commands:

    # For Nuxt >= 2.13 - after adding target: static to nuxt.config
    nuxt build && nuxt export

    # For Nuxt <= 2.12
    nuxt generate

---

# Summary

If approachability and efficiency top your priority list when choosing a
framework, Nuxt.js is perfect for you. At its core, Nuxt.js aims to minimize the
learning curve and developer effort involved in building SSR or static websites.

From building routes to setting up an auto-updating server, Nuxt.js handles
trivial tasks so you don’t have to. Paired with Vue.js, it brings to your
projects a less opinionated syntax and a modular component structure. This is
accompanied by unparalleled performance, accessibility and search engine
optimization. However, it isn’t perfect; Nuxt.js’s comparative youth means that
its community and talent prospects are not as strong as competitors like
Next.js.

Nuxt.js makes development easy for developers of all skill levels. Its
versatility speaks for itself. In this age of specialized frameworks, it can be
whatever you want it to be.
