**Sara Vieira:**

Hello, I'm Sara Vieira and this is the CodeSandbox Podcast. The key to success to any

developer relations problem is removing friction from getting started with something and using it

in your product. With CodeSandbox, you can skip the setup steps and code and deliver better

experience for developers that will grow your community. There's a lot to cover today. So we

have two guests this week. First, I'm going to talk to Peggy Rayzis. She's the engineering

manager over the developer experience organization at Apollo. This includes the devrel and the

education teams. Later on, I'll talk to Jing Chen. She's a front end developer at Shopify and a

former developer advocate at Nexmo. We'll discuss how her work as a community organizer

and developer and a developer advocate prepared her for developer relations.



**Sara Vieira:**

Hello, Peggy. It's nice to see you again.



**Peggy Rayzis:**

It's so great to see you, Sarah. It's been way too long.



**Sara Vieira:**

Okay. Just start by telling us a little bit about yourself, like what do you do? What makes you,

You?



**Peggy Rayzis:**

Absolutely. My name is Peggy Rayzis, and I am the Director of Developer Experience at Apollo.

If you're not familiar with Apollo, we make tools to help developers be successful with GraphQL

and to manage their data. My team's focus is to inspire and equip developers everywhere to be

successful with Apollo. I manage the managers of both the devrel and the education teams. We

put on various events for developers like our big GraphQL Summit. We make sure that we have

high quality documentation with each feature that we ship. We run our blog and produce really

high quality content for developers on GraphQL. And then we also just launched our new

learning platform, Odyssey, it's interactive video courses on Apollo and GraphQL. We just

watched the platform six weeks ago. The first course Liftoff, it gives you a really gentle

introduction to both the front end and the back end. You build your first schema, you populate it

with some mock data, you query it with Apollo Studio and then you connect it to a React App,

and the whole course is under 30 minutes.



**Sara Vieira:**

How did you get started with coding?



**Peggy Rayzis:**

So I started my journey about six years ago or so. I was actually working at Macy's in

merchandising. I was a buyer for bras and panties and a lot of my role was creating

spreadsheets and programming spreadsheets to run these automated reports. That was

sometimes my favorite part of the job, just tinkering around with that. It really got me thinking

like, "Hey, I like programming spreadsheets, maybe I would like programming websites too". So

I did a couple of online tutorials and just really fell in love with it. I would remember coming

home from work and getting so excited to do my coding tutorials. That's kind of what made me

have that light bulb moment that, "Hey, maybe this is something that I should make my full-time

career". So I decided to do a bootcamp program.



**Peggy Rayzis:**

I did Grace Hopper Academy, a three month program for women inside New York city. It was a

really awesome experience. I learned JavaScript, the bootcamp taught angular there, but while I

was there, I taught myself React. We learned a little bit of node, kind of computer science

fundamentals. At the end of the program, they had employers come. We did speed dating

interviews. Yeah, it was pretty cool. And that's how I ended up at major league soccer and

meeting Kurt who now works at Apollo as the manager of the devrel team. So it's funny how

things come full circle there. Yeah, that's how I got my start.



**Sara Vieira:**

Do you think that, from my experience, there's always a bit of developer relations or developer

advocacy in open source engineering. Do you see that as well?



**Peggy Rayzis:**

Absolutely! Because you could write the best software in the world, but if folks don't know how

to use it, it's never going to be adopted. Things like documentation, tutorials guides, being able

to help folks adopt your software, all that communication becomes so important. Without that,

your open source project is never going to gain adoption the way that you want. I think

sometimes folks overestimate the coding part of the job and underestimate the communication. I

think you really have to have both in order to have a successful open source project. You got to

be able to give developers that magic moment within five minutes of using your tool. That's why

CodeSandbox is so great because you can throw a live working example into your

documentation and developers can tinker around and play with it. Unless folks kind of have that

aha moment early on, you're just going to either get frustrated and want to punch their

computer, like you said, or they're just going to find another tool that has better documentation

and examples



**Sara Vieira:**

Do you think that your experience as a developer and as a software engineer helped you

become a better developer advocate? And, in what ways do you think that that actually helped?



**Peggy Rayzis:**

I think it's really important as a developer advocate to always put yourself in the shoes of the

developers that you're serving. I think like my experience at Major League Soccer, when I was

there, we were a very small team and we had a lot of backend for front end services that would

take all of the data from these various stats, databases, and content APIs, and aggregate them

into this Match Object that then we would send to the Web App and the Native Apps. We were

maintaining all this code, writing state management logic by hand, it was big pain. One day we

were like, "Hey, we've heard a lot about this GraphQL thing. Maybe it would be a good idea if we

just test it out and see if it solves our needs, because it seems like it would solve a lot of the

problems that we're having."



**Peggy Rayzis:**

We did a quick sprint on it and we're really able to be productive with it so quickly. Having that

experience as a developer and being able to experience that productivity boost firsthand, has

really given me a lot of energy into how I've performed my job at Apollo and been able to help

developers experience that magic moment too. I don't want to gatekeep and say," Oh, you have

to be an engineer before you're a developer advocate." I don't think that's true. I think there are

a lot of really awesome early career folks starting out, who might have different specialties with

producing video content or streaming or really great writers. They're able to be developer

advocates without having that engineering experience first. In my case, it was really helpful and

I'm really glad that I had that experience because it allowed me to empathize so much more with

the developer community that I'm serving.



**Sara Vieira:**

How would you define success as a developer advocate?



**Peggy Rayzis:**

I think this is universally a tricky problem to solve and other folks in devrel that I've talked to, no

matter how large or small your team is, this is something that everybody struggles with. You

have to look at it like what are the business goals? How has devrel uniquely equipped to help

with that? Some of the ways that we measure success is just how our content helping

developers adopt Apollo so we're looking at monthly active users .We talk a lot about like the

GraphQL journey. The things that a developer needs when they're just starting out on their

GraphQL journey are pretty different than the things that developer would need if they've been

doing GraphQL for maybe three years and they're working in a large enterprise and they're

trying to onboard more teams to the graph.



**Peggy Rayzis:**

It's really understanding what are the pain points in each stage of the journey and what features

does Apollo have to help alleviate those developer pain points? So, we try to tailor our content

to like each journey stage, measure the success based on, did they adopt the feature that we

were hoping they would adopt and setting up the data pipelines to track that. The other thing

that we track is community growth. One of the things that we actually started doing last year, we

partnered with a awesome startup called Orbit. I highly recommend folks in devrel, check them

out. If you haven't already, they essentially take all of your data from GitHub, Twitter, they have

integrations for Slack, Discourse, I believe as well. They also have an API so we feed our

events data into Orbit and they give you really awesome metrics on how your community is

growing.



**Peggy Rayzis:**

Their model is they think of folks in your community, as you are the center and the developers

are in your orbit and you want to try to pull them closer into your orbit by engaging with them,

inviting them to events, rewarding them for their Open Source Contributions. They have a really

great framework for measuring that. I highly suggest that other folks in devrel check it out

because it's been a huge boost in our productivity. We don't have these separate Google sheets

that we're maintaining anymore to track all that stuff. It does it all for us. The team has also been

really phenomenal as well and super responsive our feedback.



**Sara Vieira:**

Okay, so I think we're done with the questions today. We're also out of time. I just want to ask

you where can our listeners find you online?



**Peggy Rayzis:**

Absolutely! I think Twitter is probably the fastest, easiest place to reach me. I'm @PeggyRayzis

there. If you ever have any GraphQL questions, developer advocacy, management, life

questions, feel free to contact me there. I get a lot of messages, so I can't promise that I will

respond right away, but I will do my very best to try.



**Sara Vieira:**

Thank you so much for coming Peggy. It has been so fun to talk to you and it's been super

interesting as well. I haven't talked to you in forever, so thank you so much for coming.



**Peggy Rayzis:**

Yeah. Thank you for having me.



**Maurice Cherry:**

Next up, Sarah talks with Jing Chen from Shopify, more after the break.



**Sara Vieira:**

Hello Jing, how are you doing today?



**Huijing Chen:**

Hello, I'm good. It's been a million years since I last saw you. My name is Huijing and I'm

currently a front-end developer with Shopify. I joined them, it's almost coming up to a year now,

so pretty happy with the work that I do. I'm based in Singapore, at the moment. Because I'm in

Singapore, the pandemic lockdowns and restrictions are not that bad. I can still go climbing.

That's a thing that I do a lot nowadays. In a past life, years ago, I used to play basketball full

time.



**Sara Vieira:**

That part of the conversation is not done because you said ,"Full-time," but you didn't say that

you represented the Malaysia national team.



**Huijing Chen:**

Oh yes. But that's a segue.



**Sara Vieira:**

How did you get started with coding? What was your first project?



**Huijing Chen:**

I was with the Malaysian national team for a bit when I was much younger. The way it works is

that you train full time. Yo u train once in the morning, train once in the afternoon, but all the

other time is yours so we had a lot of downtime. I was the token IT person, for example, my

teammates would come and say, "Oh, the internet is not working. Oh, I can't get this printed. Oh,

my computer won't turn on. I think I have a virus." That was basically my job to fix everybody's

IT problems. My coach was, considerably elderly gentlemen, still very fit. I think at the time he

was already about in his sixties, seventies. He saw me with a computer and his thought was,

"You're good with computers, our association website hasn't been updated in a thousand years.



**Huijing Chen:**

Can you do something about it?" I said, "Yeah, I'll give it a shot. I got nothing better to do with

my life." I did that. I was armed with the amazing skill of knowing how to press right-click and

selecting inspect element. I also knew how to right-click and view source. I also knew how to

copy and paste. Armed with these exceptional skills, I proceeded to piece together a new

website. In hindsight, in retrospect, if the website hadn't been updated in three years or however

long, I could have done anything. I could have, I don't know, put up a picture of an elephant and

he'd be like, "Oh great." He looked at the update, he was said, "Oh, that's pretty good. I want to

add content to it." I was thinking that was not in the original spec.



**Huijing Chen:**

What do you mean you want to add more? That was not the deal. I did a second version, but

the long and short of it, I spent a lot of time doing this and I had a roommate at the time and she

was asking, "What are you doing? Why are you on your computer all the time?" "I'm building the

website." She asked, "Are you even getting paid for this?" I'm like “Shush”. Then I realized that I

am spending an inordinate amount of time figuring this out so I must like it somehow. That's how

I got started.



**Sara Vieira:**

Before you were a UX developer or front-end developer, you were a developer advocate. Was

speaking a part of your job as a developer advocate?



**Huijing Chen:**

I think one of the things that I learned about being a developer advocate is that speaking is

definitely part of it. Because there are many ways to engage developers as a developer

advocate, I think a fairly big part of it is being public I would say. Conferences or events where

people get to know you and then associate you with your company to a certain extent. It was

still being present and having a presence at events. That's definitely part of it. If you happen to

be a speaker, that's a plus as well. Because at the end of the day, if you're just in a booth,

people walk by, they interact with you, they, they get some [inaudible 00:15:05] . If you are a

speaker on stage, that is a boost as well. I would say that speaking was a fairly significant part

of being a developer advocate. Definitely. I think the best part about being a developer advocate

is the fact that you get to go out and meet people because the nature of the job is that you do

want to know how people feel like when they're using your APIs and things like that.



**Sara Vieira:**

When it comes to your experience as a developer, do you think it helped you becoming a better

developer advocate?



**Huijing Chen:**

I think it definitely did because I was lucky enough to work in a bunch of different industries. My

idea of what a developer advocate is, is you're someone who can bridge the gap between the

people who are using the product and the people who are actually building the product, so we're

kind of like that in between. Yo u have to know enough on both sides to be able to communicate.

You can't just get away with not being a developer.



**Sara Vieira:**

I get what do you mean like you have to be able to explain and to explain you need to

understand.



**Huijing Chen:**

A hundred percent.



**Sara Vieira:**

Where can our listeners find you online if they want to look for you?



**Huijing Chen:**

I'm on Twitter handle is H J underscore C H E N. Twitter is where it's easiest to ping me.



**Sara Vieira:**

Thank you so much for coming.



**Huijing Chen:**

Thank you for having me. Yeah. This is such a fun podcast like everyone should be on the

show. Hello. Subscribe, subscribe now.



**Sara Vieira:**

Thank you so much for listening to the show this week. If you want to find out more information,

visit us at codesandbox.io/csbpodcast. If you liked this episode, please share it on social media

as well. Use the #csbpodcast, or you can send us a tweet at @codesandbox. Our executive

producer is Maurice Cherry with additional production help from CeoraFord. Engineering and

editing are courtesy of Resonated Recordings. Of course, special thanks to Peggy Rayzis from

Apollo, Jing Chen from Shopify, as well as the entire team at CodeSandbox.