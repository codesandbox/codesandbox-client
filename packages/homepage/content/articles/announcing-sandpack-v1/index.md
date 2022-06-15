---
banner: ./images/cover.jpg
slug: announcing-sandpack-v1
authors: ['Danilo Woznica']
photo: https://avatars.githubusercontent.com/u/4838076?s=400&u=4a6e83e27f793352a773920255ec23af710dc3aa&v=4
title: 'Sandpack v1: a fresh design and a new accessible API'
description:
  Today, we are proud to announce the first major release of Sandpack v1 - A
  toolkit for creating in-browser live coding.
date: 2022-06-15
---

Since we
[announced Sandpack](https://codesandbox.io/post/sandpack-announcement), we
didn't stop a minute. We've been working hard alongside the community to improve
it and make it even better. And to be honest, we're amazed how the community
embraced Sandpack. As a result, many projects can now empower their users and
provide a better code experience in their own project and website.

But today, we'd like to introduce a new step in the Sandpack journey. We
listened to you, and we're very excited to introduce a major release of
Sandpack, which takes into account many feature requests, a complete redesign,
and a ton of improvements in the API.

### What is Sandpack?

Sandpack is a component toolkit that makes it possible to have interactive,
live-running code editing experiences in the browser. It is the in-browser
bundler that powers CodeSandbox that is now open source.

With Sandpack's live coding environment, you get:

- A full editor experience with syntax highlighting;
- An advanced preview that takes advantage of npm dependency support, hot module
  reloading, etc;
- One click away from opening your code snippets directly in CodeSandbox.

### One step back

The very first version of Sandpack was released in 2018. Since then, we haven't
had the chance to take a step back and rethink how you interact with it and how
the Sandpack components fit in your website. Plus, we realized that we need to
be prepared for the future challenge that might come. That's why we recreated
the surface API and the design of the components to open more opportunities for
us, and you!

So, at the first look, all the breaking changes introduced in this major version
might not look significant. But, they're crucial to keep us evolving the product
and still keep it extensible, customizable, and easy to use.

### What's new?

#### A new design, from scratch

We challenge ourselves to come up with a solution that could fit in different
layouts and contexts, but still be accessible and customizable. As a result, we
created a new set of themes, icons, design tokens, and components from scratch.

<video autoplay loop muted playsinline width="100%">
  <source src="./images/design.mp4" type="video/mp4">
</video>

#### Bring your favorite theme to Sandpack

All themes are available now on `@codesandbox/sandpack-themes`, so which means
that you’re able now to contribute to Sandpack and create your favorite theme.


<video autoplay loop muted playsinline width="100%">
  <source src="./images/themes.mp4" type="video/mp4">
</video>

#### Sandpack file explorer

We listened to you, and now Sandpack has a new component to navigate, open and
close files, empowering your sandboxes and examples.

<video autoplay loop muted playsinline width="100%">
  <source src="./images/fileexplorer.mp4" type="video/mp4">
</video>

<br/>
<br/>

**And much more:**

- SSR: syntax-highlight on the server, dedupe styles, and a more lightweight
  output;
- New API: it fixes many inconsistencies, and improves the discoverability of
  some options;
- Improve error message descriptions;
- Support React 18;

Check out the Migration guide and get more info:
[https://sandpack.codesandbox.io/docs/releases/v1](https://sandpack.codesandbox.io/docs/releases/v1)

### What's next?

Your opinion is very important to us. As we already said, most of these
improvements came from community requests and bug reports. So, if you have any
feature requests or want to understand how Sandpack might fit in your project,
don't hesitate to reach out on our Discord channel or GitHub repository.
