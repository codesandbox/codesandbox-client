---
banner: ./images/banner.png
slug: sandpack-ama-recap
authors: ["Adewale Abati"]
photo: https://avatars0.githubusercontent.com/u/4003538?s=460&v=4
title: AMA with the Sandpack team Recap
description: In this blog post, we feature a recap of the session, as well as questions from the community and answers from the team.
date: 2022-02-18
---

On Wednesday, Feb 2nd, members of the Sandpack team - [Danilo](https://twitter.com/danilowoz), [Jasper](https://twitter.com/JasperDeMoor) and [Alex](https://twitter.com/alexnmoldovan) hosted a live AMA (Ask Me Anything) with the CodeSandbox Discord Community. They answered questions about Sandpack, its licensing, different use cases and the roadmap for Sandpack.

In this blog post, we feature a recap of the session, as well as questions from the community and answers from the team.

### **Adewale opens the AMA:**

**Ace**: Hello **@here**! I want to welcome everyone to this webinar with members of the Sandpack team - **@DaniloWoz**, **@Alex Moldovan** and **@Jasper** - where we would be talking about what it was like building Sandpack, possibilities and opportunities and answering all questions you might have.

Hi **@DaniloWoz @Alex Moldovan @Jasper** thank you for joining us. Please introduce yourselves. You can tell us a bit about your past experiences outside CodeSandbox as well 🙂

**Danilo:** Hi, my name is Danilo Woznica, frontend developer at CodeSandbox. I’m one of the core maintainers of Sandpack, and you’ll probably see me on the main repository responding to issues, approving (or rejecting 😀) pull requests, and addressing new features in the React package.

**Alex**: Hey everyone! Welcome! My name is Alex, I'm joining from Cluj, 🇷🇴 Romania. I'm a Product Engineer at CodeSandbox, I worked on Sandpack for the first half of 2021, so you might not see me so active these days, but I'm still trying to be on top of the project. 🙂

**Jasper**: Hey, I'm Jasper, full-stack developer at CodeSandbox from Belgium. I mainly work on the bundler part of Sandpack, adding new transforms, performance improvements... Besides CodeSandbox, I also work on Parcel, another open source bundler.

**Ace**: Awesome! Thank you!

### Q1: It seems you all worked on different aspects on Sandpack over the last few months - can you share a bit about what aspect you worked on, and the story behind Sandpack?

**Alex:** Well I picked up the project back in December 2020. Ives had an early version of Sandpack (used to be named smooshpack 🙂) but it was really under the radar back then. So we decided to bring it up to date. I worked extensively on Sandpack during my first few months at CodeSandbox, trying to give the library the shape it has today. So you'll still see some of my contributions today around the React components and hooks that make up the react side of Sandpack. Around mid-year, I passed that torch to **@DaniloWoz.**

**Ace**: Oh that's exciting. We have a question from the community

### Q2: “How does this compare to just using embed functionality” - Peter

**Alex**: Embeds are way, way bigger in terms of the amount of stuff that happens, because you're loading the entire page in your page (albeit a streamlined version perhaps). We also have CodeSandbox embeds, but once you add 2-3 of them on the same page you really start to feel it moving slowly. With Sandpack, you integrate the code editor and all other components directly into your bundled application, so only the preview needs to run in a separate iframe. On top of performance, the fact that you can customize components directly is a huge advantage if you're building a custom solution. One good example is the [react-docs](https://beta.reactjs.org/) project, which relies on Sandpack components to run the interactive snippets.

**plondon:** Community member here, but another benefit to Sandpack vs embeds is that if you want to save the users code/progress you can store their changes yourself and rehydrate them when they return.

**Ace**: Thanks for the answer @Alex Moldovan, **Does this affect build time for personal blogs or integrations in anyway?**

**Alex**: Not really, the React components that are part of the Sandpack package are quite light and @DaniloWoz worked extensively in the past few months on SSR support and other performance/bundle size improvements.

### Q3: "Are there any contributing opportunities at Sandpack?" - Shahamsha

**Danilo**: Yes! There are a few issues where you can make your contributions right now:

- Good-first-issue: [https://github.com/codesandbox/sandpack/issues?q=is%3Aopen+is%3Aissue+label%3A"good+first+issue"](https://github.com/codesandbox/sandpack/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)
- Help wanted: [https://github.com/codesandbox/sandpack/issues?q=is%3Aopen+is%3Aissue+label%3A"help+wanted"](https://github.com/codesandbox/sandpack/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)

Plus, you can follow the [contribution guide](https://sandpack.codesandbox.io/docs/community#contribution-guide) to explore more contribution opportunities.

### Q4: "Will there be support for Sandpack on popular platforms like [dev.to](http://dev.to/) and similar?" - @Friday

**Alex**: Sure that's a possibility, but it's not really in our control. Right now, any platform running React can easily integrate the library. We are also looking into building a Docusaurus and mdx plugin for easy integration on static sites.

### Q5: "Do the code execute in the Browser like Stackblitz Webcontainers, or do they have to proxy to a server to process code and return a response?" - @PeterMbanugo

**Jasper**: Sandpack runs entirely in the browser, transpiling code in webworkers and executing everything inside an iframe. The only servers Sandpack uses are CDNs for fetching the node_modules.

**Ace**: I'm guessing this also explains @Alex Moldovan's answer earlier about Sandpack being light with massive improvements. **Are there any other optimizations from Sandpack that ensured this ease?**

**Danilo**: Yes, we've been working hard to bring more optimizations to Sandpack, both on the React package (such as SSR improvements, lazily loading heavy dependencies, and removing redundant code) and in the bundler side too (you can find more details here: [https://github.com/codesandbox/sandpack/issues/295](https://github.com/codesandbox/sandpack/issues/295)).

### Q6: “What are the commercial plans for Sandpack?” - Petty

**Tamas**: Chiming in for this question as I'm acting as a PM for Sandpack. Regarding the commercial plans, we consider Sandpack as an open sourced project for now but maybe in the future we will introduce some paid plans or features.

**Ace**: A follow up question to this @tamas (CSB Team) "can you give us any hint about what those features might be? `wink wink nudge nudge` sse? - **@plondon** 😄

**Tamas**: There is no concrete plan on this but yeah probably sse could be a paid feature!

### **Q7: Can I use Sandpack with other libraries? It’s only the React package that seems to be available, are there libraries for Vue etc?" - @EmmanuelOloke**

**Danilo**: Currently, we only support Sandpack React and we're still working to implement new features before porting it to another framework (Vue, for example). However, by using sandpack-client you technically can implement it in any JavaScript library.

For example, here's an amazing contribution from the community (not officially), which has started to port some features from Sandpack React to Vue [https://github.com/Destiner/sandpack-vue](https://github.com/Destiner/sandpack-vue).

**Ace**: To wrap up... @DannyRuchtie would like to know who your most favourite colleagues are @DaniloWoz @Alex Moldovan @Jasper 😄

**Alex**: I can't think of anyone other than @DannyRuchtie.

**Ace**: Thank you for joining us @DaniloWoz, @Alex Moldovan, @Jasper. It's been great learning more about Sandpack from you all.

As we go, I'd like to ask you all to leave us with your favorite use cases of Sandpack you've seen so far so we can all check it out.

**Danilo**: Love how React docs is using the SandpackCodeViewer component and how they leverage the decoration API to explain how the React API works: [https://beta.reactjs.org/reference/usestate](https://beta.reactjs.org/reference/usestate). Plus, [https://codeamigo.dev/](https://codeamigo.dev/), which brought the Sandpack integration to another level! Very impressed!

**Jasper**: I was amazed at how Blazepack [https://github.com/ameerthehacker/blazepack](https://github.com/ameerthehacker/blazepack) was created, enabling anyone to have the same fast prototyping experience sandpack provides locally with their known editors.

**Ace**: Oh awesome! Thank you and have a great rest of your day!

---

The goal of CodeSandbox is to make development accessible for everyone. With Sandpack we make it easier for anyone to add interactive documentation, so people can learn by doing. Next to that, we see the development of Sandpack as a great driver for traffic to our core product CodeSandbox.

For Sandpack, we don’t have immediate plans to monetize it and want to make sure the core service remains free for everyone to use, but we might explore adding services on top of Sandpack in the future. This means that everything you’re using Sandpack for today, will stay free.

If you have additional questions, or want to show us what you’ve built with Sandpack, you can share with us on [Twitter](https://twitter.com/codesandbox) or on our [Discord community](https://discord.gg/Pr4ft3gBTx).