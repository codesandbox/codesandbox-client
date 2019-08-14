---
title: 'Deploying your Sandbox'
authors: ['arthurdenner', 'CompuIves']
description: "It's possible to deploy your app directly from CodeSandbox"
---

## What Sandboxes Can be Deployed?

To deploy your app, you need to own the sandbox, so you'll have to fork a
sandbox you don’t own.

## Zeit

To deploy to [Now](https://zeit.co/now), access the Preferences menu and select
the Integrations tab. Log into your ZEIT account and it’s all set.. Log into
your ZEIT account and it's all set.

### Deploying

Go to any of your sandboxes, click in the Deployment menu (the rocket icon in
the sidebar) and click in "Now". You'll need to sign in to
[Now](https://zeit.co/now) when you're deploying for the first time. After
you've signed in, you will be able to click "Deploy Now". It will deploy the
sandbox and give you a URL.

### More Features

You can see an overview of all deployments you've made previously. Use this
overview to delete your previous deploys or to visit the website.

## Netlify

With [Netlify](https://netlify.com) you don't even need to connect to your
account. This means you can create deployments to share and use even if you
don't have a [Netlify](https://netlify.com) account so there is no friction.

As to any services, some templates are better than others, but as of now, we
have a good number of templates that support [Netlify](https://netlify.com)
deployments:

- React
- Vue
- Preact
- Nuxt
- Parcel
- Static
- CxJS
- Styleguidist
- Typescript Variants of React and Parcel
- Gatsby

We will work on making more and more templates available in the future.

### Deploying

Go to any of your sandboxes that are supported, click in the Deployment menu
(the rocket icon in the sidebar) and click in "[Netlify](https://netlify.com)".
Click the "Deploy" button to start a new deploy. As the sandbox builds, you can
view the logs of the build to see if something went wrong. When the build
finishes, you'll get a link to the deployed site. You can also claim the site to
add it to your Netlify dashboard.

### More Features

You don't need to sign in so if you want to add a sandbox deployment to your
account you can click the "Claim Site" button and the deployed sandbox will be
added to your netlifly account.

## UI

![Deployment Sidebar](./images/deployment-sidebar.png)
