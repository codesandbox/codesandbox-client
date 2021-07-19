---
banner: ./banner.png
slug: framework/svelte
title: Svelte js
description:
  Formerly just a compiler, Svelte is now a full-fledged framework for building
  front-end applications.
---

An ideal JavaScript front-end framework is easy to use but full of
functionality, universal in scope but lightweight and, most importantly, blazing
fast. Yet as frameworks like React, Angular, and Vue get more popular their
codebases inevitably grow, creating unnecessary complexity for you as a
developer and slowing down your web applications.

But there’s one framework, Svelte, that’s unlike the others. It doesn’t fit the
mold of any other framework, because it turns the idea of the typical framework
upside down. Rather than using a virtual DOM approach (explained below), Svelte
pre-calculates all changes to be made on a webpage ahead of time by using a
compiler. In this article we will cover what exactly makes Svelte special, the
use cases where it shines, and the benefits for those considering using it.

---

# What is Svelte?

Formerly just a compiler, Svelte is now a full-fledged framework for building
front-end applications. Its HTML-based compiler transforms your code into
vanilla JavaScript code to be interpreted directly by the browser, with no
dependencies and no frameworks to import at run time. The result is
significantly faster, lightweight and more readable code with almost none of the
drawbacks that come with other frameworks.

The magic of Svelte lies in compiling components at build time, eliminating the
need for the browser to do extra work converting them into DOM operations at run
time. Since a substantial amount of the browser’s work has already been taken
care of by Svelte at build time, considerable resources are freed up at run
time, allowing you to allocate them where they’ll be needed most.

In contrast to declarative approaches that use a virtual DOM, Svelte uses an
imperative approach that describes how changes will be made to the DOM at build
time, instead of computing those changes at run time. This imperative approach
allows for components to be isolated and individually updated as needed rather
than comparing (“diffing”) the entire virtual DOM against the actual DOM for
every change.

Paired with Sapper, a companion web application framework built on top of
Svelte, entire web applications can be built
[with minimal drawbacks](https://svelte.dev/blog/sapper-towards-the-ideal-web-app-framework).

---

# Benefits of using Svelte

## Speed

Svelte is significantly faster at rendering webpages compared to frameworks like
React primarily because it doesn’t use a virtual DOM. But before we explain why
this matters, here is a quick summary of the virtual DOM concept.

**A quick primer on the virtual DOM** The domain object model (DOM) is a
structured representation of an HTML webpage. Reading and writing the DOM is
slow and resource intensive; a challenge for modern web frameworks.

While frameworks need to render, maintain and operate on increasingly complex
webpages as quickly as possible, they also need to expose a developer-friendly
interface to allow for components to be updated in response to changes in
states. Multiple components might update their state multiple times a second;
applying all changes across all components directly to the DOM would be
extremely slow.

In response to this challenge, React adopted the
[](https://reactjs.org/docs/faq-internals.html)[virtual DO](https://reactjs.org/docs/faq-internals.html)[M approach](https://reactjs.org/docs/faq-internals.html),
early on. It works by keeping a copy of the real DOM in memory and operating on
that in-memory copy. When React updates the state of its components, it
re-renders the whole application into the virtual DOM, then reconciles the real
DOM with the virtual one in the fewest possible direct changes to the DOM.

**No virtual DOM with Svelte** Herein lies the secret to Svelte’s speed.
Svelte’s community proposes that
[t](https://svelte.dev/blog/virtual-dom-is-pure-overhead)[he virtual DOM is](https://svelte.dev/blog/virtual-dom-is-pure-overhead)
[pure overhead](https://svelte.dev/blog/virtual-dom-is-pure-overhead), busting
the myth that the virtual DOM is fast. Unlike React, which re-renders the entire
application and then changes the DOM, Svelte updates only the components of the
code that have actually changed, using compiled, imperative code. Minuscule
state changes need not result in gargantuan re-renders of the entire application
that waste time and resources.

Because Svelte components are converted into vanilla JavaScript at build time,
the user’s browser is spared this effort at run time. A significant portion of
the app’s computation is diverted away from the user, making for a blazing-fast
app.

## Small application size

Applications developed with Svelte use compiled vanilla JavaScript that can be
read natively by any web browser, relieving you of the need to ship heavyweight
libraries with your code. All you need is the compiled JavaScript bundle itself
built before deployment, making for a lightweight application with none of the
frameworks and libraries that make for overhead in production.

## Reactivity built into the language

In most web applications today, changes in code states are communicated to the
browser via an API that every framework and library must use. This results in a
ton of garbage code, both in the sense of code readability and also of actual
garbage collection.

Svelte asserts that the best API is no API at all, instead rethinking reactivity
by integrating it into the language of JavaScript itself. Changing a state in
the code should automatically be communicated without the need for hooks or
`setState()` methods, as in React. Svelte employs no proxies, accessors or
needless code, just automatic communication built into the language itself.

## Benefits when used alongside Sapper

On its own, Svelte is a formidable tool for building reactive front-end
applications. But with Sapper, the approach Svelte applies to the front-end
becomes possible for your entire application stack. Compared to its closest
rival, Next.js, Sapper is lighter and faster while providing all the same
features.

**Offline support** Offline support comes standard with Sapper-created apps in
the form of a default `ServiceWorker` in `src/service-worker.js`. Combined with
a cache that is rebuilt every time your app is updated, losing connectivity in a
Sapper application doesn’t affect its operation at all. When it finds itself
offline, Svelte automatically uses its service worker to fetch assets and data
from the cache until connectivity is restored, all with no effort required on
the developer’s side.

**Server\*\***-side\*\* **rendering** Sapper permits offloading the initial
render of a web page to the server rather than in the user’s browser. Sapper
also uses the
[server-side-first approach](https://sapper.svelte.dev/docs/#Server-side_rendering):
it renders all the code on the server and then has Svelte track and update only
the dynamic elements on the front-end.

Using this approach, load times are much faster since the browser’s workload is
drastically smaller, thanks to the pre-compiled Svelte bundle and to the initial
web-page rendering happening on the server. Combined with Sapper’s built-in
code-splitting functionality, pages get rendered in the most efficient manner. A
website made with Svelte and Sapper can even rank higher in search engines:
search-engine crawlers can retrieve the website’s contents and structure without
having to execute JavaScript, and the total page-load time is lower.

## You can make an impact on Svelte’s development

Should you be interested in contributing to an open-source project, the fact
that Svelte and Sapper haven’t yet entered the mainstream means you can make an
impact on the framework. You can improve Svelte for everyone by adding
constructive feedback to issues and pull requests as well as by writing code to
fix bugs and implement new functionality. If that sounds interesting, check out
the open issues on the [Svelte](https://github.com/sveltejs/svelte/issues) and
[Sapper](https://github.com/sveltejs/sapper/issues) repositories.

In summary, Svelte offers a number of benefits: speed, smaller application size
and built-in reactivity.

Now keep reading to learn a little about why, despite the foregoing, Svelte
might not be the perfect choice for your project.

---

# Drawbacks of using Svelte

## Relatively small community

Svelte’s recent emergence as a framework means that the community surrounding it
is not terribly large nor representative of the software community as a whole.
These limitations impact Svelte’s development, not to mention the employability
of Svelte developers.

Svelte’s development suffers because of its unconventional approach compared to
most frameworks. This double-edged sword forces developers to undergo a
significant paradigm shift especially if they’re used to more well-established
frameworks like React. To become productive with Svelte, you would inevitably
need to unlearn some established front-end practices (like hooks or `setState()`
methods). However, this could change if industry consensus shifts away from the
use of heavyweight virtual-DOM-based frameworks.

Needless to say, finding or hiring Svelte developers is much harder than for
most established frameworks, which is not to say that many engineers have tried
Svelte at all, at work or in their free time. Fewer developers means fewer apps
you can refer to as examples, fewer pre-built libraries and a higher barrier to
entry. Until Svelte reaches a critical mass of users, working with Svelte
full-time will remain uncommon.

## No standard approach to testing

Stemming from its unconventional approach to web development, testing Svelte
applications hasn’t yet been standardized. Unlike React’s well-documented
[approach to testing](https://reactjs.org/docs/testing.html), Svelte’s only
official testing methodology is the
[svelte-testing-library](https://github.com/testing-library/svelte-testing-library)
package, which constitutes more of an encouraging guideline than a concrete
testing technique.

In addition, Svelte’s compiled nature means the debugging of the state of a
component can be more difficult compared to an interpreted alternative. Svelte
lacks the developer tools to make the testing and debugging process smoother.

## Sapper’s unstable plugin architecture

Because the community has been focusing on getting Svelte 3 production-ready,
the Sapper repository isn’t as well maintained. Developing plugins for Sapper is
currently challenging due to the lack of adequate documentation; plugin
developers have to do a lot of guesswork about what code is extensible and even
what code they can depend on. Thus Sapper lacks a robust and clear environment
in which third-party developers can easily add value in the form of plugins.

In short, most of Svelte’s drawbacks come from the fact that it’s not yet a
mainstream framework. As it matures, the community will likely find solutions to
the current problems, but in the meantime writing Svelte and Sapper applications
can be more time-consuming.

---

# What is Svelte used for?

Svelte can be used for any application with a front-end component; the two most
common use cases are web applications and static websites.

## Web applications

**An alternative to:**

- [React](https://reactjs.org) + [Next.js](https://nextjs.org)
- [Vue](https://vuejs.org) + [Nuxt.js](https://nuxtjs.org)
- [Angular](https://angular.io) + [Express.js](http://expressjs.com)

Web applications are the core of many a framework, and Svelte is no exception.
With Sapper, developing web applications (even progressive webapps) is simple:
install Svelte and Sapper, write your components on top of HTML, set up routing
and you’re good to go!

Svelte compiles components at build time to run on the client side, while Sapper
handles server-side tasks like initial web page rendering, routing, splitting
code bundles and providing offline support, all in service of minimizing code
weight and maximizing speed—and it’s just as easy to learn as competing
frameworks, if not easier. You can learn the whole process in
[under an hour!](https://svelte.dev/blog/sapper-towards-the-ideal-web-app-framework)

## Static websites

**An alternative to:**

- [Gatsby](https://www.gatsbyjs.org)
- [Jekyll](https://jekyllrb.com)
- [Hugo](https://gohugo.io)

You can also use Svelte to generate
[](https://dev.to/vannsl/statically-generated-website-with-svelte-and-sapper-5bi7)[static websites](https://www.swyx.io/writing/svelte-static/).
Sapper, the web framework written in Svelte, provides a way to statically
[export a website](https://sapper.svelte.dev/docs/#Exporting) by running
`sapper export` in your Sapper project. Afterwards, you can upload the resulting
static files to a storage backend like Amazon S3. The client-side Svelte
components will continue to work the same way even if you export the site, and
you can continue to enjoy the client-side features of Svelte like prefetching
and routing.

---

# Frequently Asked Questions

## Is Svelte better than React?

The answer to this question depends on who’s asking it: an established engineer
working on an existing project, for example, or a new developer who wants
dependable work in the software industry.

React is much more popular than Svelte and thus much likelier to be in demand
for the foreseeable future. For now and perhaps well into the future,
prospective engineers will have much more luck finding a React job than a Svelte
job. In addition, due to React’s popularity, it boasts a vast ecosystem and
community. Unlike Svelte, React has plenty of example apps, tutorials,
documentation and plugins available right now.

But leaving aside popularity and market penetration, Svelte does shine in almost
every other area. Svelte makes it easier to get started, thanks to it being
built directly on top of HTML. It’s faster and more lightweight in its compiled
nature and with its lack of a virtual DOM. And it produces less code that ends
up being more readable.

So if you feel like your project will benefit from a simpler, faster, and more
lightweight framework overall, Svelte is the better choice. But if you prefer
using something more established with better employment prospects, or if you’re
looking to hire good developers for your project, choosing React will, for now,
likely provide more benefit to your career.

## Is Svelte ready for production?

It depends. Companies like 1Password, iChess.com, IOTA, The New York Times, and
many others
[already use Svelte](https://github.com/sveltejs/community/blob/master/whos-using-svelte/WhosUsingSvelte.svelte)
in production, but it’s up to you, your team, and your organization to decide
whether you’re ready to use Svelte for production applications. Consider setting
up a low-risk proof of concept, such as a small new project or a single page on
a large website that you create or rewrite in Svelte. Here is an example of the
criteria you can use to decide whether Svelte is a good fit for you:

- Speed. Are Svelte pages faster than your current ones?
- Developer friendliness. Is it easier to work with Svelte compared to your
  existing framework?
- Compatibility. Can you do everything you need in your application when using
  Svelte? Are there any limitations of Svelte’s approach that can cause issues
  for your project in the medium or long term?

When you set up a proof of concept, we recommend discussing the criteria with
your team ahead of time so that you understand what a successful implementation
would look and feel like.

## What is code splitting?

Web apps depend on large amounts of code, not all of which is needed all the
time. Code splitting (standard in Sapper) ensures that, based on the user’s
session, only the components and packages needed by the app’s current instance
are loaded and ready to go.

In so doing, Svelte minimizes the network traffic and CPU cycles needed to run
your website. The end result is an application that is lighter and runs much
faster regardless of the device and network speed.

## Does Svelte work with GraphQL?

Yes. Check out the [svelte-apollo](https://github.com/timhall/svelte-apollo)
project for an example of how to use Svelte with Apollo GraphQL.

## Does Svelte work with TypeScript?

Not yet. Follow the
[TypeScript roadmap issue](https://github.com/sveltejs/svelte/issues/4518) on
the Svelte repository for updates. There is
[a workaround](https://codechips.me/how-to-use-typescript-with-svelte/) that you
can use in the meanwhile if you absolutely need TypeScript support today.

## Can I use Svelte with headless WordPress?

Yes. Using a headless WordPress installation is a popular way to get the
benefits and the flexibility of a static website while using a familiar and
feature-complete content management system. Consider building a static website
with Svelte and Sapper and then using a WordPress instance as a backend for
individual articles. WordPress provides a
[REST API](https://developer.wordpress.org/rest-api/reference/) by default, and
you can use plugins to add a GraphQL API layer to it if you so desire.

## What does the word _svelte_ mean?

[_Svelte_](https://www.merriam-webster.com/dictionary/svelte) is a word that
denotes someone slender or something that has clean lines.

---

# Summary

It’s Svelte’s radical compiler-based approach to frameworks that makes it so
attractive to the industry today. Converting components to vanilla code at build
time and forgoing use of the virtual DOM (against industry trends) makes
applications fast and lightweight, code more readable and reactivity an integral
part of the language itself.

It is reasonable to be concerned about the fact that Svelte still lacks a strong
community, standardized testing and pre-built packages. As Svelte matures as a
framework, these drawbacks will likely go away. In the meanwhile, though, a
Svelte project might take longer than a similar project that uses a more
mainstream framework, assuming you and your team don’t yet have much Svelte
experience.

Our recommendation is to give Svelte a try and see for yourself if the
framework’s benefits outweigh its drawbacks. In the worst case, you’ll learn
about a different approach to front-end web development, and in the best case
you might end up discovering your new favorite framework.

Learn more about Svelte by taking the
[official Svelte tutorial](https://svelte.dev/tutorial/basics). For details on
using the framework, refer to
[Svelte](https://svelte.dev/docs)’[s own](https://svelte.dev/docs)
[documentation](https://svelte.dev/docs).
