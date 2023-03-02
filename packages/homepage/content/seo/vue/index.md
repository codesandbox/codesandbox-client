---
banner: ./banner.png
slug: framework/vue
title: Vue js
description:
  Vue.js is an open-source front-end JavaScript framework with a reputation for
  making interactive web development projects fast, friendly and flexible to
  create.
---

In an industry where frameworks backed by large companies dominate, a framework
built by one person is stealing the show. Offering a welcome change from React
and Angular, Vue.js aims to make available the most desirable features from both
frameworks, and its trademark simplicity means it’s fast becoming the
[framework of](https://www.monterail.com/blog/reasons-why-vuejs-is-popular)
[choice](https://www.monterail.com/blog/reasons-why-vuejs-is-popular).

---

# What is Vue.js?

Vue.js is an open-source front-end JavaScript framework with a reputation for
making interactive web development projects fast, friendly and flexible to
create. Compared to alternatives like React and Angular, development in Vue.js
has a low barrier to entry as skill level goes, but it works for a wide variety
of use cases. In some ways it resembles React and Angular, though it differs in
some [crucial areas](https://vuejs.org/v2/guide/comparison.html). For example,
both React and Vue.js use a virtual DOM and a component-based architecture and
boast lightweight libraries for their core functionality. And Angular and Vue.js
have in common their use of directives and two-way data binding.

While preserving these core features, Vue.js offers complete freedom in how you
structure your projects. There’s no need to use JSX or lock yourself into a
particular app structure. Its flexibility allows you to use it for entire
projects or as a small component in an existing system. Perhaps most
importantly, thanks to its two-way data binding and selective re-rendering,
Vue.js offers great performance with minimal interference. In many cases, Vue.js
apps can be lighter and better optimized than their React and Angular
counterparts.

The name Vue.js itself originates in the Old French _vue_ (“view”), serving as
both a reference to how Vue.js structures its projects into different “views”
and how it places its focus on the view layer of an application.

---

# How does Vue.js work?

## Virtual DOM

Like React, Vue.js uses a virtual document object model (DOM) to provide a
developer-friendly interface for synchronizing an application’s state with its
real DOM. Reading and updating the actual DOM of an HTML web page is painfully
slow and resource-intensive. With this in mind, Vue.js relies on keeping a copy
of the real DOM in memory and operating on the in-memory copy. Whenever there’s
a change to the app’s data, Vue.js updates the state of components that rely on
that data. The application is then re-rendered into the virtual DOM and
reconciled with the real DOM in the fewest possible direct changes.

## Two-way data binding

Vue.js differs from React in how it keeps user inputs consistent with the
application’s data model. React requires the developer to handle program state
changes manually. In contrast, Vue.js relies on two-way data binding, which
makes the process much less complex. Two-way data binding synchronizes the view
and the model; whenever data in the model changes, the view updates
automatically — no need for `setState()` methods or hooks. Vue.js handles it all
via “watchers” attached to every component instance that automatically detect
when state changes occur. And unlike React, Vue.js doesn’t re-render the entire
view, but just the components relying on the data that changed.

## Components

Vue.js apps are organized into trees of nested reusable components, each of
which is a reusable Vue instance that keeps its view and logic independent of
other components. A component’s structure specifies the data it returns and how
it should be rendered on a page:

    // Define a new component called counter
    Vue.component('counter', {

      // The data property returns a data object for each unique component instance
      data: function () {
        return {
          count: 0
        }
      },

      // The template property specifies how the component is displayed (in HTML)
      template: '<button v-on:click="count++">Count: {{ count }}</button>'
    })

Using components makes Vue.js code reusable, modular and much easier to
maintain.

## Model-view-viewmodel framework

The core library of Vue.js serves as a bridge between the _v\*\*iew_ and the
_m\*\*odel_ of a web app via two-way data binding. Almost serving to replace the
controller in an MVC framework, Vue.js behaves as does a _v\*\*iew_ _m\*\*odel_
in MVVM design architecture.

In a full-stack web application, Vue.js’s core library isn’t responsible for
holding data. Instead, it listens for data changes as a middleman and
communicates them between the view and model. This direct communication between
the view and model works fine for single-page applications, but note that you
may need a more sophisticated controller and/or Vue.js plugins for multi-page
applications. In such a case, companion frameworks like Nuxt.js can extend
Vue.js’s influence to include the back end.

---

# Benefits of using Vue.js

## Selective re-rendering

Much of Vue.js’s performance benefits stem from its use of selective
re-rendering. Unlike React, Vue.js automatically watches each component for any
state changes. When it detects a change, it only updates components that rely on
that data rather than the entire sub-component tree, significantly increasing an
application's scalability. Selective re-rendering ensures performance doesn’t
degrade as the component tree and code base increase in size.

By default, React re-renders all sub-components of the newly updated component.
While React can mimic selective re-rendering (using `shouldComponentUpdate`
functions), Vue.js handles it out of the box.

## HTML templating syntax

Vue.js uses simple HTML templating syntax for building projects. When compiled,
these templates bind the DOM to the component instance’s data using virtual-DOM
rendering functions. Using directives and JavaScript wrapped in curly brackets,
Vue.js builds reactivity into a template like this:

    <!-- Renders an item component instance from a Vue.js script -->
    <div> {{ item }} </div>

    <!-- Renders an image with its source set to image_src via the v-bind directive -->
    <img v-bind:src="image_src">

    <!-- Changes styling of a button depending on the values of isPrimary and isLight -->
    <button v-bind:class="{ 'btn-primary' : isPrimary, 'btn-light': isLight}"></button>

There’s no need to learn JSX, which might represent a sizable adjustment for
newer developers or designers. And while JSX is more powerful, HTML templates
make a lot of that power accessible with no learning curve. Finally, if you do
end up needing JSX for a complex project, Vue.js supports it.

## Large ecosystem and rising popularity

Vue.js is still young, but in the time it’s been around it’s amassed a huge
ecosystem that caters to a wide variety of use cases. In addition to the core
library, it boasts companion libraries that handle everything from routing
([Vue Router](https://router.vuejs.org/)), state management
([Vuex](https://vuex.vuejs.org/)), server-side rendering
([v](https://ssr.vuejs.org/)[ue](https://ssr.vuejs.org/)[-s](https://ssr.vuejs.org/)[erver](https://ssr.vuejs.org/)[-r](https://ssr.vuejs.org/)[enderer](https://ssr.vuejs.org/)),
and even unit testing ([Vue Test Utils](https://vue-test-utils.vuejs.org/)). And
those are just the libraries built by the Vue.js team; there are plenty more
built by and for the community.

Due to Vue.js’s rising popularity, it also has a growing and active community
behind it. Its members are constantly discussing and solving problems and
building projects. Where the extensive documentation falls short, the community
makes up for it with numerous videos, blog posts and forum discussions.

---

# Drawbacks to using Vue.js

## Less mature tools for non-browser rendering

For rendering outside the browser, Vue.js partners with
[Weex](https://weex.apache.org/), allowing you to use the same simple templating
syntax inside the browser and out. However, Weex is still in early development
and therefore isn't as proven and reliable as alternatives for other frameworks
like React Native. As a result, you won’t find as much support from
documentation or the community when building a Weex app with Vue.js. In such
cases, React Native might be the better choice.

## Much smaller share of the job market

Compared to React and Angular, Vue.js is younger and lacks backing from large
companies like Facebook and Google. While it has
[caught up in popularity](https://www.codeinwp.com/blog/angular-vs-vue-vs-react/#popularity),
as measured by stars on its GitHub repository, its share of the job market
remains small. Currently, React and Angular are at least
[twice as prevalent](https://www.codeinwp.com/blog/angular-vs-vue-vs-react/#job-market)
as Vue.js in job listings.

So whether you’re looking to hire employees or looking for work, using Vue.js
might represent a potential hindrance versus using React or Angular.

---

# What is Vue.js used for?

## Web applications

Vue.js powers countless
[examples of web apps](https://madewithvuejs.com/webapps) for all kinds of use
cases. When used with just its core library, Vue.js is best for single-page web
apps. The rest of the Vue.js ecosystem makes it relatively easy to build
scalable, multi-page applications. Developers can start and scale
production-ready projects using Vue CLI. And, similar to Redux for React, Vuex
adds and manages global state management via central stores. For multiple pages,
Vue Router can configure routes and navigation in an application. These
extensions and many more in the ecosystem offer just about any functionality you
might need.

## Desktop and mobile applications

In conjunction with [Electron](https://www.electronjs.org/), Vue.js allows you
to build modern, native desktop and mobile applications. All you need to get
started is a simple API to connect the Vue.js and Electron layers. Plenty of
libraries like `electron-vue-api` and `electron-vue` exist to help simplify the
work and flatten the learning curve.

## Static site generation

Using Vue.js with the companion framework [Nuxt.js](https://nuxtjs.org/), you
can build a statically generated or “JAMStack” website that doesn't need a
server with its pre-rendered Vue.js pages. The end result is an SEO-optimized,
blazing-fast website that’s cheap and easy to deploy.

---

# FAQ

## Is Vue.js easier to learn than React?

If you're used to HTML syntax and separating JavaScript and CSS from templates,
you’ll find Vue.js much easier to learn than React’s all-inclusive JSX component
syntax. Vue.js also takes care of a lot of state-management optimizations by
default. React places the responsibility for these optimizations at the
developer’s feet.

All in all, Vue.js is less opinionated in how it wants you to work and requires
less developer intervention. It's also widely considered to have
[better documentation](https://www.altexsoft.com/blog/engineering/pros-and-cons-of-vue-js/#concise-documentation).

## Is Vue.js faster than React?

Both React and Vue.js adopt the virtual DOM approach for reconciling differences
between an application’s model and view. However, as we mentioned above, React
requires the developer to manage state-management optimizations. Vue.js, by
means of two-way data binding, manages it by default. Further, Vue.js can be
much
[lighter than React](https://www.codeinwp.com/blog/angular-vs-vue-vs-react/#size-and-load-times)
for typical applications. This improves start-up times and more efficient memory
allocation in your application.

In view of the foregoing, Vue.js can and should be quicker than React. But
despite their different approaches,
[real-world metrics](https://stefankrause.net/js-frameworks-benchmark8/table.html)
show that the two have similar levels of performance.

For larger, more complex applications, React's manual state handling might be
preferable. But projects of all sizes can benefit from Vue.js’s out-of-the-box
optimizations.

## Who created Vue.js?

Vue.js was created by Evan You, a former AngularJS developer working at Google.
The framework was born of his frustration with the heavy, structured approach of
Angular. In creating it, Evan sought to take the best parts of both Angular and
React and combine them into one easy-to-use, lightweight framework.

## Is Vue.js suitable for single-page web apps?

Definitely. Vue.js’s component-based architecture and state-management
capabilities make it perfect for building modular, scalable single-page web
applications. Adaptability is also one of Vue.js’s strong points. It can
integrate into an existing project, but it also offers all the functionality
required to start from scratch. Check out this
[guide](https://dev.to/ratracegrad/how-to-build-a-single-page-application-using-vue-js-vuex-vuetify-and-firebase-part-1-of-4-3a63)
on how to build a single-page application using the Vue.js ecosystem and
Firebase.

---

# Summary

Vue.js has clearly earned its rising popularity in the developer community.
Combining the sought-after benefits of React and Angular in an easy-to-use
package brings developers in, and Vue.js’s two-way data binding, HTML templating
syntax and selective re-rendering makes them stick around.

Starting with its initial release, Vue.js was made to build a wide variety of
project types, from web apps to native desktop and mobile variants and even
statically generated sites.

However, it’s not the perfect framework just yet. Given its youth, Vue.js’s
share of the job market is still tiny compared to that of React and Angular, so
using it may not represent a stepping stone to career progression. And its
simplicity may be too limiting for larger, more complex projects that require
the structure and customizability of frameworks like React and Angular.

Whether Vue.js is appropriate for your next project boils down to a single
question: Do you value simplicity or complexity?
