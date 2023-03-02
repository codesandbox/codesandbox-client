Matt Biilmann: There was a lot of grinding on finding the right product market
fit, the right vision and long, long, long nights of coding.

Maurice Cherry: This is Version One, a new podcast from CodeSandbox about the
product development journey of some of the web's most talked about tools and
resources from the makers behind them.

Maurice Cherry: Meet Matt Biilmann. Matt is the co-founder and CEO of Netlify,
the modern platform for high-performance websites and apps. Today, Netlify has
onboarded over a million businesses and developers with over 300,000 sites
created on the platform per month. Dozens of big companies use Netlify,
including Figma, Shopify, MailChimp, and Nike.

Maurice Cherry: But to get to the heart of the story of Netlify and how it came
to be, you have to know more about Matt. It's the year 2000. iTunes just made
its debut at the Macworld expo in San Francisco. The PlayStation two, it was the
hottest selling video game console on the market. And Matt, well, he was a
student at the University of Copenhagen in Denmark. But for someone who would
one day found one of the Internet's fastest growing development platforms, you
might assume he was knee deep in code and computer science, right?

Matt Biilmann: I was studying musicology at the University of Copenhagen with a
side in comparative literature, and started on a master's in cultural studies,
got an internship at the main publisher in Denmark. A public service broadcaster
called the Danish Radio, where I started working as a musical journalist.

Maurice Cherry: Classical music, contemporary classical music, jazz. Think
almost famous, but instead of following rock bands and meeting Kate Hudson, Matt
was on his own journey.

Matt Biilmann: I was really at the time finishing up my studies, getting ready
to write my master's thesis and working as a musical journalist, doing a lot of
concert reviews, album reviews, writing and so on. But at the side I always had
programming as one of my big passions and my biggest hobby. I got a Commodore 64
back when I was about 10 years old and instantly got extremely fascinated with
the idea that you could just write some letters and then you would get this
interactive world in a computer that could do stuff and never got tired of that.

Maurice Cherry: Wow. You have to understand that the world of personal computers
back then was nothing like it was now. No apps, no internet even. Just a cursor,
a blank screen, and if you were lucky, a little knowledge of [DAS 00:02:54] or
basic. In 2004, after a pretty successful run as a music journalist, Matt to
Spain and settled in Madrid, which unfortunately was not really a hot market for
writing about music and Danish.

Matt Biilmann: So I had to start coming up with a plan B if I wanted to stay
there. So I went back to just my passion for programming and for building stuff
and started building a couple of projects. I got an offer working remotely for a
Denver based startup back in the days around the time where everybody were
either getting into mobile gaming or social networking. And they were a social
networking startup. I became a rails engineer there and quickly became one of
the core engineers building out that beta.

Matt Biilmann: The company itself didn't really become a thing, but it led me to
then get hired by a Spanish web company, starting out as a senior rails
developer, then moving into a technical lead role then into a technical director
role. And then I became the CTO of the company.

Maurice Cherry: That company was Domestica. Today, domestica is a massive online
community for creatives, but they started out building websites for small to
medium businesses all over Europe.

Matt Biilmann: We would build something like a hundred websites a week. I led
the [Brighton 00:04:20] engineering team that built the whole platform that
designers would use to do the design with, that clients would use for content
management and that powered every single website from initial brief, all the way
to production hosting.

Maurice Cherry: This gave Matt an idea to create a new cloud-based CMS service
with Domestica, which became his first business, [Webpop 00:04:43].

Matt Biilmann: It came from our experience in Domestica of building this
internal platform for the service part of the business. So we had built a
platform that was serving tens of thousands of sites from everything, including
commercial pages or e-commerce or community pages or private areas. So all the
functionalities that you would typically build for small to medium businesses.

Matt Biilmann: And we thought it would be really cool to take our whole
experience of building even civil iterations of that internal platform, and then
build a cloud hosted CMS service that other agencies and other professionals
could use when they were building sites for their clients, to get some of the
same efficiencies of being able to really control the design and build real
experiences, but do it in a really efficient manner. And without having to worry
about the infrastructure components and the operational components or any of
that.

Maurice Cherry: Webpop was a hit, but Matt was already thinking well into the
future.

Matt Biilmann: We build out Webpop and got to a point where we had some
traction, had some cool clients like the Guardian or United Health Care and the
like, and people were building real stuff with it. And I was starting to see
that while I was really proud of what we were building with Webpop from an
experience standpoint and how it worked, I started feeling that the architecture
of the web would fundamentally move away from this idea of one monolithic
platform, one monolithic application for each website, whether multitenant or
not.

Maurice Cherry: Matt had a vision and while Webpop was good for now, his sights
were set on something much higher. But how would he get there? Maybe with a
balloon? More from Matt after the break.

Maurice Cherry: And we're back. Matt has a choice to make. Webpop is doing
really well and has some big name clients and it's gaining momentum, but he also
sees a new opportunity. Actually, he sees three new opportunities. I'll let Matt
explain.

Matt Biilmann: One was the emergence of GitHub that really made version control
a core primitive for how developers work together and also friended developers.
And at the same time, the modern browser really went from being more of a
document viewer to really becoming an operating system where you could actually
write applications that ran in JavaScript amd today, even web assembly. And you
started having this API economy of services like Stripe and so on available
directly from the browser.

Matt Biilmann: There was suddenly something happening where it started really
making sense to think of completely decoupling the front end presentation there,
having a built and deployment process just for that layer. And then turning the
backend into not this big monolithic application, but all of these clearly
defined APIs and services.

Matt Biilmann: So I started getting this feeling that while I was proud of
Webpop, and while I saw a real potential in building a business around it, I
felt that Webpop's architecture represented the past and not the future. If you
really embrace that architecture of completely decoupling the front end
presentation layer from the API layer, how would the architecture look like, and
what would the tooling look like that developers would need to build and ship
with confidence?

Matt Biilmann: And then I thought, "Okay, if I have a vision for how that would
look like, what would the smallest possible version of that look like?"

Maurice Cherry: It would look like a balloon. A bit balloon, which is what Matt
ended up calling this new platform. Matt used some of the infrastructure from
Webpop, spent weeks building an MVP and adding subscription and payment features
and did a small launch to get feedback from a group of early adopters. This
feedback was crucial.

Matt Biilmann: It's this minimal first step, a step towards something bigger, or
is it just something that doesn't really resonate? And what I learned quickly
when I put it out there was that it resonated. That the right kind of early
adopter that shared this view of the front end layer, decoupling into its own
thing and being much more of a serious software development platform, they
really got it and quickly became interested.

Matt Biilmann: Once Bitballoon was out there and I started seeing that it had
some traction and that there was something there, I started reaching out and
talking to one of my best friends back from Denmark, Chris, who I've known way
back since high school.

Maurice Cherry: The Chris that Matt's talking about here is Christian Bach, the
current president at Netlify.

Matt Biilmann: We used to go to a lot of jazz concerts together and think that
someday we would build a jazz club.

Maurice Cherry: Like Matt, Chris also had built a career for himself in tech. He
started his own production company called Capsize Productions, and later sold
that to a full service ad agency where Chris became a partner and the chief
digital officer. Not too shabby, right? With Bitballoon on the rise, this was
the perfect time for Chris and Matt to work together.

Matt Biilmann: Chris could obviously see that the idea of going to his client
and saying, "Do you want to have something that's faster, simpler, cheaper, and
more secure?" Seemed like a really clear sell. But what we could see on the
other end was if you went to his team in his agency world and said, "Let's just
go build with this architecture." Then we also could really see why isn't
everybody doing that right now?

Maurice Cherry: Everybody wasn't doing that right now because, well, it's a lot
of work. We're not talking about a simple out of the box implementation here.
You have to put together your own CICB pipeline, object story, CDN acceleration,
figure out cash and validation, figuring out how to do atomic deploys, figure
out how to trigger bills when your headless CMS updates, figure out how to
integrate that headless CMS into the build process. I mean, I'm getting winded
just saying all of that. How do you even package all that into something that
businesses can easily use?

Matt Biilmann: So Chris and I really started talking through what would the
product look like that could really give developers one solution for that whole
workflow, for actually building with this new architecture? And what we came up
with there was the blueprint for Netlify. And then we worked on building on top
of what I had from Bitballoon and adding this whole workflow layer to it, and
then launched Netlify out of private beta in March, 2015. Just the two of us
bootstrapping.

Maurice Cherry: After the break, Netlify version one.

Maurice Cherry: We're back. Matt and Chris just the launched Netlify out of
private beta. Congratulations, it's a startup. But how exactly are they going to
convince people to use it? Word of mouth? That only goes so far. Twitter? Well,
that could help, but you need more than just Twitter. What you need are circles,
not Google Play circles though. Do you remember Google Play, with the circles
for the little social networks? Yeah, neither do I.

Matt Biilmann: It starts with a core group of early adopters that are trying new
things and really pushing the leading edge. And then they start showing the
world how that's done. And then there's a next trickle of adopters that start
picking up and so on. So we made a list of 20 people or organizations or
agencies that we had to get in front of and just manually had to find a way to
show the product to, and get to interact with it. So we got it in front of those
people and a lot of those became really early evangelists. Some of those became
our early angel investors and that became a really important starting point.

Matt Biilmann: And then early on, we started also really a strategy around
building our content marketing. We saw that because this was a really new
approach to building for the web, there was a really big need for developers to
be able to read about how to actually build in this way. So we set an ambitious
goal of finding one way or another to publishing two blog posts every week and
just hammered at that.

Matt Biilmann: And then the layer on top of that was then also open source
adoption. So early on, we really made sure that we gave as much as we could away
for free to open source projects so they could use this for their documentation
sites and public facing sites, both because we always liked the idea of being a
really active participant in open source community and giving back there. But
also because, of course the main maintainers of big open source projects are
some of the big voices in the developer community.

Maurice Cherry: While it may sound like getting traction for Netlify went pretty
smoothly, there were also some setbacks.

Matt Biilmann: We were two people, and as the main technical co-founder it built
an edge network and a CICD pipeline and a CLI tool and an API, and even started
an open-source CMS project around this and had to produce two blog posts a week
in one way or another. There was also no operations team or anything. If a pager
went off, it went to me. And if an enterprise customer wanted to talk to their
dedicated account manager, there were no other dedicated account manager than me
and Chris. There was a lot of just really grinding on finding the right product
market fit, the right vision and long, long, long nights of coding. It's hard to
build a access service, right?

Maurice Cherry: He's right. It is. But Netlify really started to capture
people's imaginations. And luckily the market responded in turn. In 2015, Matt
met Vitaly Friedman, the founder of the popular design website Smashing
Magazine. When Matt helped Smashing migrate from their old WordPress setup to
Netlify, that's when business really took off.

Matt Biilmann: That article in many ways, became the kickstart for us to go out
and raise our first round of financing. We got a really great group of angel
investors on board, like Tom Preston-Werner from GitHub, the founders of
[inaudible 00:15:33], founders of Rackspace Cloud, and so on that really came in
with a lot of experience. And again, gave us a lot of validation of we are onto
something here. This is something real. And of course, closing that initial seat
funding round and being able to start growing the team, hiring the first
engineers and so on, that was a big milestone.

Matt Biilmann: In early days, of course you have to constantly question, is this
the right thing? But I think there was two key components. One was that I
really, from the depth of my gut, had the feeling that we were onto something.
That this category change would happen and it was right. And the other was that
getting to do that with my best friend, Chris, in San Francisco together, and
really pour ourselves into building something, that was also just in itself,
such a rewarding process. That it wasn't so much about just where this journey
would take us, but also about the journey itself really being rewarding. It's
been a really exciting journey with a lot of big milestones along the way.

Maurice Cherry: Thank you so much for listening to the first episode of Version
One. For more information about the show, visit us at codesandbox.io/versionone.
That's all one word. Or you can send us a tweet at CodeSandbox. This podcast is
produced by Maurice Cherry, with engineering and editing from Resonate
Recordings. The song you're listening to now, that's I Don't Mind from Particle
House, courtesy of Epidemic Sound. Special thanks to Matt Biilmann and Kelly
Tenn from Netlify. And of course the entire team at CodeSandbox. I'm Maurice
Cherry, and this is Version One. See you next time.
