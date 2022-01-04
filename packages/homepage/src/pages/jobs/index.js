import React from 'react';

import { ThemeProvider } from '@codesandbox/components';
import codesandboxBlack from '@codesandbox/components/lib/themes/codesandbox-black';
import { getRandomTeamMembers } from '../../components/TeamMember';

import Layout from '../../components/layout';
import PageContainer from '../../components/PageContainer';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import imageOne from '../../assets/images/jobs/one.png';
import imageTwo from '../../assets/images/jobs/two.png';
import imageThree from '../../assets/images/jobs/three.png';
import imageFour from '../../assets/images/jobs/four.png';
import worldMap from '../../assets/images/world-map.svg';
import wearehiring from '../../assets/images/jobs/we-are-hiring.jpg';

import {
  PageTitle,
  PageSubtitle,
  TitleDescription,
  Job,
  Jobs,
  ImageGallery,
  HeroSection,
  TeamMemberRandom,
} from './_elements';

const Careers = () => {
  const [team1, team2, team3, team4, team5, team6] = getRandomTeamMembers(6);

  const [jobs, setJobs] = React.useState(undefined);

  React.useEffect(() => {
    fetch('https://codesandbox.recruitee.com/api/offers/')
      .then(x => x.json())
      .then(recruiteeJobs => {
        setJobs(
          recruiteeJobs.offers.map(job => ({
            title: job.title,
            url: job.careers_url,
          }))
        );
      })
      .catch(e => {
        console.error('Could not fetch jobs.');
        console.error(e);
      });
  }, []);

  return (
    <Layout>
      <ThemeProvider theme={codesandboxBlack}>
        <PageContainer width={860}>
          <TitleAndMetaTags
            description="Find out here about careers and working at CodeSandbox!"
            title="Careers - CodeSandbox"
            image={wearehiring}
          />
          <PageTitle>Join CodeSandbox</PageTitle>
          <HeroSection>
            <TitleDescription>
              We think that building applications should be more accessible and
              collaborative. We’re solving that with CodeSandbox; we’re building
              a next-generation development platform where everyone can build an
              application or contribute to it. It’s our goal to improve
              collaboration between developers and other team members, and make
              application development faster and easier.
              <br />
              <br />
              Founded in 2017, we’ve raised more than $15M from top-tier VCs and
              prominent industry figures, including EQT Ventures, Kleiner
              Perkins, Christian Bach & Mathias Biilmann (Netlify), and Dylan
              Field (Figma).
              <br />
              <br />
              Used by over 2M developers each month, including within
              organizations like Shopify, Atlassian, and Stripe, creators have
              crafted over 10M apps on the platform since launch. It’s used by
              thousands of open source projects, including React, Vue, and
              Babel, among others.
              <br />
              <br />
              Join us at CodeSandbox and help build the future of coding on the
              web.
            </TitleDescription>
            <div>
              <h4>The Perks</h4>
              <ul
                css={`
                  margin: 0;
                  margin-top: 8px;
                  padding: 0;
                  list-style: none;
                  li {
                    span {
                      color: #2286f7;
                    }
                  }
                `}
              >
                <li>
                  <span>✓</span> Remote-first
                </li>
                <li>
                  <span>✓</span> Competitive salary & equity
                </li>
                <li>
                  <span>✓</span> Flexible working hours
                </li>
                <li>
                  <span>✓</span> Generous vacation
                </li>
                <li>
                  <span>✓</span> Work equipment of your choice
                </li>
                <li>
                  <span>✓</span> Personal development budget
                </li>
                <li>
                  <span>✓</span> Parental leave
                </li>
              </ul>
            </div>
          </HeroSection>
          <ImageGallery>
            <section>
              <img src={imageOne} alt="Office" />
              <img src={imageTwo} alt="Office" />
            </section>
            <img src={imageThree} alt="Amsterdam" />
            <img src={imageFour} alt="Office" />
          </ImageGallery>
          <div
            css={`
              display: flex;
              flex-direction: column;
              align-items: center;
              position: relative;

              *:not(img) {
                position: relative;
                z-index: 1;
              }
            `}
          >
            <img
              src={worldMap}
              alt=""
              css={`
                position: absolute;
                opacity: 0.4;
                z-index: -1;
                width: 100vw;
                max-width: 100vw;
              `}
            />
            <TeamMemberRandom
              name={team1.name}
              css={`
                top: 200px;
                left: -70px;
                transform: rotate(-19.35deg);
              `}
            />
            <TeamMemberRandom
              name={team2.name}
              css={`
                top: 450px;
                left: -90px;
                opacity: 0.9;
                transform: rotate(-20.49deg);
              `}
            />
            <TeamMemberRandom
              name={team3.name}
              css={`
                width: 50px;
                height: 50px;
                top: 700px;
                left: -50px;
                opacity: 0.7;
                transform: rotate(-26.13deg);
              `}
            />
            <TeamMemberRandom
              name={team4.name}
              css={`
                top: 200px;
                right: -70px;
                transform: rotate(-11.4deg);
              `}
            />
            <TeamMemberRandom
              name={team5.name}
              css={`
                width: 55px;
                height: 55px;
                top: 450px;
                right: -64px;
                transform: rotate(26.25deg);
                opacity: 0.8;
              `}
            />
            <TeamMemberRandom
              name={team6.name}
              css={`
                top: 760px;
                right: -45px;
                transform: rotate(18.44deg);
              `}
            />
            <PageTitle>Our Values</PageTitle>

            <TitleDescription
              css={`
                width: 640px;
                max-width: 80%;
              `}
            >
              Everything we do at CodeSandbox derives from our values. The
              product we create is a reflection of how we work together as a
              team. That’s why our values are the same, both inside and out.
              <br />
              <br />
              We’re building a team, tool, and community that’s:
              <br />
              <br />
              <strong>Accessible</strong> &mdash; we’re making development
              accessible to all, building a reality where everyone can be a
              creator.
              <br />
              <br />
              <strong>Collaborative</strong> &mdash; providing people with the
              means to encourage and help each other.
              <br />
              <br />
              <strong>Empowering</strong> &mdash; enabling creators to feel like
              they can build without limits.
            </TitleDescription>
          </div>
          <div
            css={`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <PageTitle>How we work</PageTitle>
            <TitleDescription
              css={`
                width: 640px;
                max-width: 80%;
              `}
            >
              We follow a peer-led development approach built around autonomous
              teams. These teams form to create a feature or complete a project
              from start to finish. We ideate, scope, and implement—we’re not
              code monkeys or pixel pushers, but creative professionals who use
              our full range of skills to get things done.
              <br />
              <br />
              With advice from peers, a clear strategy, and a supportive
              culture, it’s still challenging work that can push us out of our
              comfort zones. Ultimately though, we find it more fulfilling and
              delivers better results than other approaches.
            </TitleDescription>
          </div>
          <div
            css={`
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <PageTitle>Our Hiring Process</PageTitle>
            <TitleDescription
              css={`
                width: 640px;
                max-width: 80%;
              `}
            >
              Meeting you is always an exciting moment for us and we would like
              to make sure you feel comfortable when interviewing with us. The
              steps below outline what you can expect:
              <br />
              <br />
              <strong>Step 1</strong> &mdash; a 30 min informal conversation to
              get to know each other.
              <br />
              <br />
              <strong>Step 2</strong> &mdash; a 1 hour conversation to dive
              deeper into your technical skills and explore your fit with our
              culture.
              <br />
              <br />
              <strong>Step 3</strong> &mdash; a 1 hour coding challenge or
              assessment where you get the chance to work alongside some of your
              potential teammates.
              <br />
              <br />
              <strong>Step 4</strong> &mdash; a final conversation during which
              we tackle any remaining questions on both sides.
              <br />
              <br />
              We do every interview in pairs and with different assessors
              because we would like you to be able to meet more members of the
              team. It also gives us the chance to eliminate biases.
              <br />
              <br />
              We are looking forward to receiving your application!
            </TitleDescription>
          </div>
          <PageSubtitle>Open Positions</PageSubtitle>
          {jobs != null && (
            <div>
              {jobs.length === 0 ? (
                <TitleDescription
                  css={`
                    width: 640px;
                    max-width: 80%;
                  `}
                >
                  There are no positions open right now, but please feel free to
                  still apply <a href="mailto:careers@codesandbox.io">here</a>!
                </TitleDescription>
              ) : (
                <Jobs>
                  {jobs.map(({ title, url }) => (
                    <a
                      href={url}
                      key={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      css={`
                        text-decoration: none;
                      `}
                    >
                      <Job>
                        <strong
                          css={`
                            margin-right: 1rem;
                          `}
                        >
                          {title}
                        </strong>

                        <span
                          css={`
                            color: #757575;
                          `}
                        >
                          Remote
                        </span>
                      </Job>
                    </a>
                  ))}
                </Jobs>
              )}
            </div>
          )}
        </PageContainer>
      </ThemeProvider>
    </Layout>
  );
};

export default Careers;
