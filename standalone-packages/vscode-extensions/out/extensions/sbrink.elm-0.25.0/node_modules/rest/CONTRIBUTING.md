_Thanks for your interest in rest.js.  Have something you'd like to contribute?
We welcome pull requests, but ask that you read this document first to
understand how best to submit them; what kind of changes are likely to be
accepted; and what to expect from the team when evaluating your submission._

_Please refer back to this document as a checklist before issuing any pull
request; this will save time for everyone!_


## Understand the basics

Not sure what a pull request is, or how to submit one?  Take a look at GitHub's
excellent [help documentation][] first.


## Search GitHub issues first; create an issue if necessary

Is there already an issue that addresses your concern?  Do a bit of searching
in our [issue tracker][] to see if you can find something similar. If not,
please create a new issue before submitting a pull request unless the change is
truly trivial, e.g. typo fixes, removing compiler warnings, etc.


## Discuss non-trivial contribution ideas with committers

If you're considering anything more than correcting a typo or fixing a minor
bug, please discuss it on the cujojs [mailing list][], or the #cujojs IRC
channel on freenode, before submitting a pull request. We're happy to provide
guidance but please research the subject on your own including searching the
mailing list for prior discussions.


## Create your branch from `dev`

At any given time, the `master` branch represents the latest stable release and
the `dev` branch the version currently under development. For example, if 3.1.1
was the latest release, `master` represents 3.1.1 while `dev` is 3.2.0
development. There may also be a `3.1.x` branch representing 3.1.2 development.

Create your topic branch to be submitted as a pull request from `dev`. The
team will consider your pull request for backporting to maintenance versions
(e.g. 3.1.2) on a case-by-case basis; you don't need to worry about submitting
anything for backporting.


## Use short branch names

Branches used when submitting pull requests should use succinct, lower-case,
dash (-) delimited names, such as 'fix-warnings', 'fix-typo', etc. In
[fork-and-edit][] cases, the GitHub default 'patch-1' is fine as well. This is
important, because branch names show up in the merge commits that result from
accepting pull requests, and should be as expressive and concise as possible.


## Mind the whitespace

Please carefully follow the whitespace and formatting conventions already
present in the framework.

1. Tabs, not spaces
1. Unix (LF), not dos (CRLF) line endings
1. Eliminate all trailing whitespace
1. Wrap JSDoc at 80 characters
1. Aim to wrap code at 80 characters, but favor readability over wrapping
1. Preserve existing formatting; i.e. do not reformat code for its own sake
1. Search the codebase using `git grep` and other tools to discover common
   naming conventions, etc.
1. utf8 encoding for JS sources, escape special characters


## Add MIT license block to all new source files

```javascript
/*
 * Copyright 2015 the original author or authors
 * @license MIT, see LICENSE.txt for details
 *
 * @author FirstName LastName <OptionalEmailAddress>
 */
```

If you are uncomfortable making the contribution under the MIT license, please
contact us before making a contribution.


## Update license header to modified files as necessary

Always check the date range in the license header. For example, if you've
modified a file in 2013 whose header still reads

```javascript
 * Copyright 2012 the original author or authors
```

then be sure to update it to 2013 appropriately

```javascript
 * Copyright 2012-2013 the original author or authors
```


## Use @since tags for newly-added public API types and methods

e.g.

```javascript
/**
 * ...
 *
 * @author First Last
 * @since 3.2
 * @see ...
 */
```


## Submit unit test cases for all behavior changes

Search the codebase to find related unit tests and add additional test methods.
Create new test cases for new modules.


## Squash commits

Use `git rebase --interactive`, `git add --patch` and other tools to "squash"
multiple commits into atomic changes. In addition to the man pages for git,
there are many resources online to help you understand how these tools work.
Here is one: http://book.git-scm.com/4_interactive_rebasing.html.


## Format commit messages

Please read and follow the [commit guidelines section of Pro Git][].

Most importantly, please format your commit messages in the following way
(adapted from the commit template in the link above):

    Short (50 chars or less) summary of changes

    More detailed explanatory text, if necessary. Wrap it to about 72
    characters or so. In some contexts, the first line is treated as the
    subject of an email and the rest of the text as the body. The blank
    line separating the summary from the body is critical (unless you omit
    the body entirely); tools like rebase can get confused if you run the
    two together.

    Further paragraphs come after blank lines.

     - Bullet points are okay, too

     - Typically a hyphen or asterisk is used for the bullet, preceded by a
       single space, with blank lines in between, but conventions vary here

    Issue: #9


1. Use imperative statements in the subject line, e.g. "Fix broken JSDoc link"
1. Begin the subject line sentence with a capitalized verb, e.g. "Add, Prune,
   Fix, Introduce, Avoid, etc"
1. Do not end the subject line with a period
1. Keep the subject line to 50 characters or less if possible
1. Wrap lines in the body at 72 characters or less
1. Mention associated issue(s) at the end of the commit comment, prefixed
   with "Issue: " as above
1. In the body of the commit message, explain how things worked before this
   commit, what has changed, and how things work now

For examples of this style, issue a `git log --author=cbeams` in the
spring-framework git repository. For convenience, here are several such commits:

https://github.com/SpringSource/spring-framework/commit/08e2669b84ec0faa2f7904441fe39ac70b65b078
https://github.com/SpringSource/spring-framework/commit/1d9d3e6ff79ce9f0eca03b02cd1df705925575da
https://github.com/SpringSource/spring-framework/commit/8e0b1c3a5f957af3049cfa0438317177e16d6de6
https://github.com/SpringSource/spring-framework/commit/b787a68f2050df179f7036b209aa741230a02477


## Run all tests prior to submission

See the building from source section of the README for instructions. Make sure
that all tests pass prior to submitting your pull request.


## Submit your pull request

Subject line:

Follow the same conventions for pull request subject lines as mentioned above
for commit message subject lines.

In the body:

1. Explain your use case. What led you to submit this change? Why were existing
    mechanisms in the framework insufficient? Make a case that this is a
    general-purpose problem and that yours is a general-purpose solution, etc.
1. Add any additional information and ask questions; start a conversation, or
    continue one from an existing issue
1. Mention the issue ID
1. Also mention that you have submitted the CLA as described above

Note that for pull requests containing a single commit, GitHub will default the
subject line and body of the pull request to match the subject line and body of
the commit message. This is fine, but please also include the items above in the
body of the request.


## Mention your pull request on the associated issue

Add a comment to the associated issue(s) linking to your new pull request.


## Expect discussion and rework

The cujoJS team takes a very conservative approach to accepting contributions to
the library. This is to keep code quality and stability as high as possible,
and to keep complexity at a minimum. Your changes, if accepted, may be heavily
modified prior to merging. You will retain "Author:" attribution for your Git
commits granted that the bulk of your changes remain intact. You may be asked to
rework the submission for style (as explained above) and/or substance. Again, we
strongly recommend discussing any serious submissions with the team _prior_ to
engaging in serious development work.

Note that you can always force push (`git push -f`) reworked / rebased commits
against the branch used to submit your pull request. i.e. you do not need to
issue a new pull request when asked to make changes.


[help documentation]: http://help.github.com/send-pull-requests
[issue tracker]: https://github.com/cujojs/rest/issues
[mailing list]: https://groups.google.com/forum/#!forum/cujojs
[fork-and-edit]: https://github.com/blog/844-forking-with-the-edit-button
[commit guidelines section of Pro Git]: http://progit.org/book/ch5-2.html#commit_guidelines
