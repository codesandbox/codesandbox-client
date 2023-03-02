---
banner: ./banner.png
slug: framework/preact
title: Preact js
description:
  Preact is a JavaScript view library that uses a virtual DOM approach to render
  web components
---

If you’re looking to build a modern, polished single-page web app, Facebook’s
[React](https://reactjs.org/) is a no-brainer. Its virtual DOM philosophy, solid
performance, and huge community have served it well. React is the
[most popular front-end JavaScript framework](https://www.npmtrends.com/angular-vs-react-vs-vue)
these days. But there’s another player in the game. It’s called
[Preact](https://preactjs.com/), and it offers nearly all of React’s
functionality at a fraction of the package size.

Like React, Preact is a JavaScript view library that uses a virtual DOM approach
to render web components. But Preact has 2 key advantages over Facebook’s golden
child: it’s [faster](https://developit.github.io/preact-perf/) and much smaller
([3kB](https://preactjs.com/) compared to
[React 16’s 35kB](https://reactjs.org/blog/2017/09/26/react-v16.0.html)).
Preact’s development team also maintains
`[preact-compat](https://preactjs.com/guide/v10/switching-to-preact)`. This
package adds near-100% compatibility with React components, making the switch
from React easier than ever. With monthly updates and nearly
[27,000 GitHub stars](https://github.com/preactjs/preact), Preact’s elegant
execution of a very popular feature set means it’s here to stay.

Preact’s tiny size makes it ideal for small projects or environments with slow
internet connections. In this article, we cover how Preact works and go over its
benefits and drawbacks, while linking to resources where you can learn more
about developing with Preact.

---

# How does Preact work?

Preact aims to replicate React’s value proposition in as little code as
possible. With this in mind, it doesn’t attempt to provide React’s entire
feature set. Preact’s pure form sets out to be
[“largely compatible”](https://preactjs.com/about/project-goals/) with the React
API. By comparison, its `preact-compat` form seeks as much compatibility with
React as possible. This option makes it very easy for React developers to try
their projects out in Preact.

As the story goes, the Preact development team often struggled with unreliable
mobile connections while working. In response, they endeavored to prune Preact’s
package size to reduce network strain caused by loading packages. They further
cut size by doing away with React-dom’s
[synthetic event system](https://reactjs.org/docs/handling-events.html). Preact
would instead use native browser methods such as `addEventListener()`.

But for a 3kB file size (5kB with `preact-compat`), Preact gives you an
impressive amount of functionality. There is support for JSX, ES6 2015,
[DevTools](https://reactjs.org/blog/2019/08/15/new-react-devtools.html),
[fragments](https://preactjs.com/guide/v10/components/#fragments), and
[hooks](https://preactjs.com/guide/v10/hooks/). You can still work with many of
the React API’s useful features, such as its server-side rendering, and draw
from its huge range of components. Preact also ships with Preact CLI, which can
bundle your code into a perfect-scoring
[Progressive Web App](https://preactjs.com/guide/v10/progressive-web-apps/).

A Preact-based creation process is understandably similar to one using React or
other virtual DOM solutions such as Vue.js. A user interface in Preact consists
of trees of components and elements. These components return descriptions of
what their trees should output. In Preact, you can write these descriptions in
React’s JSX, or an alternative called
[HTM](https://preactjs.com/guide/v10/getting-started/#alternatives-to-jsx)
(HyperScript Tagged Markup). Here’s a JSX example from
[Preact’s GitHub](https://github.com/preactjs/preact) page:

```jsx
import { h, render } from 'preact';
// create our tree and append it to document.body:
render(
  <main>
    <h1>Hello</h1>
  </main>,
  document.body
);

// update the tree in-place:
render(
  <main>
    <h1>Hello World!</h1>
  </main>,
  document.body
);
// ^ this second invocation of render(...) will use a single DOM call to update the text of the <h1>
```

# Benefits of using Preact

Now that we’ve seen how Preact works, let’s dive into the advantages of its
unique, minimalistic approach to development.

## Lightweight and compact

Preact’s clearest draw is its size. This characteristic makes it easy to hit the
Progressive Web App target of
[interactivity in 5 seconds](https://preactjs.com/guide/v10/progressive-web-apps).
Preact’s lightness also opens it up to use cases that simply aren’t viable for
React or similar libraries. Uber, for example, set out to design a
[mobile web app](http://m.uber.com/) with all the rich experience of the native
app, but with a minimal client footprint. Uber initially used React and Redux,
but decided to swap in Preact for its size benefits. The entire app weighed in
at only 50kB, making it quickly usable even on 2G networks.

Preact may even be embedded into a self-contained widget, and the Preact
dependency will still likely be smaller than the widget’s code.

## Frictionless Progressive Web Apps with the Preact CLI

Thanks to Preact CLI, getting started on the development of a Progressive Web
App with Preact is quite straightforward. Preact CLI automatically generates a
PWA with a
[guaranteed 100/100 score on Lighthouse](https://preactjs.com/guide/v10/progressive-web-apps#docsearch-input:~:text=a%20PWA%20with%20a%20100%20Lighthouse%20score%20right%20out%20of%20the%20box),
leading to a faster user experience and higher conversion rates. In addition,
the build tool comes with fully automatic
[route-based code splitting](https://github.com/preactjs/preact-cli#route-based-code-splitting),
and can auto-generate and install ServiceWorkers that return cached offline
copies of pages in the event of a network error. Developers looking to optimize
the size and performance of their PWAs can easily switch from React to Preact.

## Largely similar to React

The virtual DOM approach to rendering web pages is justifiably popular.
Manipulating the DOM is often the slowest part of loading and interacting with a
website. Every time the DOM changes, the browser has to re-render the CSS and
layout. Preact neatly sidesteps this roadblock by applying changes to a virtual
copy of the DOM. It then uses a highly optimized diffing algorithm to quickly
render those changes to the actual DOM. Like React, Preact’s diffing algorithm
means you don’t need to worry about optimizing your DOM manipulations manually.
Of course, leaving this task to the algorithm does have a
[performance cost](https://www.accelebrate.com/blog/the-real-benefits-of-the-virtual-dom-in-react-js)
compared to directly manipulating the DOM. But it allows you to develop your
projects much faster.

Unlike its close competitor Inferno, Preact provides an API that looks and feels
similar to React’s API. This facilitates the borrowing of various elements and
functionalities from React. Inferno is also in the lightweight class, weighing
in at 9kB, but has different public and private APIs compared to React. Both
Inferno and Preact are compatible with React to some degree, but Preact has the
clear advantage.

---

# Drawbacks of using Preact

No approach is perfect. Indeed, each of Preact’s benefits must be weighed
against a set of complementary drawbacks that we explore next.

## Lacks some key React functionality

The biggest downside to Preact’s minimalist design is the lack of key
functionality when compared to React. Preact’s development team has added some
admittedly unique features to Preact. However, experienced React developers may
take issue with the lack of support for
[context](https://reactjs.org/docs/context.html) and
[propTypes](https://reactjs.org/docs/typechecking-with-proptypes.html), and the
comparatively incomplete error/warning system. Newer developers might look to
more complete solutions such as React, Vue.js, or even Angular, given their
superior documentation and descriptive error messages.

Preact’s commitment to a minimal footprint also means that new features likely
won’t be appearing at the same pace as React’s. Because it’s based on the React
API, Preact is perpetually a few steps behind React’s newest releases, such as
[React Fiber](https://indepth.dev/inside-fiber-in-depth-overview-of-the-new-reconciliation-algorithm-in-react/).
Early adopters of bleeding edge web technology are more likely to see such
features appear first in React, Angular, or other large mainstream projects.

## Smaller community

Going purely off GitHub stars, React is significantly more popular than Preact,
with [155,000 stars](https://github.com/facebook/react) versus
[26,900 stars](https://github.com/preactjs/preact). Minimalist solutions such as
Preact (and to a lesser extent React) encourage innovation at the development
process stages to which they don’t cater. This means they benefit greatly from
community contributions and add-ons.

This approach differs from highly engineered platforms like Angular, which favor
a single widely-accepted solution for each problem. Whereas React, Angular, and
Vue.js all have large and active communities, Preact is niche by comparison. And
though Preact has some useful community contributions, adding these to your
project somewhat diminishes the value of Preact’s compactness.

It’s also going to be harder to find Preact-based work or hire talent with
Preact competence, when comparing with better-known alternatives. Given their
similarity, it’s difficult to imagine investing time into Preact and not React.
For the moment at least, React has a much larger talent pool and more job
opportunities.

---

# What is Preact used for?

Preact is ideal for Progressive Web Apps focused on performance and a small
package size. The difference is especially pronounced for single-page web apps,
in which Preact can handily
[beat both React and Vue](https://medium.com/swlh/react-vs-vue-js-vs-preact-which-one-should-you-use-d3b3ba809ec1).
That being said, the performance benefits aren’t always so pronounced.
Benchmarks don’t always reflect the performance of real-world applications. In
reality, the difference in loading times becomes increasingly negligible in
larger projects. Developers of larger applications may well choose React or
Vue.js for their features, and accept the size and performance cost. In their
case, user experience matters most.

## Widgets and small components

Apart from full websites, you can use Preact to great effect in building widgets
to embed functionality in other websites. If you are worried about adding a
React widget that drags the entire web page’s performance down with it, Preact
is a perfect fit.

## Desktop and mobile applications

You can also use Preact to make lightweight desktop and mobile apps with
[Electron](https://www.electronjs.org/). If you’ve built an app with Electron
and React, doing the same with Preact
[is a fairly simple process](https://medium.com/@cjus/desktop-apps-using-electron-preact-and-material-design-8161938624c6).

# FAQ

## Why is Preact so much smaller than React?

Preact doesn’t attempt to match React on functionality. Preact provides enough
for all but the largest and most complex web projects. Its team was also able to
cut a lot of React’s excess by dispensing with its synthetic event system and
using native browser methods instead. It may come as no surprise that Preact
creator Jason Miller is a skilled
[code golfer](https://www.wikiwand.com/en/Code_golf).

## How much faster is Preact compared to React?

Preact’s performance potential is most pronounced on small projects and
packages, especially when compared to React. Its Progressive Web App prowess
also helps it score particularly well in
[Lighthouse tests](https://stefankrause.net/js-frameworks-benchmark8/table.html),
where a high score generally means superior user experience and SEO potential.
The size difference can offer real benefits in initial loading times, especially
when targeting slow internet connections.

Nevertheless, there’s no clear winner. As your projects become larger, it’ll
become more difficult to tell the two apart performance-wise. If you were to
port a complex React project into Preact, you’d perhaps need to tack on so many
add-ons that any performance boost would be offset. If you do get curious,
`preact-compat` makes it quite easy for you to test out a React codebase.

## Who created Preact?

Preact is the brainchild of Google developer
[Jason Miller](https://github.com/developit). He built Preact while trying to
grasp the workings of React and Mithril, and decided to keep it small enough to
be accessible. It’s now maintained and developed by an international team on
GitHub.

Preact receives backing through
[Open Collective](https://opencollective.com/preact). This allows its backers to
contribute to the development process and make meaningful changes and pull
requests.

## Is Preact suitable for single-page web apps?

Certainly. Preact’s tiny size has led to its being implemented by Lyft, Uber,
Groupon, Housing.com, and Pepsi, among a
[host of other](https://preactjs.com/about/we-are-using) large organizations.
Preact can significantly improve the time-to-paint and time-to-interactive
performance of your web app. Treebo saw a
[15% decrease](https://medium.com/dev-channel/treebo-a-react-and-preact-progressive-web-app-performance-case-study-5e4f450d5299)
[in its](https://medium.com/dev-channel/treebo-a-react-and-preact-progressive-web-app-performance-case-study-5e4f450d5299)
[overall package size](https://medium.com/dev-channel/treebo-a-react-and-preact-progressive-web-app-performance-case-study-5e4f450d5299)
after a simple switch from React to Preact. Developers can also draw from
React’s mature ecosystem for single-page web apps and use preact-compat to
bridge the gaps.

---

# Summary

Preact might have a long way to go before reaching the likes of React, Vue, or
Angular. But with the clear exception of vanilla JavaScript, few, if any, can
offer Preact’s same incredible performance considering its minuscule package
size. While using a framework is essential for scaling development, outsourcing
optimizations will always result in some cost to your application’s speed and
responsiveness. If you want to minimize that cost while retaining nearly all of
React’s amenities, Preact is an attractive choice.

However, it’s important to note that Preact’s development history has mostly
involved building on preexisting React tools, instead of forging unique ones.
Currently, its development team is hard at work on bringing Preact up to speed
with React 16’s newest toys. But React developers trying out Preact might yearn
for React’s error messages, development tools, and support for `createClass`.

Nonetheless, you could easily carry skills developed in Preact over to React. So
if you’re willing to make some small compromises for the sake of elegance and
performance, Preact will deliver tangible rewards.
