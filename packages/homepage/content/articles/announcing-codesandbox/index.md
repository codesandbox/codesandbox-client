---
banner: ./images/intro.jpeg
slug: announcing-codesandbox
authors: ['Ives van Hoorne']
photo: https://avatars0.githubusercontent.com/u/587016?s=460&v=4
title: Announcing CodeSandbox
description: TODO
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

Vscode

<video autoplay loop muted playsinline width="100%">
  <source src="./images/vscode.mp4" type="video/mp4">
</video>

git/fork
