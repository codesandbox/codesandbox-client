---
banner: ./images/intro.jpeg
slug: announcing-codesandbox-projects
authors: ['Ives van Hoorne']
photo: https://avatars0.githubusercontent.com/u/587016?s=460&v=4
title: Announcing CodeSandbox Projects
description:
  We're super excited to announce CodeSandbox Projects, a rewrite of CodeSandbox
  from the ground up.
date: 2022-03-17
---

We’re super eager to introduce CodeSandbox Projects; a cloud development
platform with the familiar speed and experience of CodeSandbox, but deeply
integrated with your favourite tooling, and working on projects of any size.
We’ve been using it at CodeSandbox ourselves to build CodeSandbox, and have been
loving it!

There’s a whole lot to talk about, so let’s dive in!

## Why CodeSandbox?

24 million sandboxes have been created on CodeSandbox, half of which were
created last year. We’re unbelievably proud and humbled by this.

We think that people use CodeSandbox because of its workflow; when you have an
idea, you can click a button and be ready to go in seconds. If you want to
collaborate, just share the link. This doesn’t only make you faster, it makes
development as a whole more accessible and more fun.

As more people started to use CodeSandbox for their ideas, more people also
wanted to use CodeSandbox for bigger, more complex projects and bigger teams.
This was the case for the team at Excalidraw; Vjeux started Excalidraw on
CodeSandbox, and as the project grew, they wanted to keep using CodeSandbox -
but they just weren’t able to work effectively.

Why? Well, CodeSandbox is fast today because we run the code in the browser.
However, that doesn’t scale well to bigger projects because you have to store
all files in memory, and you can’t seamlessly run other languages or services
like databases.

So, a year ago we went to the drawing board asking this question: **how can we
deliver the same experience of CodeSandbox, but for any project of any size,
integrated into any existing workflow?** Today we’re super excited to say that
we found & developed an answer. In fact, we have enabled more than we initially
expected, and we think this can change how we do development.

So, let’s show you what’s possible with CodeSandbox Projects!

## What is CodeSandbox Projects?

CodeSandbox Projects is a rewrite of CodeSandbox from the ground up. **It’s an
opinionated web development flow based on our learnings from CodeSandbox over
the past 5 years.** It integrates tightly with git and VSCode, and it can run
any project of any size.

There’s a _ton_ in this version of CodeSandbox, and over the coming few weeks
we’ll highlight more features, but let’s first go over the highlights of
Projects.

### Integrated with repositories

One key feature of Projects is that every branch is its own development
environment, backed by a unique URL. This means that you can share your branch
with someone else, and they will always be able to see a running branch, even if
you’re offline.This is especially useful if you’re working in a distributed team
across time zones.

This feature shines when you’re working on a branch, and you need to quickly
review a PR. You won’t have to worry about stashing, running yarn install, or
rolling back migrations on your current branch. You can just open the branch of
the PR in a new window and do the review!

### A running environment in seconds

With CodeSandbox Projects we run the repositories on containers. However, we
found a way to make it fast (for curious developers, we've got a write-up coming
soon with juicy details on how). Because of this, when you press fork, we create
a new branch and development environment, with running dev servers, within a
couple seconds.

<video autoplay loop muted playsinline width="100%">
  <source src="./images/gitflow.mp4" type="video/mp4">
</video>

This means that if you’re looking at someone’s PR, and you want to test a quick
suggestion, you can click “Fork”, make your change, and share a link to the new
branch with those changes. If you’re happy with the changes, you can merge that
into the existing PR. All of this can be done within a minute.

### Works with VSCode (with more to come)

We, and many others, are used to working in VSCode. That’s why we made sure to
integrate directly with it! You can open any branch directly in VSCode, and you
can use all the extensions and keybindings that you’ve already configured. On
top of this, all editors can collaborate seamlessly, so someone can use the
online editor to follow you in VSCode.

<video autoplay loop muted playsinline width="100%">
  <source src="./images/vscode.mp4" type="video/mp4">
</video>

This is possible because **we created CodeSandbox Projects with an open API**,
and we will open source this API later this year. CodeSandbox Projects' API
allows you to implement your own features into CodeSandbox. You can add custom
panes for toggling feature flags, state debugging, performance monitoring,
really anything else you can think of. For example, you could create a Postman
devtool to test API calls more easily.

This opens the door to future CodeSandbox integrations in all your favorite
tools: Vim, IntelliJ IDEA, SublimeText, Nova, etc, and in extension this will
enable seamless collaboration between other supported editors like VSCode.

### Tailored for your project

Just like with CodeSandbox, we’ve built CodeSandbox to integrate directly with
your project in an opinionated way. This doesn’t only make you faster as a
developer, it makes development more accessible for others who are getting
introduced to coding.

One example of this is the inspector. For React projects, you can use the
inspector to see exactly where a component is rendered in the code. If you
quickly need to change the copy or styling of a button, you can just click on
the button, and change the code in the editor.

<video autoplay loop muted playsinline width="100%">
  <source src="./images/inspector.mp4" type="video/mp4">
</video>

We have more tooling like this coming up, focused on making you faster when
developing, and to make development itself more accessible and collaborative.

### Develop on the go on your iPad/iPhone with a native app

Taking full advantage of the extensibility of CodeSandbox Projects' API, we
didn’t stop at integrating VSCode. Last year we announced that we’ve acquired
Play.js, and since then Carlos has been implementing the API into CodeSandbox
for iOS.

<video autoplay loop muted playsinline width="100%">
  <source src="./images/ios.mp4" type="video/mp4">
</video>

This means that you can pick up where you left off, or develop from scratch from
an iPad or iPhone, with all the functionality that you would expect from a
development environment. It’s never been possible before to do full web
development natively from an iPad, so we are super excited to see what people
will build purely from their iPad!

### Open source first

Open source is very important for CodeSandbox, we started as an open source
project and we’ll open source a big part of Projects too.

Because of this, we’ve had the goal to make it native to open source from the
start. Currently, contributing to open source is not very easy. You have to make
a fork, clone that repo, set the upstream, create a new branch, make your
changes, create a commit and then push that to your repo to open a pull request.
And even then, you need to know how to set up the environment.

It’s been our goal to make this much easier, and that’s why we built CodeSandbox
in such a way that you can open any open source branch in CodeSandbox, press
“Fork”, and we’ll handle the forking, the branching and setting the upstream for
you. You can focus on making the contribution, and pressing “Open PR”!

Also, because every branch has a shared development environment, you can share a
link to a branch on CodeSandbox with anyone! As long as they have read access,
they will be able to see a running version of the branch and explore the code.

<video autoplay loop muted playsinline width="100%">
  <source src="./images/readme.mp4" type="video/mp4">
</video>

For example, here’s the main branch of Excalidraw, live running the branch:
https://codesandbox.io/p/github/excalidraw/excalidraw.

If you’re an open source maintainer, and you want to have your repository on
CodeSandbox, let us know and we can add you to the waitlist!

## What's next?

We’re still actively working on CodeSandbox Projects, and there’s still a ton
that we want to build. In the meantime we want more people to use this, though.
This is why we started a waitlist. To get access to CodeSandbox Projects, you
can apply to the waitlist here: https://projects.codesandbox.io.

### What will happen with sandboxes?

We see projects on CodeSandbox as something different than sandboxes. With
sandboxes, you can prototype different ideas and share examples without source
control. Whereas with projects, you work on bigger, well, projects! Projects are
always connected to source control.

Sandboxes and projects will live next to each other, and you will get a way to
convert a sandbox to a project in the future. In the longer term, we’re going to
move sandboxes to the new editor as well, so you have a single experience both
for sandboxes and projects.

## Thank you

This has been the biggest project at CodeSandbox so far. When we started with
CodeSandbox Projects, we were a team of 12 people, now we’re a team of 30
people. We’ve worked super hard to get to this point, and we’re so excited that
we can finally share it with the world!

We know these are some hard times in the world. We still wanted to put our work
out. We’re hoping for better days ahead, and we’ll try to help as much as
possible from our side.

Sincerely,

[Adewale Abati](https://twitter.com/Ace_KYD),
[AJ Foster](https://twitter.com/Austin_J_Foster),
[Alex Moldovan](https://twitter.com/alexnmoldovan),
[András Bácsai](https://twitter.com/andrasbacsai),
[Artem Zakharchenko](https://twitter.com/kettanaito),
[Bas Buursma](https://twitter.com/bazzjuh),
[Bogdan Luca](https://twitter.com/lucabogdan),
[Carlos Vidal](https://twitter.com/nakiostudio),
[Christian Alfoni](https://github.com/christianalfoni),
[Danilo Woznica](https://twitter.com/danilowoz),
[Danny Ruchtie](https://twitter.com/DannyRuchtie),
[Gianmarco Simone](https://twitter.com/ggsimm),
[Ioana Chiorean](https://twitter.com/ioana_cis),
[Ives van Hoorne](https://twitter.com/CompuIves),
[James Amey](https://twitter.com/JamesAmeyUK),
[Jasper de Moor](https://twitter.com/JasperDeMoor),
[Joana Telker](https://twitter.com/JoanaTelker),
[Joji Augustine](https://twitter.com/joji_augustine),
[Julien Leclercq](https://github.com/julien-leclercq),
[Kate Beard](http://www.twitter.com/sbinlondon),
[Lena Sotto Mayor](https://twitter.com/lenasottomayor),
[Marco Vincit](https://twitter.com/marcovincit),
[Maria Clara Santana](https://twitter.com/olarclara),
[Matan Kushner](https://twitter.com/matchai),
[Necoline Hubner](https://twitter.com/necolinehubner),
[Oskar van Eeden](https://twitter.com/EedenOskar),
[Roman Kuba](https://twitter.com/codebryo),
[Sanne Kalkman](https://twitter.com/sannekalkman),
[Scott Hutcheson](https://twitter.com/SMHutcheson),
[Tamas Szuromi](https://twitter.com/metricbrew),
[Zeh Fernandes](https://twitter.com/zehf)
