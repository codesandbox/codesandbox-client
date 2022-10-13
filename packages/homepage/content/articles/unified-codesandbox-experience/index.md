---
banner: ./images/banner.png
slug: a-unified-codesandbox-experience
authors: ['Ives van Hoorne']
photo: https://avatars0.githubusercontent.com/u/587016?s=460&v=4
title: A Unified CodeSandbox Experience
description:
  We're integrating the new experience into CodeSandbox so you can use it to
  code anything from idea to production.
date: 2022-10-06
---

For the last 18 months, we have been working on Projects, a new CodeSandbox
experience that’s significantly more powerful than anything we have created
before.

During this time, we took every chance we got to talk to our users and learn how
we can improve their development workflow. The overwhelmingly positive feedback
we’re receiving makes us believe that we created a new experience that works
incredibly well.

Today, we’re integrating this new experience into CodeSandbox so you can use it
to code anything from idea to production.

## **Projects is now Repositories**

During these months of open beta, Projects grew quickly. We made some key
improvements to our editor, our dashboard, the integrations with VS Code and
GitHub, and our micro VMs.

As a result, we’ve seen Projects' adoption take off, especially with dev teams
at companies like Adverity, who realize just how much time and effort they save
by using Projects for their workflow:

> I looked at a PR, made some changes together with Bartosz Wisniewski,
> previewed them live and pushed them. All without checking out anything
> locally. This probably saved me 1 hour right now. HUUGE win! —
> [Dominik Dorfmeister](https://twitter.com/TkDodo)

To us, it’s clear that this is part of our core product offering. This means
that we need to provide more clarity on what the experience brings and how it
fits with everything else that CodeSandbox provides.

So, today we’re announcing that Projects has been officially renamed to
[Repositories](https://codesandbox.io/dashboard/repositories). With this name
change, our goal is to make it clear that Repositories tailor to an improved git
workflow powered by the cloud.

With Repositories, we automatically create a new sandbox for every branch, and
these sandboxes are automatically connected to git.

![branch-workflow](./images/branch-workflow.gif)

Because we run every branch on a fast micro VM, you can branch any repo within 2
seconds, see the code running immediately, work on a branch, share it with your
colleagues, quickly make/review changes and open a pull request.

Much like the feedback from Adverity I shared above, most devs using
Repositories are highlighting a handful of ways why they get a lot of value by
implementing this on their workflow:

- Being able to code from anywhere (as illustrated by
  [this testimonial](https://twitter.com/creativiii/status/1567118144291966981))
- Saving hours every week creating and reviewing PRs, by having an editable
  deployment preview for every PR
- Working with complex setups with no restrictions
- Sharing code easily with anyone, jumping on live sessions when needed
- Simplifying the process of working with team members

**So, if you were already using Projects, what does this mean for you?**

We made it a requirement to have as little impact as possible. You will not
encounter any breaking changes, but you will notice some layout changes in our
dashboard, as I will explore in the next section.

In case you were using our previous version of “Repositories”, you will now find
them under “Synced sandboxes”, to make a clear distinction between those (which
lack a fluid source control experience) and our Repositories flow.

## **Unified Dashboard**

While we were rolling out CodeSandbox Projects, we kept it separate from the
full dashboard experience. This allowed us to get some insights about Projects
(now Repositories) as a self-contained development workflow.

Now that we’re making Repositories part of our product offering, we have unified
our dashboard to provide a seamless workflow.

In the [new dashboard](https://codesandbox.io/dashboard/), you will find:

- Repositories (formerly Projects)
- Sandboxes
- Cloud Beta Sandboxes (new)
- Synced sandboxes (formerly Repositories)

To help you navigate these changes, we added notifications across the new
dashboard pages to highlight all the key updates.

![pick-up](https://assets.codesandbox.io/emails/2022/10/unified-experience/screenshot/02-2.jpg)

## **Introducing Cloud Sandboxes**

As you probably know, our sandboxes ran everything on your browser, using the
resources of your device. This meant that you could stumble into limitations
when working on a complex project or working from a low-spec machine.

With so many users relying on our sandboxes to learn, experiment and code, we
wanted to remove the constraints of running code in the browser—truly making
coding accessible to anyone.

Today, we are doing exactly that by releasing Cloud Sandboxes—a new and improved
sandboxing experience that, instead of running the code on your browser, runs it
on a fast micro VM. This means that you can code anything, virtually with no
limits, regardless of the specs of your own device.

![cloud-sandbox](https://assets.codesandbox.io/emails/2022/10/unified-experience/screenshot/03.jpg)

And these Cloud Sandboxes are fast too! You can fork anything within 2 seconds
and just keep on working. Thanks to
[memory snapshotting](https://codesandbox.io/post/how-we-clone-a-running-vm-in-2-seconds),
we can also spin up a sandbox with running dev servers within 1 second.

Because these Cloud Sandboxes have built-in Docker support, you can go as far as
you’d like—code server-side apps, bring in databases and add servers to your
sandbox.

Take them for a spin using our [new templates](https://codesandbox.io/s/)!

## **Improved Editor Experience**

A code editor is a matter of personal preference that can greatly impact your
productivity. As we take this step forward towards a unified CodeSandbox
experience, we’re making two key improvements to the editing experience.

First, we are bringing our new editor to Cloud Sandboxes. This editor was built
from the ground up, with a minimal interface that put the focus on coding. We
have made several improvements since releasing it together with Repositories
earlier this year and are excited to make it available to everyone using our
Cloud Sandboxes.

![editor-experience](https://storage.googleapis.com/assets.codesandbox.io/emails/2022/10/unified-experience/screenshot/04-2.jpg)

All your existing browser-based sandboxes will keep using the same editor you
know and love. Meanwhile, you can try out Cloud Sandboxes by
[starting from a template](https://codesandbox.io/s/)—just bear in mind that
these sandboxes are in beta and lack some features of browser sandboxes, such as
embeds and themes (we’re working on making those available soon).

Second, and more importantly, this shift to cloud-powered sandboxes means that
CodeSandbox is now fully editor-agnostic. By breaking free from the limitations
of running code in the browser, we now allow you to choose if you want to code
in Cloud Sandboxes from our web editor or from our iOS app. If you are coding in
Repositories, you can also choose to code right from VS Code.

This seamless integration allows you to switch back and forth between our
editors without skipping a beat. See more details in our
[Docs](https://codesandbox.io/docs/projects/learn/introduction/overview).

## **A Faster, More Powerful Development Flow**

With this update, our goal is to empower users like you to quickly go from idea
to production by providing an instant, limitless development environment.

By leveraging the power of the cloud, we allow you to code anything, anywhere,
from any device, and collaborate with anyone by simply sharing a URL.

[Take a look at what’s new](https://codesandbox.io/dashboard/) and improve your
development workflow!
