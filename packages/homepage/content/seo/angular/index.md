---
banner: ./banner.png
slug: framework/angular
title: Angular js
description: The modern web developer's platform
---

The web is no longer a place of simple, static webpages. Building interactive
websites, particularly single-page web applications, exceeds HTML’s intended
scope. Enter [Angular](https://angular.io/): a client-side, open-source
JavaScript framework that helps organize and build web apps with well-structured
design patterns.

The idea of building complex and dynamic websites with JavaScript is not new.
JavaScript was first released and used to create dynamic webpages in 1995, with
[jQuery](https://jquery.com/) having been around since the early 2000s. But
developers using plain JavaScript or jQuery on complex projects had lacked
consistent standards and began struggling to maintain their increasingly
elaborate websites. Then came Angular to simplify things. By splitting a site’s
UI into its views and their underlying code, Angular facilitates structured and
robust web design. Angular’s structure and scalability for larger projects make
it one of the most popular front-end frameworks today, based on data from the
[2020 StackOverflow Developer Survey](https://insights.stackoverflow.com/survey/2020#technology-programming-scripting-and-markup-languages).

In this article, we delve into the intricacies of Angular, cover its main
benefits and drawbacks, and list the most common use cases for which Angular is
a good fit.

---

# What is Angular?

Angular doesn’t quite have a clear definition.
[Documentation](https://angular.io/docs) sometimes refers to Angular as a
front-end framework, and at other times even as a full-stack platform. And
though it’s often mentioned alongside frameworks like React or Vue.js, Angular's
native capabilities exceed those of its peers.

Its rich functionality includes a large set of UI component libraries, a
dedicated command line, and a wide variety of app execution environments. In
fact, as well as web apps, you can also use Angular to develop native mobile and
desktop apps. Its comprehensive feature set means it's more akin to a
development platform than to a framework.

## Is it Angular or AngularJS?

You might sometimes hear [Angular](https://angular.io/guide/upgrade) referred to
as AngularJS. However, the two terms are not interchangeable. AngularJS was the
[original incarnation of Angular](https://angularjs.org/) (released in 2010).
The newer Angular 2.0 (released in 2016) served as a ground-up rewrite of
AngularJS. It drastically improved robustness and security, through changes like
the adoption of TypeScript in lieu of standard JavaScript. This new version of
Angular was not made backwards-compatible with AngularJS. So, to demarcate the
two eras of Angular development, all versions from 2016 onwards are commonly
referred to as “Angular 2+.”

The name “Angular” is attributed to
[Miško Hevery](https://twitter.com/mhevery?lang=en), one of the framework’s
creators. Hevery chose this name due to the angles in the <> characters in HTML.

---

# How does Angular work?

An Angular application consists of
[components](https://angular.io/guide/architecture-components), which are
independently functioning UI elements. Each component contains data and logic
written in TypeScript, and links to a corresponding
[template](https://angular.io/guide/template-syntax) in HTML. Together, they
define how that particular UI element should look and behave. Here are some
[Material Design examples](https://material.angular.io/components/categories) of
Angular components. The component architecture is an efficient way to create a
reactive and multi-layered user interface. So it comes as no surprise that
Angular, React, and Vue.js all structure their projects using components.

Complimenting this is Angular's use of
[two-way data binding](https://angular.io/guide/two-way-binding). In effect, a
change in component state (data) automatically changes its template (how it's
rendered) and vice versa. Angular achieves this through
[directives](https://angular.io/guide/structural-directives) that link component
state data to their templates.

## Direct DOM rendering

React and Vue.js have popularized the
‘[virtual DOM](https://bitsofco.de/understanding-the-virtual-dom/)’ to great
effect. This approach sidesteps the ballooning resource cost of querying and
modifying the real DOM that many websites previously faced, by instead operating
on an in-memory copy of the DOM. While using the virtual DOM is more efficient
than using the live DOM, it's extremely memory-intensive as you’re creating an
entire copy of the DOM in memory. Minuscule component state changes require
re-rendering an entire virtual DOM tree along with any child components that may
or may not have changed.

In contrast, Angular’s
[change detection](https://blog.angular-university.io/how-does-angular-2-change-detection-really-work/)
occurs earlier and doesn't consume as much memory as React’s JSX-style render
function. When building templates in Angular, the compiler generates a new
function to handle updating the DOM and data-binding. This function stores DOM
node references and their values so that Angular never actually has to read them
from the DOM itself.

Additionally, the direct DOM rendering approach can have two threads of
execution: the main browser thread and the background web worker thread. The web
worker thread is available to take any processor-intensive task from the main
thread. The main thread can thus focus on rendering component state changes to
the DOM, once the background thread processes the changes. Multi-threading in
this fashion offers a significant speed improvement over a virtual DOM approach.

## Model-view-viewmodel framework

Angular’s component-based philosophy doesn’t fit neatly into the typical MVC
design pattern. It’s much more at home with an MVVM (Model-View-ViewModel)
architecture, due to MVVM’s support for two-way data binding between the View
and the ViewModel. Instead of a Controller, a ViewModel is an abstraction of the
View, and represents the current state of the data in the Model.

---

# Benefits of using Angular

Having explored Angular’s philosophy and how it works, let’s go over the
advantages of adopting Angular as a framework for your project.

## Rich set of features

In comparison to React and Vue.js’ minimalism, Angular provides an impressive
set of out-of-the-box features. It’s able to not only control the UI, but also
validate user input forms, manage routing, transform your app into a progressive
web app, build your application, and send Ajax requests, among having many other
features.

React and other lightweight frameworks need developers to install functionality
as needed. On the other hand, Angular comes with high-level APIs built in that
abstract low-level functionality, making it highly suitable for large and
complex projects. Acclimating to Angular’s complete development environment
means your skillset can expand smoothly in line with the scope and complexity of
your websites.

## Direct DOM rendering

Angular’s use of the direct DOM is memory-efficient compared to virtual DOM
frameworks. Interactions with the DOM are slow and costly; so in Angular, when
data changes, it’s only the relevant components that update and render to the
DOM. In contrast, rendering a React component involves re-rendering all its
sub-components by default. With Angular, there is none of the cost of
re-rendering a virtual DOM since the change detection system only runs when a
component’s state changes.

In applications with large numbers of nested components, Angular’s approach is
superior. A single component changing need not result in its child elements
needing to change and re-render.

## Separating application behavior and UI

Angular delineates its TypeScript from its HTML by design; all HTML templates
are separate from the TypeScript logic. React, on the other hand, peppers its
JavaScript code with HTML and CSS via JSX syntax. As traditional web development
separates templating, styling, and logic, Angular’s workflow is comparatively
easier to adjust to vis-à-vis React’s JSX approach.

Further, the concept of separating views from their behavior ensures a scalable
design. Decoupling templates from logic facilitates scalability in the long run,
as opposed to packing everything into a single JSX file. While other frameworks
allow for this option, Angular forces you to do it from the outset.

## Popularity

Angular is notably popular among enterprise customers. Apart from all of
Google’s large applications, Angular is the go-to for high-traffic sites such as
GitHub, Delta Airlines, Deutsche Bank, Adobe, and Forbes,
[among many others](https://www.madewithangular.com/). Angular hasn’t got
React’s [runaway popularity](https://www.npmtrends.com/angular-vs-react-vs-vue),
but is under active development and receives major updates about every six
months.

Angular has been around as a JavaScript framework for quite awhile. And while
new frameworks rise and fall in popularity, Angular maintains a stable following
and dedicated community. In line with its reputation as a complete developer
platform, any problems that can’t be fixed by referring to its extensive
documentation can surely be remedied via community support in the form of
packages, videos, blog posts, and forum discussions.

---

# Drawbacks to using Angular

While it packs a lot of benefits, Angular’s approach is not without drawback.
Next, we explore the costs of using Angular, which are inseparable from its
benefits.

## Learning curve

Angular’s larger feature set also comes with a steeper learning curve, as
compared to Vue.js or React. Building projects with Angular requires advanced
developer tooling, although it comes with ways to expedite that process (like
Angular’s CLI).

For Angular in particular, it’s best practice to learn and use
[TypeScript](https://www.typescriptlang.org/). TypeScript adds greater clarity
to JavaScript by adding static type definitions, but it’s a point where
potential Angular developers could lose momentum, especially seeing as Vue.js
consists of only JavaScript and HTML. Additionally, though directives comprise a
powerful feature of both Angular and Vue.js, they do require some getting used
to.

## Large file size

Angular’s enterprise-scale design lends itself to premature scaling, as it
includes features before they’re necessarily required. Inevitably, this leads to
excessively large package sizes. Though it’s expected in projects of significant
size and complexity, a heavy Angular package may weigh you down for smaller
scopes.

As a result, the performance gap between Angular and more minimal frameworks
widens with increases in application size and complexity. And while using
TypeScript ensures maintainable code, its heaviness hampers productivity and
[discourages developers](https://2018.stateofjs.com/javascript-flavors/typescript/#dislikes)
with less processing power and memory.

## Opinionated project structure

Whereas alternatives like Vue.js offer no concrete guidelines on usage, Angular
has clearly-defined default procedures on the best uses of all its tools.
Generally, workarounds or alternatives to the default do not work as cleanly as
with Angular.

More specifically, Angular has a set group of design patterns, and it expects
you to use them at all times. While this satisfies separation of concerns, and
facilitates an understanding of the design choices of other Angular developers,
it also leaves the onus on the Angular Team to test and develop best practices.

There’s no home-brewing your own solutions or creating your own personalized
toolset: it’s the Angular way or otherwise a lot of experimentation and
potentially reduced functionality.

---

# What is Angular used for?

Angular is best suited to creating web applications, particularly single-page
and progressive web apps. You can also tool Angular to make desktop applications
using
[Electron](https://developer.okta.com/blog/2019/03/20/build-desktop-app-with-angular-electron),
a Github-developed software framework for making desktop apps with web
technology. Angular’s forte lies in its scalability: any Angular project scales
extremely well for larger projects and teams.

Additionally, making [JAMstack](https://jamstack.org/) (i.e., statically
generated) websites is possible with Angular using
[Scully](https://github.com/scullyio/scully). Static websites pre-render the
webpages served to users and remove the need for a web server entirely, making
them satisfyingly fast and cost-effective.

# FAQ

## Is Angular easier to learn than React?

React is a much smaller package overall seeing as it’s a view library, whereas
Angular serves as both a framework and an entire platform. However, the two have
approach-based differences that can make their relative difficulty depend on
your development background and skills. Some developers favor a highly
structured approach, and are willing to wade through the large number of new
concepts Angular asks you to learn. Conversely, React encourages you to
experiment and find solutions by yourself or through its community.

Syntax and workflow also play a major role in learning difficulty. Both React
and Angular differ from traditional web development in that they use JSX and
TypeScript syntax for the majority of their workflow. Both may be considered
difficult, yet using TypeScript combined with HTML templates in Angular may be
an easier migration from a traditional web development background.

## Is Angular faster than React?

In some key areas like memory allocation and DOM manipulation, Angular is
[decidedly faster than both React and Vue.js](https://stefankrause.net/js-frameworks-benchmark8/table.html),
owing to its direct DOM rendering. However, its heavier structure does make it
slower on startup.

## Who created Angular?

Angular (initially named AngularJS) was created by engineers Miško Hevery and
Adam Abrons. The framework (or platform) sought to facilitate the building of
enterprise applications. Angular is now maintained by a dedicated team at
Google.

---

# Summary

Angular is one of the oldest and most comprehensive JavaScript frameworks. It
might not have React’s cool factor or Vue.js’ youthful innovation, but
enterprise customers
[flock to Angular](https://www.techrepublic.com/article/angular-vs-react-who-wins-the-front-end-battle-in-the-enterprise/)
in droves. This comes as no surprise given the depth of Angular’s toolbox.

Yet Angular’s scope does not hinder its evolution. It’s backed by Google and
supported by a very active community, and when it comes to robustness and
scalability, the sky’s the limit. Its design choices are consistent and become
increasingly rewarding the more complex you go. And if you are looking to build
a project of any size with as much help as you can get, Angular will happily
assist.
