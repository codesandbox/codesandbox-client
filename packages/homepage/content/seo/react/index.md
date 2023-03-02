---
banner: ./banner.png
slug: framework/react
title: React js
description:
  React is an open-source JavaScript library used in front-end development to
  create apps that consist of components
---

If you’re a JavaScript developer, you’ve surely heard of React; perhaps you’ve
even worked with it. The React repository is among
[the most popular projects](https://github.com/search?q=stars%3A%3E100&s=stars&type=Repositories)
of all time on GitHub, and you can find the framework in the `head` sections of
millions of webpages — from personal blogs to e-commerce stores to the world’s
largest websites like Facebook and Airbnb.

React’s component-based architecture is exactly what many developers need to
build great web applications at scale. Some choose React because it’s easy to
combine with almost any other tooling: React doesn’t force you to use the
functionality you don’t need. Thanks to its vast community and many
contributors, React is comprehensively documented, and you can find thousands of
example apps written in the framework all over the internet.

But even though React is a top choice for many organizations, does that mean
it’s the right framework for your next project? In this article, we’ll dive
deeper into React to help you decide. We’ll cover what React is, how it
originated, how it can be used and some of its advantages and disadvantages.

## What is React?

[React](https://reactjs.org) is an open-source JavaScript library used in
front-end development to create apps that consist of components, reusable pieces
of code for different parts for your app. Each component is independent and has
its own state; for example, a contact form and a button are usually distinct
components in React. You can reuse the same component many times in your web
page. React logic efficiently updates only the necessary components when your
data changes. It pairs nicely with
[Node](https://nodejs.org/en/)[.js](https://nodejs.org/en/) on the back end to
create full-stack apps, but, as we’ll see, React works with a wide variety of
backend languages.

## React: a brief history

React was first released as an open source project in 2013 by Facebook. The
framework became popular for applications that, like Facebook, need to
constantly update their pages to reflect changing data. Facebook named the
framework React because, as users trigger events that change data, the view
“reacts” to those changes by updating components to display a current state. To
better understand the origins of React, let’s examine the architectural design
pattern at its foundation.

Many of the frameworks created before React follow the
[MVC (Model-View-Controller)](https://developer.mozilla.org/en-US/docs/Glossary/MVC)
[pattern](https://developer.mozilla.org/en-US/docs/Glossary/MVC). However, React
is based on a different pattern, developed by Facebook, called
[Flux](https://facebook.github.io/flux/). Both application architectures sport a
three-layer development architecture, but they vary dramatically in how they
operate.

In an MVC design pattern, the **model** maintains the data and behavior of the
app, the **view** displays the model in the UI, and the **controller** serves as
an interface between the model and the view. A user event signals the controller
to activate the model and view, generating a response to send back to the user.

How does this relate to React? After a time working with the complexities of the
MVC pattern, the Facebook development team decided to make some important
changes in the system. These changes produced the Flux application architectural
design, which they released as an alternative to MVC architecture. The Flux
model consists of a dispatcher, one or more stores, and views, which are
themselves React components. Let’s look at the Flux infrastructure in depth to
gain some insight into the logic behind React.

## How React works

How do Flux’s three layers work together? When a user clicks on an element in
one of the components, or views, that user event activates the dispatcher. The
dispatcher gets its name from its role of dispatching methods to update the
state in each given store.

The dispatcher helper methods, called **action** **creators**, support a
semantic API that describes all possible changes in the application. You can
think of actions as a fourth layer of the Flux model — they serve as
intermediaries between the dispatcher and the view. As soon as the store’s state
is updated, the view displays new data.

Flux supports a unidirectional data flow by design, complementing React's
structural cycle which moves from components to dispatcher to store and back to
components. If you’d like to understand the nuances behind the Flux model as
well as the integration between Flux and React, we recommend checking out
[Facebook’s in-depth overview](https://facebook.github.io/flux/docs/in-depth-overview/).

**React for mobile** Let’s quickly touch on React’s mobile counterpart,
[React Native](http://reactnative.dev). While React itself was designed for
desktop web browsers, React Native allows developers to apply the same web
framework on mobile. The framework achieves this by letting you write HTML, CSS
and JavaScript, then rendering them into the native UI components for your
mobile operating system. Because most of the code you write for it can work
across platforms, React Native allows you to simultaneously develop for both
Android and iOS.

Now let’s explore the advantages and disadvantages of using React.

## Benefits of using React

Perhaps the most significant benefits of using React that distinguish it from
other front-end frameworks are its performance, its reusable components, the
huge ecosystem surrounding it, the ease of rendering React on a server, and the
flexible way it integrates with other libraries and frameworks. Let’s explore
these advantages in more depth.

**Speed** React’s speed on the web is largely due to how the framework interacts
with the
[vi](https://reactjs.org/docs/faq-internals.html)[rtual DOM](https://reactjs.org/docs/faq-internals.html).
The virtual DOM is a representation of the actual
[DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
kept in memory, which React syncs with the “real” UI using its `react-dom`
library. React uses the virtual DOM, rather than the actual DOM, to see when the
application has changed; it then re-renders nodes in the actual browser DOM only
when needed. React uses a
[reconciliation algorithm](https://reactjs.org/docs/reconciliation.html) to
minimize the number of DOM updates it makes. Less updating means a faster
webpage.

While React pages can be very fast, it does not mean simply using React will
necessarily speed up your web app. To realize the framework’s potential for
speed, you still need to pay attention to how the information flows within
components and how React updates the DOM.

**Reusable components** Each component in a React app has its own logic and
controls its own rendering. These components can be reused wherever you need
them; if you need to add ten buttons to your web application, for example, you
can write just one component and use it with different options to create all the
buttons you need.

Reusing components makes your apps easier to develop, maintain and scale. If you
change the button component, all buttons are updated, since they are just
instances of this component. Reusing components cuts down on errors and saves
development time, all while helping you achieve a consistent style and feel
across the entire web application.

**Community and libraries** The ecosystem around React is supportive and full of
resources. It’s easy to find training content, React examples and articles
written by seasoned developers, and someone to answer your niche Stack Overflow
question. Moreover, there’s an abundance of ready-made component libraries and
developer tools that work with the React environment.

**Option** **f\*\***o\***\*r** **server-side rendering** Server-side rendering
(SSR) is a widely used practice in which you render an app on the server that
would normally be a single-page app on the client side, then send that fully
loaded app to the client on their first request. Using SSR with React
accelerates app loading: users need not wait for JavaScript to load before
viewing a website. As soon as a page is sent, the client’s JavaScript bundle can
take over, and the app can operate as normal. However, if your application is on
the heavier side, using SSR can actually increase response time and size. Here’s
a
[detailed overview](https://www.digitalocean.com/community/tutorials/react-server-side-rendering)
of the React-SSR process.

**React c\*\***an be combined with other frameworks\*\* React’s flexibility
extends all the way to its interoperability with other libraries frameworks.
With a proper and careful setup, you can embed React into application written
mostly using other libraries or integrate other libraries into applications
written chiefly in React. Moreover, React supports incremental migration, so
developers who wish to gradually implement the library can easily start with
just one small component. Check out
[this article on](https://reactjs.org/docs/integrating-with-other-libraries.html)
[](https://reactjs.org/docs/integrating-with-other-libraries.html)[i](https://reactjs.org/docs/integrating-with-other-libraries.html)[ntegration](https://reactjs.org/docs/integrating-with-other-libraries.html)
with libraries that outlines some best practices for using React with other
popular frameworks.

Now, before you get too excited about the benefits of React, let’s cover some
potentially negative aspects of using it in your projects.

## Drawbacks of using React

As revolutionary as React has been, it still has its downsides. We’ll briefly
touch on two of the most significant ones: how quickly new versions come out,
and the complex, vast set of tools available to React developers.

**Fast** **development** **pace** From React’s constant updates to the many
companion libraries constantly being created to support it, React technologies
are accelerating so fast that keeping up to date may prove difficult. Although
its documentation is diligently updated, React’s fast-paced development means
it’s easy to be left behind on an older version.

This might not sound like an issue, but constantly updating the library,
especially with breaking changes between versions, can cost your development
team a significant amount of time. This is especially relevant if you use React
with other libraries and frameworks.

**Complex development tools** React boasts a comprehensive set of design and
debugging tools, but navigating them or even knowing which ones to use can be
difficult. We recommend starting with a browser extension called
[React Developer Tools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html)
that allows you to inspect React components and maintain their hierarchies in
the virtual DOM. But beyond that, discovering which tools best suit your
application and coding style, and then learning them, can be a wearying process.

Now that you are familiar with the benefits and the drawbacks of using React,
let’s have a look at some use cases that fit the framework well.

## What is React used for?

As you’ve likely gathered by now, React is used to build interactive user
interfaces. The library sees most of its use for UIs on web applications, with
its cousin React Native supporting mobile apps. React often shows up on static
websites and has a solid spot in what’s known as the
[JAMStack](https://jamstack.org/) (short for “JavaScript, APIs and markup”), a
set of tools and concepts for creating static sites that don’t need a web server
to work. Here are a few examples of projects where React may be a good fit.

**Web UIs** Web user interfaces are React’s bread and butter. Use it on the
front end in web applications of any size, from your parents’ food blog to the
next Airbnb. React shines in complex UIs with lots of reusable components, but
its speed benefits apply to all kinds of websites.

**Mobile applications** With React Native you can create apps for Android and
iOS simply by writing regular React code. Typically, when using React Native the
two mobile platforms can share most of the code base, and you can add native
extensions for each platform.

**Static websites** The abundance of API libraries and tooling for React makes
it a great fit for more complex static websites where some content is fetched
through an API.

So while we can easily regard React as just another front-end framework, it’s
React’s features and variety of use cases that differentiate it from other
frameworks that achieve the same goal.

## Frequently asked questions

Many questions come up when using a framework as intricate and vast as React.
We’ll go over a few of them below. For more detailed questions about React, we
suggest checking out the FAQ section of
[React’s glossary](https://reactjs.org/docs/glossary.html).

**Can I use React with a PHP backend?** Absolutely! Although a Node/Express
server is the most common backend for React applications, PHP and other back-end
technologies can certainly substitute. Here’s a
[Bitsrc tutorial on building a](https://blog.bitsrc.io/how-to-build-a-contact-form-with-react-js-and-php-d5977c17fec0)
[contact form](https://blog.bitsrc.io/how-to-build-a-contact-form-with-react-js-and-php-d5977c17fec0)
with React and PHP, and here’s a more general
[guide](https://davisonpro.dev/an-advanced-guide-on-how-to-setup-a-react-and-php/)
[from Davison Pro](https://davisonpro.dev/an-advanced-guide-on-how-to-setup-a-react-and-php/)
[on using both languages](https://davisonpro.dev/an-advanced-guide-on-how-to-setup-a-react-and-php/)
in a project. And here are some Github examples with React and
[Go](https://github.com/codeskyblue/go-reactjs-example),
[Rust](https://github.com/StefanoOrdine/rust-reactjs), and
[Ruby](https://www.airpair.com/reactjs/posts/reactjs-a-guide-for-rails-developers).

**Does Google use React?** Google develops two competing technologies:
[Polymer](https://www.polymer-project.org) and, more notably,
[Angular](https://angular.io). While it’s possible that cross-functional teams
at Google use React, the company has its own massive Angular infrastructure
which is responsible for most of their front-end functionality. However, some
big-name companies that do use React include Instagram, Netflix, Whatsapp,
Dropbox, Airbnb, Microsoft and Slack.

**What is the difference between React and React Native?** React Native does not
use HTML or CSS, instead providing components that act like typical HTML
elements as well as an animation API. (On the web world, such an API is
unnecessary thanks to CSS animations.) Another difference is that when you start
a new project with React, you will likely choose a bundler like
[Webpack](https://webpack.js.org/) or [Babel](https://babeljs.io/) and then
determine which modules you need to bundle for your project. In contrast, React
Native comes with everything you need; you very likely won’t require further
dependencies. Some additional differences are explained
[in this Medium post](https://medium.com/@alexmngn/from-reactjs-to-react-native-what-are-the-main-differences-between-both-d6e8e88ebf24).

---

# Summary

In this article, we discussed React’s
[origins](https://facebook.github.io/flux/docs/in-depth-overview/) and history,
and how it now includes [development for mobile apps](https://reactnative.dev/).
We also looked at its major benefits and challenges, highlighting its
performance, robust community and flexibility, which come at the cost of needing
other libraries to build a full-stack app and keeping up with a fast development
pace.

To learn more about React, we recommend checking out our
[React code samples](https://codesandbox.io/examples/package/react)
and [React’s own documentation](https://reactjs.org/docs/getting-started.html).
