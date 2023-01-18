---
banner: ./images/introducing-docker-support-in-codesandbox.png
slug: introducing-docker-support-in-codesandbox
authors: ['Ives van Hoorne']
photo: https://avatars0.githubusercontent.com/u/587016?s=460&v=4
title: Introducing Docker Support in CodeSandbox
description:
  You can now run anything on CodeSandbox with our native Docker support.
date: 2023-01-11
---

CodeSandbox started in 2017 as a code editor specifically for React
applications. Since then, we've expanded our support, up to the point that we
supported everything that runs JavaScript.

Today, we are taking the next step. **We’re announcing native Docker support in
CodeSandbox, allowing you to create sandboxes for any programming language!** 🎉

Let’s dive into how this works and how we built it!

## Native Docker Support

In 2022, we made one of our biggest product decisions ever—to introduce a new
CodeSandbox experience with Cloud Sandboxes and Repositories that run in
[microVMs](https://codesandbox.io/post/how-we-clone-a-running-vm-in-2-seconds).

This is a significant leap forward from our original sandboxing experience,
which was executed in the browser’s runtime. Besides getting rid of browser
limitations, it opened the door to new possibilities, like
[coding directly from VS Code](https://www.youtube.com/watch?v=ZJ1sNiTZw5M) and
running servers and databases.

Initially, to quickly allow our users to bring their Docker configuration into
CodeSandbox, we released experimental support for Docker and NixOS.

This was a win already, but it did require some tinkering to make your local
Docker config work in CodeSandbox. Well, not anymore! With this update, Docker
works out of the box. Simply create a Dockerfile at `.codesandbox/Dockerfile`
and we’ll make everything work, running exactly as it does on local!

You can leverage this to build a powerful development environment and make it
available to your whole team behind a URL.

But enough chit-chat! Let’s see it in action as I build a simple project with
Deno.

## Building a project with Deno

First of all, here's a template that you can fork to get started with Docker
yourself: https://codesandbox.io/p/sandbox/docker-example-hsd8ke.

If getting Deno to work on CodeSandbox before was a bit of a headache, now it’s
strikingly simple!

The only thing I really have to do is to create a Dockerfile at
`.codesandbox/Dockerfile` to run Deno:

```yaml
FROM denoland/deno:debian-1.29.2
```

Immediately after I save this file, CodeSandbox detects the change and asks me
if I want to restart my container. When I click “Yes”, Deno gets installed in
the background and a preview opens. See this in action below.

<video autoplay loop muted playsinline controls width="100%">
  <source src="./videos/docker-deno.mp4" type="video/mp4">
</video>

It’s as simple as that! And the cool thing is that I can re-use my Docker
configuration across my local environment and my cloud environment in
CodeSandbox. Plus, if I open this with VS Code, it will also be inside the
container!

Check out our brand-new
[Deno template](https://codesandbox.io/p/sandbox/xenodochial-cerf-kc6kgh) if you
want to start playing around with Deno. More templates coming soon!

### Root access for everyone

Since we now run your code within a container, you actually have `root` access!

Behind the scenes, we’re running a rootless Podman container for your user,
based on the Dockerfile in the `.codesandbox` folder. Because of this, we can
give you `root` access, without exposing too many permissions for you.

This will enable you to use tools like `apt`, but for long-term changes, we
still recommend you put those in the Dockerfile.

You can find more details about this in our
[Docs](https://codesandbox.io/docs/learn/environment/docker).

## A standardized cloud development environment

Because Docker now works out of the box in CodeSandbox, this also means that
after setting up your project with Docker, anyone with the link can access it
anytime to work on that pre-configured environment. Plus, if they fork it, they
instantly get an exact copy of the development environment with all the tooling
in place.

One of the most exciting applications of this is that if you have a project
running a seeded database on CodeSandbox and you fork it, everything will get
forked—the entire environment, including all these seeded databases. I have
actually been meaning to write more about this use case, so don’t forget to
[follow us on Twitter](https://twitter.com/codesandbox) if you don’t want to
miss that one.

We are also actively working on getting full support for Docker Compose, so you
can easily build any full-stack project in CodeSandbox. This will most likely
ship next week.

Oh, and did anyone say Dev Containers? 🤔 Stay tuned!

## Looking Ahead

As we begin this new year and I look back at these past 12 months, I could not
be prouder of all the amazing work we have been doing, building the most
polished, powerful and enjoyable cloud development platform.

Now that we have full support for Docker, you can run powerful development
environments for any type of work you’re doing. So, the question is no longer
“what can you build?”, but “what will you build?”.

I’m especially hyped about how we can use this to add official support for new
languages. But I won’t spoil anything for now!

Get started by checking out our
[Deno template](https://codesandbox.io/p/sandbox/xenodochial-cerf-kc6kgh) and
reading through our
[Documentation](https://codesandbox.io/docs/learn/environment/docker?utm_source=newsletter&utm_medium=email&utm_campaign=native-docker-support).
And keep an eye out for our [Twitter](https://twitter.com/codesandbox) and our
[Discord](https://discord.gg/C6vfhW3H6e)—we are kicking off 2023 full steam
ahead, so this is just the first of many exciting things we have coming up in
these next few weeks!
