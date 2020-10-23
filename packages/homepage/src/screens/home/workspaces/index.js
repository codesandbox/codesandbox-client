import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { H2, P } from '../../../components/Typography';

import { applyParallax } from '../../../utils/parallax';
import usePrefersReducedMotion from '../../../utils/isReducedMOtion';
import dashboardIMG from '../../../assets/images/dashboard.png';

import { getRandomTeamMembers } from '../../../components/TeamMember';
import { TeamMemberRandom } from '../../../pages/jobs/_elements';

const TeamMember = styled(TeamMemberRandom)`
  top: 0;
  width: 56px;
  height: 56px;
`;

const share = {
  scale: [0.1, 1],
  opacity: [0, 1],
};

const transitionTwo = {
  duration: 0.6,
  ease: 'anticipate',
  delay: 1,
};

const Workspaces = () => {
  const [team1, team2, team3, team4, team5, team6] = getRandomTeamMembers(6);
  const parallaxRef = useRef(null);
  const parallaxRef1 = useRef(null);
  const parallaxRef2 = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  useEffect(() => {
    if (!prefersReducedMotion) {
      applyParallax(parallaxRef.current, {
        speed: 1.1,
        center: true,
      });
      applyParallax(parallaxRef1.current, {
        speed: 1.1,
        center: true,
      });
      applyParallax(parallaxRef2.current, {
        speed: 1.1,
        center: true,
      });
    }
  }, [parallaxRef, prefersReducedMotion]);

  return (
    <div
      css={`
        padding: 20rem 0 5rem 0;

        @media screen and (max-width: 1023px) {
          padding-top: 0px;
        }
      `}
    >
      <motion.div animate={share} transition={transitionTwo}>
        <TeamMember
          css={`
            transform: rotate(19.47deg) translateY(-100%);
            opacity: 0.6;
            position: absolute;
            top: -45px;
            right: 162px;
          `}
          name={team1.name}
        />
        <TeamMember
          css={`
            transform: rotate(22.48deg) translateY(-100%);
            position: absolute;
            top: 105px;
            width: 52px;
            height: 52px;
          `}
          name={team2.name}
        />
        <TeamMember
          css={`
            transform: rotate(27.7deg) translateY(-100%);
            opacity: 0.2;
            position: absolute;
            top: -45px;
            width: 58px;
            height: 58px;
          `}
          name={team3.name}
        />
        <TeamMember
          name={team4.name}
          css={`
            transform: rotate(-11.84deg) translateY(-100%);
            position: absolute;
            top: -45px;
            left: 162px;
            width: 72px;
            height: 72px;
          `}
        />
        <TeamMember
          name={team5.name}
          css={`
            transform: rotate(-19.48deg) translateY(-100%);
            position: absolute;
            top: 105px;
            left: 0;
            opacity: 0.9;
            width: 72px;
            height: 72px;
          `}
        />
        <TeamMember
          name={team6.name}
          css={`
            transform: rotate(-12.11deg) translateY(-100%);
            opacity: 0.2;
            position: absolute;
            top: -45px;
            left: 0;

            width: 50.23px;
            height: 50.23px;
          `}
        />
      </motion.div>
      <H2
        css={`
          text-align: center;
          margin-bottom: 24px;
        `}
      >
        Workspaces
      </H2>
      <P
        big
        muted
        css={`
          text-align: center;
          margin: auto;
          margin-bottom: 80px;
          max-width: 650px;
          display: block;
          margin-bottom: 80px;
        `}
      >
        Share templates, keep organized with folders, and enable your entire
        team to work on sandboxes together.
      </P>
      <motion.div
        initial={{ opacity: 0, y: 140 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 1,
          ease: 'easeOut',
        }}
      >
        <img src={dashboardIMG} alt="" />
      </motion.div>
    </div>
  );
};

export default Workspaces;
