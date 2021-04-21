Guillermo Rauch:
We started building Vercel and the rest is history.

Maurice Cherry:
This is Version One, a podcast from CodeSandbox about the product development journey of some of the web's most talked about tools and resources from the makers behind them. I'm your host, Maurice Cherry.

Maurice Cherry:
Vercel has been called the best place to deploy a front-end app, and it's easy to see why. It works with over 30 JAMstack frameworks, including React, Gatsby and Angular. It fulfills over 4.5 billion requests per week, and it enables front-end teams at companies like Twilio, Airbnb, and Uber to do their best work.

Maurice Cherry:
The main driver behind Vercel's success is one man, Guillermo Rauch. Let's learn more about him and how his vision for a more accessible and collaborative web brought forth this unique platform.

Maurice Cherry:
So, when did you first fall in love with computers? For me, it was in the mid '80s with my brother's hand-me-down VTech Laser 50 computer. It's a classic. Look it up. Guillermo was also exposed to computers at an early age, thanks to his dad.

Guillermo Rauch:
We started paying a lot of attention to just how the world of technology was developing. And we bought a few Windows computers, desktop computers, installed games on them. But always the idea was, what more could we do with these things? And we started doing lots of different things like finding new ways of getting software into the computers, which you couldn't buy in Argentina at the time because being in South America, the software distribution mechanism hadn't been set up at a time.

Guillermo Rauch:
So you had to try to find someone who'd lend you a CD of a certain piece of software that you wanted at one point. What really was that step function in my growth was when I had the opportunity to install Linux on this computer. I challenged myself to try to install Linux in it, which at the time was only starting to have some forays into desktop computing, visual interfaces, visual installers.

Guillermo Rauch:
But it opened up this new world to me of open-source, of having a nice compiler tool chain to develop on, to have the terminal, to understand how software is compiled, and built and distributed, and package managers. So I attribute a lot of my future trajectory at the time to that one moment when it got exposed to Linux.

Maurice Cherry:
And that one moment changed everything, not just because he had discovered the concept of open-source and Linux. Oh, no. This moment was the beginning of Guillermo's journey into something much, much bigger. That's right. I'm talking about web forums.

Guillermo Rauch:
Yeah. So it's a pretty crazy story now, looking back to be honest, because when I went into Linux, I realized that I needed community to succeed. I didn't realize this because I had an epiphany of wisdom, but I realized because it was so hard to figure these things out. And it was hard to figure Linux out for a lot of other folks, especially in Argentina.

Guillermo Rauch:
I started finding different communities that were helping me figure things out. And that also, whenever I would figure something out, I would contribute back, too. So it all started with a website. It's called datafull.com. I don't think I've ever told this story yet. Super funny. So it was basically like a Stack Overflow, but for everything because people were still figuring out everything around computers and the internet.

Guillermo Rauch:
And there was a leaderboard. The person that would get the more points for their answers would be on top of the leaderboard. And I was probably 11, 12 years old at this point, and I was absolutely obsessed with becoming number one on that leaderboard. I just wanted to see Guillermo there, basically. And I started answering questions that were very general, but then they added this Linux category. And I started answering a lot of questions around, "Oh, how do I configure my internet? How do I configure this driver? How do I configure networking? How do I do all this basic things with Linux?"

Guillermo Rauch:
And I saturated that forum, so that led me to finding another community, which was this forum where a lot of developers and Linux and networking experts were starting to hang out in, and exchange tips and tricks and so on. And I did the same thing there. I started answering a lot of questions, making some online friendships, et cetera. And I remember this one day, where one of the friends that I made there, and he sends me a message. He's like, "Why do you only answer questions all day on the internet? Why don't you do some work?"

Guillermo Rauch:
And he says to me, "Oh, there's this website where you can actually do work and make things with your skills, and then get paid for them." So I was like, "Wow, that's super awesome." And I went into there and I remember my first job there was to make a CSS fix. And you get paid $10. And I couldn't believe it. In fact, most people wouldn't believe me. My parents wouldn't believe me. No one would believe me.

Guillermo Rauch:
"Oh, you just found this platform where people hire one another over internet? And they give you FTP credentials to get access to their CSS files and make contributions to that? And this person is running a business? So, they actually need it? It's not a video game?"

Maurice Cherry:
Oh, it's not a video game. How many websites can think of right now where you can do this exact same thing? The point is young Guillermo was making money. He would do many small jobs like CSS fixes, built his reputation on the platform, and then take on bigger jobs with international clients.

Maurice Cherry:
Argentina's currency, the peso was massively depreciated at the time compared to the US dollar, which meant Guillermo was making money. Not only that, he was continually being sought after by businesses, which meant more significant opportunities.

Guillermo Rauch:
So one of the milestone moments for me was my first job offer. And I was like, "Wow." And it was a soft offer. It was like, "Hey, it'd be great if you joined our team." Was when I was 17 and it was at Facebook. And my response to them was like, "Well, I'm in Argentina and I'm under age basically, so I don't think I'm a good fit for you." I was basically working a lot of my day, and a lot of my nights because of the time differences. So I would go to high school, basically sometimes honestly, to sleep because I was on autopilot in my high school.

Maurice Cherry:
Despite being on autopilot, Guillermo was a great student. His high school in Argentina was a bit like a public charter school in the US. There were college level courses taught by professors, although taking an entry exam was part of the process to join. As you might expect, Guillermo passed it with flying colors.

Guillermo Rauch:
And then it fell off a cliff, because then that's when my computer interests and my work, and my open-source started to collide really hard with this really demanding schoolwork as well. So it really came to a point in the last year where these two things were really competing. The last year was probably the hardest in terms of the materials that we were studying. And believe it or not, the only class I couldn't complete was history related.

Guillermo Rauch:
There were thick manuals that I had to ... I actually never got to read them because I just didn't have the time. And that was the last subject that unfortunately I couldn't complete. And then I dropped out. For me, it worked out and I was able to pursue my interests, and then accomplish a lot of things without having a formal degree, either in high school or college.

Maurice Cherry:
Ah, the internet. Changing lives every day. After the break, Guillermo leaves Argentina and takes his skills abroad. We'll be right back.

Speaker 3:
At CodeSandbox, we're working every day to make sure that every creator can share their ideas with the world. And now, we're expanding on that mission with our new show, the CodeSandbox Podcast. On each episode, we'll introduce you to the best and brightest from our community, and talk to experts in the field about the more human side of open-source software. The first episode of the CodeSandbox Podcast comes out on April 8th. Subscribe now on Apple Podcast, Spotify, or wherever you find your favorite podcasts, and we will see you there.

Maurice Cherry:
And we're back. Guillermo, he's going places, literally. His programming skills have caught the attention of companies worldwide. Now, it's goodbye, Argentina and the hello, Switzerland. Wheels up.

Guillermo Rauch:
So when the Facebook thing came up, that was an eye-opening moment for me because until then, I kept always getting interesting job offers. "Hey, work on this WordPress plugin. Work on this theme. Build this front-end thing." But then it started getting like, "Hey, we want you to join our team to work full-time on this project." And that was the Facebook moment.

Guillermo Rauch:
There were a bunch of startups. The first one was this startup from Switzerland. They picked MooTools to build on. They raised a good amount of venture capital and they were like, okay, let's go with one of the MooTools core team members. And I was on the MooTools core team members page since I was about 15 or 16 or so, because I was contributing a lot to the core framework.

Guillermo Rauch:
And again, this was out of passion. I'd never connected the dots until later that by contributing to open-source, you're building this great resume that is backed by your code contributions and by your documentation contributions, and so on and so forth. Things were moving so fast that I think they were just considering me more of an entity. "Oh, it's Route G." I don't think anyone stopped to certify that I was even old enough because again, my work at the time was speaking for itself.

Guillermo Rauch:
So my mom signed that paperwork with my dad. It's all kind of crazy for them, but they still were like, "This seems legit and it seems really valuable." And obviously, it's what I wanted to do and the direction in which I wanted to develop my skills. So, that was an amazing experience for me that I got to meet teams of people. I got to meet the different roles, and come together to work on a project. I got to focus a lot on one thing instead of scattering into lots of different little freelance projects.

Guillermo Rauch:
And then that company opened an office here in SF, the Embarcadero. So I moved here and started basically, spending more time here over the years. And then when I saw what the startup ecosystem looked like here, I was like, "I just want to live here and build a company here."

Maurice Cherry:
Guillermo barely got settled in San Francisco and he has already become enamored with a new concept, the power of JavaScript, especially on the client side.

Guillermo Rauch:
I became kind of obsessed with, what can JavaScript speed up in terms of experiences, especially in terms of data exchange? I was obsessed with this idea of you don't press a refresh button and the data comes to you. You make a change and the data comes to you. You see what other people are working on. I became absolutely obsessed with that idea.

Guillermo Rauch:
And in one week, or maybe a week and a half here in SF, I remember I was sitting on this kitchen table and just spent basically 10 days in a row at this co-living space I was at a time in the mission. I spent a week and a half just writing Socket.IO, this realtime framework. And it came out and it immediately took off.

Maurice Cherry:
I should mention that Guillermo was doing all this outside of the work he was doing for a startup he co-founded, called LearnBoost. This business was focused on ed tech, but Guillermo quickly realized that his true strength was in building developer tools. And he wanted to go deeper into the idea of real-time feedback and communication.

Guillermo Rauch:
I would say the biggest thing that influenced what later became Vercel was we made a pivot at the time with that ed tech startup. And we said, "What if we focus on real-time sharing?" And we created this company called Cloudup, that was focused on sharing files, static files, as fast as you could.

Guillermo Rauch:
This is a lot of what later inspired Vercel and our approach to deployment and deployment previews and so on, because we'd really believed in this idea of the hyperlink. A hyperlink is what I can give to you and you can see my work. It's what you can comment on, it's what you can experience.

Maurice Cherry:
And then one Sunday afternoon, at an empty office space in San Francisco, Guillermo met one of tech's biggest founders.

Guillermo Rauch:
Matt Mullenweg, the founder of WordPress.

Maurice Cherry:
Guillermo shows Matt Cloudup, and talked about incorporating more JavaScript into WordPress. Just a simple product demo. Well ...

Guillermo Rauch:
So long story short, we ended up being acquired by WordPress and that was an incredible experience for me. I stayed there for two years. I learned a lot about how the sausage is made, especially from a company that took an open-source project and built a successful business from it. But I had this itch still: the world is going to move more towards the front-end.

Guillermo Rauch:
And I was just still obsessed with that idea of Cloudup of, what if I just run one command and I get a hyperlink back off my work? And one of the interesting things that inspired Vercel was Cloudup had the ability that you could drag and drop anything through this menu bar app. And one of the things you could drag and drop was a folder with HTML files. And we'd host them for you.

Guillermo Rauch:
And actually, we invested a lot in building a CDN for Cloudup, called cldup.com, which is based on CloudFront. So we started laying that foundation of, how awesome would it be if these experiences are transmitted in real-time? Anybody in the company can deploy. Anybody can build new initiatives and new front-ends. And we started building Vercel and the rest is history.

Maurice Cherry:
After the break, for a Vercel Version One.

Speaker 3:
At CodeSandbox, we're working every day to make sure that every creator can share their ideas with the world. And now, we're expanding on that mission with our new show, the CodeSandbox Podcast. On each episode, we'll introduce you to the best and brightest from our community, and talk to experts in the field about the more human side of open-source software. The first episode of the CodeSandbox Podcast comes out on April 8th. Subscribe now on Apple Podcast, Spotify, or wherever you find your favorite podcasts, and we will see you there.

Maurice Cherry:
Welcome back. Before Vercel became Vercel, it was known by another name.

Guillermo Rauch:
We used to be called something different. Zeit. Turned out that that name was being used in a very important country, and there were some trademark collisions and other good reasons for renaming that had to do with simplifying our brand. And we decided on the name Vercel because it has a lot of interesting properties around performance and agility.

Guillermo Rauch:
Even though it's a new word, as far as we're concerned, it embodies a lot of the values of our platform: real-time, fast, accelerate, versatility. And we hope that those are the values that not only our brand has, but our products like Next.js, and our deployment platform continue to embody.

Maurice Cherry:
Guillermo still has more on his mind.

Guillermo Rauch:
So when I was at WordPress, I had a pretty good life. I was working with an incredible team. I was making good money, but there was this problem that I had, which was I was so anxious to expand my mind into this new world that was going into more functional programming.

Guillermo Rauch:
And I felt like this component thing was almost like a discovery rather than an invention. I was getting really anxious that it was almost like if I stay here another day, I'm not going to participate in that incredible revolution. So I just left. I actually left a lot of money on the table. My dad was like, "What the hell are you doing?"

Maurice Cherry:
Parents. But it's at this point that Guillermo continues down this path with components.

Guillermo Rauch:
That's when I created Next.js, because I was like the entry point to the system cannot be the component. It's too granular. I have to bring in a pages system into this. I have to bring in a built-in router into this. So Next.js was at this crossroads of a lot of my inspirations of the things that I'd been working on for so many years. As I mentioned, the idea of collaborating around hyperlinks, I considered that to be extremely durable.

Guillermo Rauch:
I think 20 years from now, it's going to be something that I still want Vercel to be associated with, the idea of a deploy preview. The idea of for your team, try before you buy. Collaborate before you ship. I actually think that Next.js will probably be very, very durable because of that foundation on the component model and the programming model, and JavaScript being the world's most popular programming language.

Guillermo Rauch:
I never doubted that our technologies weren't sought after by customers. They've always been popular and things like that, but I think it's really good to realize that you have nothing that you can take for granted at the end of the day. There's been a lot of situations where we've had to learn, we've had to adapt. We've had to push new ideas forward that perhaps were in the past, considered invariants. I think it's really important to realize that there's never going to be a silver bullet.

Guillermo Rauch:
There's never going to be one way. There's never going to be one paradigm, one stack. And this is why I've learned over the years to take this incredibly customer-obsessive mentality of, what problem do they have? How can I facilitate the best possible solution. If the best possible solution doesn't exist, I try to invent it. And I would say the most important thing is to just embody that in all of your work, in your messaging, in the way that you work with customers.

Guillermo Rauch:
And I think it was part of the learning. I would say as always, you want to do that as soon as you can. And maybe it could have saved a year of our work by doing that earlier, but I'm grateful of how everything has turned out. And there's always going to be learnings along the way, and I think it's going to happen in the next 10 years for us as well.

Maurice Cherry:
Thank you so much for listening to Version One. For more information about the show, visit us at codesandbox.io/versionone. That's all one word. Or you can send us a tweet at CodeSandbox. This podcast is produced by me, Maurice Cherry, with engineering and editing from Resonate Recordings.

Maurice Cherry:
The song you're listening to now, that's I Don't Mind from Particle House courtesy of Epidemic Sound. Special thanks to Guillermo Rauch from Vercel and of course, the entire team at CodeSandbox. I'm Maurice Cherry, and this is Version One. See you next time.
