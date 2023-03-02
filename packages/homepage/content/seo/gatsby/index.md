---
banner: ./banner.png
slug: framework/gatsby
title: Gatsby js
description: Gatsby is an open-source web framework based on React.
---

Are you looking to learn more about Gatsby? If so, this article is for you.
Below we cover Gatsby’s basics and its advantages and disadvantages, before
answering the most frequently asked questions about the framework. Let’s dive
in.

---

# What is Gatsby?

[Gatsby](https://www.gatsbyjs.com) is an open-source web framework based on
React. It’s most commonly used as a static site generator when creating websites
and web applications. Gatsby allows developers to quickly build fast websites
using data sources like Markdown files, APIs, and databases.

Gatsby is similar to other static site generators like
[Jekyll](https://jekyllrb.com) and [Hugo](https://gohugo.io) in its ability to
generate static web pages from a set of Markdown files.

The JavaScript framework [Next.js](https://nextjs.org) is functionally similar
to Gatsby. Both frameworks are based on React and support static page
generation.

## How does Gatsby work?

Gatsby automates a lot of the high-level work needed to convert raw data from a
database or an API into a website. Its build process fetches the data needed to
generate the pages from relevant data sources, transforms it as needed, and
produces finished webpages.

Before we dive deeper, we’ll need to first go over static websites and GraphQL.

**Static websites: a quick summary** A static website is made up of
fixed-content web pages, meaning that every website visitor gets the same
webpage served to them. Pages can still be customized for each visitor with the
on-page HTML, CSS, and JavaScript, but all customization happens on the
frontend.

Static websites are popular today for two main reasons:

1. Static sites require little maintenance, as there are no backend servers to
   maintain. Developers frequently place a static website’s files into a cloud
   storage service like Amazon S3. The entire site is then handled by the
   storage service without any need for a dedicated web server.
2. Static websites are fast for end users. Because there is no dynamic content
   being generated, static web pages load quickly. It’s common to see the use of
   a content distribution network (CDN), which places copies of the static
   website in storage locations around the world. A site that’s available
   through a CDN can be accessed quickly around the globe.

**GraphQL: a quick summary** [GraphQL](https://graphql.org) is a query language
for APIs. By using GraphQL, developers can specify what data they need from a
data source and get a response from the API with exactly the data they
requested.

**Static sites and GraphQL in the context of Gatsby** Gatsby’s main purpose is
static site generation. When generating a site from a data source,
[Gatsby uses GraphQL](https://www.gatsbyjs.com/docs/graphql-concepts/) to expose
the data source’s data to the site’s pages. Each page requests the data it needs
from the underlying data sources using a GraphQL query, and Gatsby resolves the
query and supplies the relevant data at build time.

**Data sources in Gatsby** Gatsby supports a number of datastores through its
community plugins, from content management systems like WordPress and
Contentful, to databases like MongoDB and MySQL. A Gatsby website can rely on
multiple data sources and can transform the data from the sources as needed. We
go over these potential data sources in greater detail below.

## Benefits of using Gatsby

Gatsby has a number of unique features beneficial to static website creators.
Let’s look at these benefits and what they mean for developers working with
Gatsby.

**Integrations with data sources** One of Gatsby’s key features is easy
connection to data sources. Most static site generators, like Hugo and Jekyll,
can only use data from Markdown files to produce finished static webpages.
Gatsby, by contrast, can connect to many other data sources in addition to
parsing Markdown. Here are just a few of the data sources Gatsby supports
through plugins:

- WordPress
- Contentful
- Instagram
- A generic GraphQL API
- A generic REST API
- Airtable
- Drupal
- Google Sheets
- Ghost
- Git
- MongoDB
- Greenhouse
- GitHub API
- Stripe
- MySQL

These integrations enable Gatsby to quickly build static websites using headless
CMS systems like Contentful or Headless WordPress as sources of data. In
addition, developers can quickly add pages and blocks based on popular sources
like Instagram. Data sources like Greenhouse and Stripe make Gatsby a great fit
for internal business tooling.

**Use React inside Markdown files with MDX** Gatsby supports the
[MDX format](https://www.gatsbyjs.com/docs/mdx/) for the content of its Markdown
files. This means you can reference and reuse
[JSX code](https://reactjs.org/docs/introducing-jsx.html) across various
Markdown files without having to duplicate the relevant HTML code in different
sections of your website.

Here’s an example of how the MDX content could look:

    # chart.mdx
    import { Chart } from '../components/chart'
    # Here’s a chart
    The chart is rendered inside our MDX document.
    <Chart />

In this example, the Chart article contains a reference to both the Chart React
component and the Markdown content. MDX content gets converted into HTML at
build time, so the MDX pages are as fast for the end user as their plain
Markdown counterparts.

**Build websites from multiple sources with Gatsby Themes** Given all the data
sources Gatsby supports, you aren’t limited to just one per site. When building
Gatsby sites, It’s possible to combine various data sources, and Themes is a
feature that helps you keep the website’s look and feel consistent across all
its generated pages.

Check out the Gatsby blog post entitled
[_Using Themes for Distributed Docs_](https://www.gatsbyjs.com/blog/2019-07-03-using-themes-for-distributed-docs/)
\*\*to see how Apollo GraphQL used Gatsby Themes to build a large site with a
consistent set of design principles from multiple Git repos.

**Emphasis** **on community and the ecosystem** Out of all the static website
frameworks, Gatsby is the most focused on its community of users. In addition to
providing clear documentation on how to contribute to the framework, Gatsby
offers
[pair programming sessions](https://www.gatsbyjs.com/contributing/pair-programming/)
to contributors. Those interested in collaborating on bug fixes and new features
in Gatsby can connect with with more experienced developers and work together to
implement and merge changes.

Its emphasis on community means that Gatsby has a strong plugin ecosystem. Tasks
that you can solve with popular Gatsby plugins include everything from
[dynamically resizing images on your website](https://www.gatsbyjs.com/plugins/gatsby-plugin-imgix/)
to
[adding Typescript support](https://www.gatsbyjs.com/plugins/gatsby-plugin-typescript),
and everything in between.

## Drawbacks of using Gatsby

But there are a few things you should be aware of before you commit to using
Gatsby in production.

**GraphQL is embedded in the Gatsby architecture** GraphQL is deeply part of
Gatsby, with every data source, including REST APIs, needing to be queried using
GraphQL at build time. The requirement to use GraphQL often facilitates
site-building with Gatsby, but also comes with its own learning curve. For
developers unfamiliar with GraphQL, this strong dependence on GraphQL can be
challenging to understand.

**Performance** Some Gatsby users
[report](https://cra.mr/an-honest-review-of-gatsby/) that the build process of a
large Gatsby website takes significantly more time as compared with other static
site generators like Jekyll or Hugo. While Gatsby offers a commercial solution
that claims to speed up the builds, not all Gatsby users are ready to pay for a
hosted build system.

**Gatsby assumes page-based structure** Gatsby was created as a static website
generator, and it assumes that the site you’re building consists of multiple
pages with content. If you are building less of a content-focused website and
more of a web application, you will likely find this approach limiting.

**Not all datastores are supported through plugins** While many data sources are
supported by Gatsby plugins, you might need to create your own plugin if your
data source isn’t supported.

Next, let’s look at the use cases for which Gatsby can be a good fit.

## When to use Gatsby

Static site generators are a great choice when building websites and web
applications, and Gatsby definitely fares well in the static website generator
category. In addition, its plugin ecosystem makes it easy to quickly create a
static website from almost any data source. Here are a few use cases for which
Gatsby can be a great choice.

**Blogs and documentation sites** With its focus on content, Gatsby is a great
fit for any content-oriented website like a blog, a knowledge base, or an
electronic book.

**Internal dashboards** Gatsby data-source plugins can come in handy when
building internal dashboards, for example, the plugin for Stripe payments or the
plugin for the applicant tracking system Greenhouse. With other frameworks you
would need to fetch the data directly from the API from these services. But with
Gatsby, getting a simple site set up with these data sources can be as simple as
adding a set of API credentials and running `gatsby build`.

**MVPs and prototypes** With so many available plugins, Gatsby is a great
framework for quickly setting up proofs-of-concept, MVPs, and prototypes.

## Gatsby vs. Next.js: when to choose which?

Gatsby is frequently compared to [Next.js](https://nextjs.org), a somewhat
similar JavaScript framework. Here are a few differences between Gatsby and
Next.js to help you choose the right option for your project.

**Gatsby: optimized for static websites with few dynamic elements** As a static
site generation framework, Gatsby works best when building complex sites that
are mostly static. It’s definitely possible to add dynamic content to a Gatsby
site by using React components. However, if you are looking to heavily modify
the routing for your site, or to add user-specific pages like account pages or
e-commerce functionality, the Gatsby’s structure won’t be very helpful.

**Next.js: a web application framework with static website building
functionality** By contrast, Next.js is a web application framework recently
made capable of static website generation. As such, Next.js is a great fit for
complex web applications or for static sites with a significant amount of
dynamic on-page components. Next.js also lacks Gatsby’s plugin ecosystem for
supporting all kinds of data sources, so setting up a simple static website
would take longer with Next.js.

## Frequently asked questions (FAQ)

**Is Gatsby free?** Yes, Gatsby is a free, open-source framework. The company
behind Gatsby offers a commercial service,
[Gatsby Cloud](https://www.gatsbyjs.com/cloud/), that provides features like
hosted deployment workflows and previews for Gatsby sites, but you don’t have to
buy Gatsby Cloud to use Gatsby.

**Is Gatsby good for SEO?** Gatsby can be configured to make your site
SEO-friendly. For example, you can speed up the page load speed of your website
by taking advantage of Gatsby features like server-side rendering and speed
optimizations. Faster page speeds, apart from creating a better user experience,
are frequently said to improve search engine rankings. You can also use plugins
like `react-helmet` to add relevant `meta` sections to your website’s pages—the
search engines commonly reference the metadata for search indexing purposes.

**Why is Gatsby so fast?** Websites built with Gatsby according to web
development and JavaScript best practices can feel fast to end users. The main
reason for this is that Gatsby websites are generated at build time. Once a page
is generated, serving it to each user takes a very small amount of time.

**Does Gatsby use Redux?** Gatsby
[uses Redux internally](https://www.gatsbyjs.com/docs/data-storage-redux/) to
store and manipulate the state of the website during the build phase. Separately
from Gatsby’s internal use, it’s possible to use Redux in your own React
components in a Gatsby project.

**Does Gatsby work** **with WordPress?** Yes, Gatsby has multiple plugins that
make it easy to use a WordPress instance as a data source for a Gatsby website.
See the company’s guide entitled
[_Using Gatsby with WordPress_](https://www.gatsbyjs.com/guides/wordpress/) for
specific instructions on how to set Gatsby up with a WordPress backend.

---

# Summary

In this article we surveyed Gatsby, covering how it works, its advantages and
disadvantages for developers, and its common use cases . We also answered some
of the most common Gatsby-related questions in the FAQ section.

If you’d like to give Gatsby a try, check out the
[Gatsby tutorials](https://www.gatsbyjs.com/tutorial/).
