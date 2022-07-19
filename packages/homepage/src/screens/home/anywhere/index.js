import React from 'react';
import { motion } from 'framer-motion';
import { H2, P } from '../../../components/Typography';
import padIMG from '../../../assets/images/pad.png';

const Anywhere = () => (
  <div
    css={`
      text-align: center;
    `}
  >
    <img src={padIMG} alt="CodeSandbox for iOS" />

    <div
      css={`
        font-size: 38px;
        letter-spacing: -0.05em;
        font-family: Inter;
        margin-top: 30px;
        margin-bottom: 20px;
        font-weight: 500;
        @media only screen and (max-width: 576px) {
          font-size: 26px;
          margin-bottom: 10.5px;
        }
      `}
    >
      CodeSandbox{' '}
      <span
        css={`
          font-size: 38px;
          font-family: Inter;
          margin-bottom: 20px;
          font-weight: 300;
          @media only screen and (max-width: 576px) {
            font-size: 26px;
            margin-bottom: 10px;
          }
        `}
      >
        for iOS
      </span>{' '}
    </div>

    <H2
      css={`
        font-size: 104px;
        margin-bottom: 24px;
        @media only screen and (max-width: 576px) {
          font-size: 56px;
          margin-bottom: 10px;
        }
      `}
    >
      Anywhere, <br /> anytime.
    </H2>
    <P
      // big
      muted
      css={`
        text-align: center;
        margin: auto;
        margin-bottom: 2rem;
        max-width: 500px;
        display: block;
      `}
    >
      Experience the future of web development and build projects with the first
      cloud IDE for iOS.
    </P>

    <P
      muted
      as="a"
      target="_blank"
      rel="noreferrer"
      css={`
        position: relative;
        z-index: 2;
        color: #e3ff73;
        text-decoration: none;
      `}
      href="/ios"
    >
      Learn more
    </P>

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
    />
  </div>
);

export default Anywhere;
