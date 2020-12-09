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

  const jobs = [
    {
      title: 'Product Engineer (Front-end)',
      url: 'https://codesandbox.recruitee.com/o/product-engineer-frontend',
    },
    {
      title: 'Product Growth Engineer',
      url:
        'https://codesandbox.recruitee.com/o/product-growth-engineer-amsterdam',
    },
    {
      title: 'Senior Full Stack Engineer (TypeScript)',
      url:
        'https://codesandbox.recruitee.com/o/senior-full-stack-engineer-typescript',
    },
    {
      title: 'Head of Engineering',
      url: 'https://codesandbox.recruitee.com/o/head-of-engineering',
    },
    {
      title: 'Product Designer',
      url: 'https://codesandbox.recruitee.com/o/product-designer',
    },
    {
      title: 'Data Analyst',
      url: 'https://codesandbox.recruitee.com/o/data-analyst',
    },
    {
      title: 'Developer Marketing Coordinator',
      url:
        'https://codesandbox.recruitee.com/o/developer-marketing-coordinator',
    },
  ];

  return (
    <Layout>
      <ThemeProvider theme={codesandboxBlack}>
        <PageContainer width={860}>
          <TitleAndMetaTags
            description="Find out here about careers and working at CodeSandbox!"
            title="Careers - CodeSandbox"
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
              <strong>Accessible</strong> - we’re making development accessible
              to all, building a reality where everyone can be a creator.
              <br />
              <br />
              <strong>Collaborative</strong> - providing people with the means
              to encourage and help each other.
              <br />
              <br />
              <strong>Empowering</strong> - enabling creators to feel like they
              can build without limits.
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
          <PageSubtitle>Open Positions</PageSubtitle>
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
                  <span
                    css={`
                      font-weight: bold;
                    `}
                  >
                    {title}
                  </span>

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
        </PageContainer>
      </ThemeProvider>
    </Layout>
  );
};

export default Careers;
