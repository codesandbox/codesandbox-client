import React from 'react';
import { Link } from 'gatsby';

import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import { Banner, TitleWrapper, Wrapper } from '../embeds/_elements';

import KP from './images/kp.svg';
import ArchesCapital from './images/arches-capital.svg';
import Figma from './images/figma.svg';
import Framer from './images/framer.svg';
import Netlify from './images/netlify.svg';
import Vercel from './images/vercel.svg';
import Sourcegraph from './images/sourcegraph.svg';
import company from '../../assets/images/company.png';
import company2x from '../../assets/images/company@2x.png';

import { Title, Text, Investors, AngelInvestors } from './_elements';
import TeamMember from '../../components/TeamMember';

export default () => (
  <Layout>
    <TitleAndMetaTags title="Our Mission - CodeSandbox" />
    <Wrapper>
      <TitleWrapper>
        <Title>Our Mission</Title>
      </TitleWrapper>
      <Text>
        Founded in 2017 by Ives van Hoorne and Bas Buursma, our mission is to
        enable creators to build and share their ideas. By removing complexity
        and simplifying collaboration, we want to allow everyone to create with
        code.
      </Text>
      <Banner
        css={`
          height: auto;
          margin-bottom: 258px;
        `}
      >
        <img
          css={`
            width: 100%;
          `}
          src={company}
          srcSet={`${company} 1x, ${company2x} 2x`}
          alt="Company"
        />
      </Banner>
      <Title>Our Team</Title>
      <Text
        css={`
          height: auto;
          margin-bottom: 258px;
        `}
      >
        We’re a small but growing remote-first team of creative professionals.
        Although our headquarters are in Amsterdam, the Netherlands, most of our
        staff work from home in locations spread around the world.
        <Link
          to={`/jobs`}
          css={`
            display: block;
            margin-top: 40px;
            text-decoration: none;
            color: #0971f1;
            font-weight: 700;
          `}
        >
          View open positions
        </Link>
      </Text>
      <div
        css={`
          margin-bottom: 371px;
          display: grid;
          grid-template-columns: repeat(6, 102px);
          grid-column-gap: 95px;
          grid-row-gap: 55px;
        `}
      >
        <TeamMember name="ives" />
        <TeamMember name="bas" />
        <TeamMember name="bogdan" />
        <TeamMember name="oskar" />
        <TeamMember name="sara" />
        <TeamMember name="danny" />
        <TeamMember name="gareth" />
        <TeamMember name="sid" />
        <TeamMember name="christian" />
        <TeamMember name="sanne" />
        <TeamMember name="andras" />
      </div>
      <div
        css={`
          margin-bottom: 325px;
        `}
      >
        <Title>Our Investors </Title>
        <Text>
          Most recently we raised a Series A round, bringing our total funding
          to $15M from top-tier VCs, operators, and Angels.
        </Text>
        <Investors>
          <div>
            <img src={KP} alt="KP" />
          </div>
          <div>
            <img src={ArchesCapital} alt="ArchesCapital" />
          </div>
        </Investors>
        <AngelInvestors>
          <div>
            <img src={Framer} alt="Framer" />
            <b>Koen Bok</b>
            Founder & CEO
          </div>
          <div>
            <img src={Figma} alt="Figma" />
            <b>Dylan Field</b>
            Founder & CEO
          </div>
          <div>
            <img src={Netlify} alt="Netlify" />
            <b>Christian Bach</b>
            Founder & President
          </div>
          <div>
            <div
              css={`
                height: 97px;
                margin-bottom: 1.625rem;
              `}
            />
            <b>Petri Parvinen</b>
            Angel Investor
          </div>
          <div>
            <div
              css={`
                height: 97px;
                margin-bottom: 1.625rem;
              `}
            />
            <b>Marco Jansen</b>
            Founder Catawiki
          </div>
          <div>
            <img src={Netlify} alt="Netlify" />
            <b>Mathias Biilmann</b>
            Founder & CEO
          </div>
          <div>
            <img src={Sourcegraph} alt="Sourcegraph" />
            <b>Quinn Slack</b>
            Founder & CEO
          </div>
          <div>
            <img
              src={Vercel}
              alt="Vercel"
              css={`
                height: 97px;
              `}
            />
            <b>Guillermo Rauch</b>
            Founder & CEO
          </div>
        </AngelInvestors>
      </div>
      <Title>Press Kit</Title>
      <Text>
        Are you writing about us? Here are logos and product shots to download
        and use in web and print media.
        <a
          href="#"
          css={`
            display: block;
            margin-top: 40px;
            text-decoration: none;
            color: #0971f1;
            font-weight: 700;
          `}
        >
          Download Press Kit ↓
        </a>
      </Text>
    </Wrapper>
  </Layout>
);
