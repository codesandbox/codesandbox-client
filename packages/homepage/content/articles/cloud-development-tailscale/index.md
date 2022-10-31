---
banner: ./images/cloud-development-tailscale.png
slug: cloud-development-tailscale
authors: ['AJ Foster']
photo: https://avatars.githubusercontent.com/u/2789166?v=4
title: Cloud development inside your network with Tailscale
description: How Tailscale can connect an application running in CodeSandbox to your private resources.
date: 2022-11-01
---

At CodeSandbox, we use CodeSandbox Repositories for the majority of our development work (working on the product, inside the product).
This cloud development workflow saves us a lot of time and effort.
However, we also have some services that are not available on the public internet — the kind of thing that a CodeSandbox Repository environment might not have access to.

Normally, to develop an application that requires access to internal resources, you have two choices: open up the internal resources to the world, or spend a lot of time mocking them in your development environment.
Neither option is particularly great, so we're excited to announce a partnership with [Tailscale](https://tailscale.com/) to bring CodeSandbox Repositories into your network.

## What is Tailscale?

Tailscale lets you easily manage access to private resources, quickly SSH into devices on your network, and work securely from anywhere in the world.
It uses a secure Wireguard mesh network to connect devices, virtual machines, and servers — and now CodeSandbox Repository environments — regardless of their location.

We use Tailscale at CodeSandbox to manage network access for private resources, including some of the services that make up CodeSandbox.
