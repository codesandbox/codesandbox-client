import React from 'react';
import { motion } from 'framer-motion';

import { H2, P } from '../../../components/Typography';
import padIMG from '../../../assets/images/pad.png';
import phoneIMG from '../../../assets/images/phone.png';

import Button from '../../../components/Button';

const Anywhere = () => (
  <div
    css={`
      padding: 0 0 30rem 0;
      margin-bottom: 10rem;
      text-align: center;
      @media screen and (max-width: 992px) {
        margin-bottom: 4rem;
        padding: 0 0 10rem 0;
      }

      @media (max-width: 576px) {
        padding: 0 0 0 0;
      }
    `}
  >
    <H2
      css={`
        text-align: center;
        margin-bottom: 24px;
      `}
    >
      Code from anywhere.
    </H2>
    <P
      // big
      muted
      css={`
        text-align: center;
        margin: auto;
        margin-bottom: 2rem;
        max-width: 650px;
        display: block;
      `}
    >
      Experience the future of web development and build projects with the first cloud IDE for iOS.
    </P>

    <Button
      big
      css={`
        position: relative;
        z-index: 2;
      `}
      href="/ios"
    >
      Learn more about CodeSandbox for iOS
    </Button>

    <motion.div
      css={`
        z-index: 1;
      `}
      initial={{ opacity: 0, y: 140 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.6,
        duration: 1,
        ease: 'easeOut',
      }}
    >
      <div
        css={`
          margin: 6rem 4rem 0 7rem;
          max-height: 320px;
          max-width: 1024px;
          display: block;
        `}
      >
        <div
          css={`
            position: relative;
            margin: -14rem auto 0rem -10rem;

            @media (max-width: 992px) {
              margin: -8rem 0 0 -4rem;
            }
          `}
        >
          <img src={padIMG} alt="Play.js" />

          <div
            css={`
              position: absolute;

              top: 16rem;
              right: 4rem;

              width: 100%;
              height: 100%;
              max-width: 340px;
              max-height: 480px;

              @media (max-width: 1023px) {
                display: none;
              }

              @media (max-width: 1200px) {
                top: 12rem;
                right: 0rem;
              }
            `}
          >
            <img src={phoneIMG} alt="" />
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);

export default Anywhere;
