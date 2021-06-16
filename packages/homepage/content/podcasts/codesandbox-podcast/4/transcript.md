Sara:
Hello, I'm Sara Vieira and this is the CodeSandbox Podcast. In this episode, we're going to talk about learning. As new web technologies emerge and evolve sometimes the best way to learn is to take a hands-on approach. No one knows this better than our guest for this episode, Kent C. Dodds. Kent is a JavaScript software engineer and a full-time web development educator. [inaudible 00:00:29] a hundreds of thousands of people on how to make the world a better place with quality software. We talked about his transition into working for himself, his philosophy behind teaching and learning and how he balances and maintains all the educational contents he creates.

Sara:
Hello Kent. Its really nice to see you.

Kent:
It's good to be seen. It's good to see you too.

Sara:
Tell us a little bit about yourself, what do you do, any hobbies or like what makes Kent, Kent?

Kent:
Yeah, so I am a husband and father. I have four kids and a dog, and we live in Utah in the United States and I am a full-time educator. So I worked at a couple of companies. PayPal was my last company and then just over two years ago, I decided I wanted to do the thing that I was doing on the side full-time. And so I went full-time educator and I've been doing that for a while and it's been awesome. I teach a lot about testing and React, a lot of JavaScript stuff. So I have testingjavascript.com and epicreact.dev. I also teach on egghead.io and Frontend Masters and some stuff on there too.

Sara:
What was the transition like when you changed from being a full-time dev, like the muggles, us, to like a full-time educator.

Kent:
I'm a pretty fiscally conservative person. I don't like to take big risks, especially as the father of four kids. And my wife is a full-time mom, so I'm the only source of income for our family. And so I wanted to make sure that it was going to be a solid transition, we weren't going to be taking a big risk or anything. So I probably could have gone off on my own as a full-time educator much earlier, but yeah, by the time I went full-time educator, it was just an obvious decision. The transition, it wasn't a huge thing.

Kent:
My biggest fear was that I would end up being like my college professors who clearly hadn't been in industry in a quite some time. And so what I learned from them and then what I experienced in the real world, where several years different. And so I, that was my biggest fear. And I've been able to keep up with what is going on in development world, just because the way that I am and so that hasn't really been a problem for me. So the transition, it just meant that I got to spend more time with my family, rather than doing all of my side stuff in the evenings. I was able to just move side stuff to the daytime and then my evenings were free. That was nice.

Sara:
What kind of work were you doing before? Like, not just PayPal, but in general, how did you start in tech?

Kent:
I got started in tech when I joined onto this company and they wanted me to take DVDs and videos from another internet site, which we had permission to download and put them up on various YouTube channels. This was a manual process. They did not hire me to be a programmer or anything. But at the same time I was taking a programming class in Java and I realized like how ridiculously boring it is to drag and drop or select files to upload to YouTube. I decided, I think I can automate some of this and so I built a program. It would automatically rip the DVD, so all I had to do is stick a DVD in and when my program was done, that video was up on YouTube. And then for the videos we would download, I just pointed it to the site and it would go scrape the site for all the links that we needed to download. And it would even use like meta-tags and all of that so I didn't have to come up with the description or title of the video to upload it all.

Kent:
So I probably spent just about almost as much time coding it as I would have if I'd just done it manually. That was the first time that I wrote a program that I thought was like, oh, programming isn't just about like, writing your own compiler for the fun of it or implementing a linked list or some data structure or whatever, there's practical things that I can do to write software. That's kind of where I got my start. I was still in school at the time, it was an internship, but that's really where I got my start into programming.

Sara:
So your first interaction with programming was at school. I'm just going to be very honest right now, like mine was MySpace.

Kent:
Yeah, yeah. Well, I toyed around with HTML and stuff and CSS, as a teenager, nothing really substantial. I maybe spent like three hours on it my entire teenage years. I actually... The most programming that I did as a teenager is, if you can count this is Age of Empires or StarCraft or Warcraft campaigns, like custom campaigns, where you can say like, when this character gets into this space, then do this thing. And that actually was super fun. I remember I would recreate books like storylines from books in the game. And then I had a lot of fun doing that as a teenager.

Sara:
I think a bigger part of why you became... So let's call it known in the React and JavaScript community was open source. When did you start getting into opensource?

Kent:
I remember when I was building that little program for work with the DVDs and stuff, I stored everything in Dropbox. And we didn't have known modules or anything back then so it wasn't a huge deal. But I did remember I would edit it over here and then I would try to use a different computer and I'd have those conflict files that you had to fix and like, there's got to be a better way. It turns out there was, it was Git.

Kent:
And so I started using Git, but when you start using Git, you need to have a place to put things. I started using Bitbucket and then found GitHub. And I was like, "Oh, okay. This is interesting." And I just naturally made everything open source and I decided to make it my first open source library. This was Genie JS kind of like Alfred for the Web or like a spotlight for the web sort of thing. I used it in a hack night and I ended up getting my first full-time job that night. It was awesome. I made this open source thing and added it to our work project and now I have a job.

Sara:
Do you still do open source right now?

Kent:
Oh yeah, yeah. I'm very involved in open source. I created Testing library. A lot of folks have probably heard of that. It is very widely used. And so yeah, there are implementations for any framework and any place you'll find it on, you can find a testing library for that tool. There are an army of maintainers who maintained the various packages of Testing library, and they are doing a marvelous job. Like I've got over a 100 packages on [inaudible 00:06:54]. So I have plenty of open source stuff that I'm still working on and enjoy maintaining.

Kent:
I'm typically the person who's like, let me solve this for my problem and make it generally useful for most people. And then I pretty much stop working on it until I run into a problem with it. And so if other people have issues with it, then they can make poll requests and whatever, and I'm willing to manage that. But at some point, like with Testing library, most of the issues and things that came in were something about the docs need to be improved or people just misunderstood, they're just asking you a question. Like there's nothing fundamental about the library anymore. And that's where I like to do my work. I like to lay the foundation, get things going in the right direction. Once it's in the right direction, I'm fine handing it off and moving on to my next thing.

Sara:
You need to say your boundaries like that, otherwise you're just going to work yourself to burn out.

Kent:
For the most part, I've been able to avoid burnout pretty well. And my strategy is, if it's not my problem or I don't just want to work on it for the fun of it, then I won't work on it and I'll just ignore it for the most part. That seems heartless but when you have hundreds of people asking for your time, it's the only way to be sustainable. What would be really heartless is to burn myself out and then I can't be available for anyone. And so I'd rather seem a little bit heartless when I ignore people than actually be heartless by burning myself out and impacting my relationships with my family and then not being of use to anybody anyway.

Sara:
Yeah. And I think that's completely valid. I think that's how a lot of us have to start doing things. I think a lot of the problems that come with this art that we are unable to say no to things.

Sara:
What were the biggest difficulties that you have in what you do now and how do you overcome these difficulties?

Kent:
My ultimate goal, like the number one thing for everything that I create is, how do I make sure that people remember this after we're done? Because if they can't remember, then the entire experience was worthless. So I spent a lot of time thinking about how do I make sure that retention is high for what I'm teaching. And so that involves a lot of thoughtfulness around the exercises and the way I deliver the material. That's a pretty significant challenge.

Kent:
Another emotional challenge is the frustration that I have in myself with my pace. I feel like I, I have so many ideas and so many things that I want to accomplish, but I don't have the time to get it done, especially with COVID.

Sara:
When it comes to your work, what are some of the courses or offerings, whatever you want to call it, that you have out there right now?

Kent:
I put everything on my courses page on my website. So you can go to kentcdodds.com/courses. And the two biggest ones for me, this is both where I get most of my income as well as where most of the value that I provide to people is on epicreact.dev, and then testingjavascript.com. There's a little bit from Egghead and Frontend Masters and stuff, but yeah, it's mostly Epic React and Testing JavaScript.

Kent:
The company mission for Kent C. Dodds Tech LLC is to make the world a better place through quality software by teaching quality software. So both of these are my efforts to do that sustainably. So that's why I charge for that. I have tons of stuff that's free that pushes the mission forward, and that stuff is supported by these. To give an idea of scope, like some people will look at this and be like, "Okay, so it's a Udemy course on React or something." And it couldn't be further away from what a Udemy courses is.

Kent:
Epic React in particular as best compared to a university semester long course, like three credit class. That's how much time you should put into it. So that's like three hours a week for something like 14 weeks or something. It's enormous. It's what it amounts to. I don't know of any other thing like this, of this scope and size by a single instructor anywhere. And it's all cohesive from beginning to end.

Sara:
That's amazing.

Kent:
I think most people who learn the most valuable stuff from me are learning from Epic React and Testing JavaScript and so the workshops are where people are learning the most, but I get so many readers on my blog. Hundreds of thousands of people hit my blog every week or month or something.

Sara:
That's amazing.

Kent:
It's very popular. For a lot of common React questions, my blog is the first result on Google or DuckDuckGo, if you will. The blog is probably where I reached the most people. I have a three-minute podcast, it's called 3 Minutes with Kent, that I publish pretty much every day. And I've got maybe about a thousand people who listen to each one of those. And then I have the chats with Kent podcasts, which you've been on and it's been great.

Sara:
Yes. This is where we're from.

Kent:
Yeah. And then I actually have a podcast on Epic Reacts and conversations with people on there too. I like that format.

Sara:
I think that's a [inaudible 00:12:02] that's about to happen where people will need to start realizing that the free stuff is paid by the paid stuff. Unlike what people think, we're just like, "Oh, you make a bunch of free stuff and now you're trying to charge us."

Kent:
The paid stuff sponsors the free stuff. And that's actually why all of my material period, is open source. Everything that I have taught people, all of the source material for that is on GitHub and totally open source. I don't think I have anything that's private.

Sara:
[inaudible 00:12:30] agreed all this content and my question is, how do you maintain consistency?

Kent:
I actually use my name in everything that I produce intentionally. So it's Three Minutes with Kent, it's ‎Chats with Kent, it's ‎Live with Kent, Office Hours with Kent, like the KCD Discord, Epic React doesn't have my name in it, but it's very clear that it's mine. As far as making the content itself consistent with itself, I think a lot of it has to do with the fact that I'm not just throwing something together every month or every week, I make sure that I know this stuff.

Sara:
What are your keys for creating optimal user learning experience to make sure that people are actually retaining what you're saying?

Kent:
My teaching is greatly influenced by a book called “Make It Stick”. It talks a lot about retention. And there are a couple of key things that I do in my workshops based on what I learned in that book. Now that book is actually written to learners and here, you're going to take a semester class at a university, here's how you make what you're learning stick. And so there are a lot of exercises and things that you can do over the course of multiple weeks, but I found ways to apply those same principles in a four hour workshop. In my live workshops, I put you in breakout rooms. So you're group with a group of people that you can work through this together. And I have like icebreaker questions and stuff to get people talking. Then if you're doing this as like on your own with the recorded stuff, then I supplement that with KCD Learning Clubs so you can get a group of people to go through it all together. And then I have my office hours that I do every week to just answer any questions that people have about the material.

Kent:
So that way... This is what I love about Epic React is that it is all of the good things about a live workshop without any of the bad things about a live workshop, you take it at your own pace. And because I have taught this material to thousands of developers, I know the questions that people are going to ask. It's really good stuff. And this is why I can give a 30 day free money back guarantee and not worry because people love it.

Sara:
That was very transparent, which is something that I also want to mention is that you have a transparency page on your website. Is that part of your philosophy, so that's people understand that in these things you are an open book and people should know how they can support you best and how you make your money?

Kent:
Yeah. So you can find it at kentcdodds.com/transparency. And I actually decided to create this page after Clubhouse became a big thing. Because I've been thinking about this for a long time and it always makes me uncomfortable not knowing what the plan for money is or where the money comes from. Money for a company that's where incentives come from. So like Twitter and Facebook and Google, they all have some weird incentives that cause those services to be not in our best interests.

Kent:
And so I was thinking about Clubhouse like, I mean, I might be excited about it, but I don't know where its money is going to come from in long-term. What is it going to do with our data? I remember tweeting like, "Every company should have a page that says where they get their money from." And when I tweeted that, I realized, wait a second, I've got a company. So I made my transparency page and I just list the sources of income that I have. And that actually is kind of useful too, because people will say, "Hey, thanks for all the free stuff that you do. How can I support you?" And I just say, "Well, go to my transparency page and you see where my money comes from. Pay for one of those things."

Sara:
If you could give one tip to someone who wants to become an educator in the tech space, what would that to be?

Kent:
A mistake that I see a lot of times is people will skip the audience building part or the audience trust part and just go straight to give me $10 please or whatever. So I spent years producing lots of free content to earn the trust. Now that doesn't mean that you can't do both at the same time. I created an Egghead course pretty early on, but while I was doing all of that stuff, I was also doing a lot of audience trust building stuff, where you need to convince them that you know what you're talking about so that they are willing to spend money. Even if you offer a 30 day money back guarantee, it's not... You don't get your time back with that and so you need to convince them that it's going to be worth their time. I would suggest putting in a lot of time to show the audience that you want to have, that you really know what you're talking about and that your content is quality.

Sara:
I just want to ask as a final question, where can our listeners find you online? Where are you most responsive?

Kent:
By my Discord and links to my Twitter, I'm pretty active on Twitter, all on my website, kentcdodds.com.

Sara:
Thank you so much for coming Kent. It was really nice to talk to you. And I got a lot of very useful insights about the world of teaching and I'm sure our listeners have gotten some really useful insights too.

Kent:
Thank you to Sara. Also just a last plug, CodeSandbox is awesome. I love CodeSandbox.

Sara:
Thank so much for listening to the show this week. If you want to find out more information, visit us at codesandbox.io/csbpodcast. And if you liked this episode, please share it on social media as well. Use the #csbpodcast or you can send us a tweet at @codesandbox. Our executive producer is Maurice Cherry with additional production help from Ceora Ford. engineering and editing or the courtesy of Resonate Recordings. And of course, a special thanks to Kent C. Dodds and the entire team at CodeSandbox.