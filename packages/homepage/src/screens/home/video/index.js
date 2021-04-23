/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Tab,
  TabButton,
  Tabs,
  VideoComponent,
  TabsWrapper,
  Paragraph,
} from './elements';
import videoSrc from '../../../assets/videos/video.mp4';
import posterSrc from '../../../assets/videos/video.png';
import { Title } from '../hero/elements';
import usePrefersReducedMotion from '../../../utils/isReducedMOtion';

const videoTimesAndText = [
  {
    time: 0,
    text:
      ' A sandbox needs no setup - use a template to kickstart new projects, or start from a GitHub repo and begin coding in seconds.',
  },
  {
    time: 6,
    text:
      'A sandbox is a superfast development environment. They’re purpose-built for rapid web development in the browser.',
  },
  {
    time: 13,
    text:
      'A sandbox is collaborative. Like a Google Doc but for code, you can get feedback and create together, in real-time or asynchronously.',
  },
  {
    time: 25,
    text:
      'A sandbox updates live, so you can see the effect of changes instantly, inline, as you code.',
  },
  {
    time: 32,
    text:
      'A sandbox can be shared with a click. Your friends, team, or colleagues can join in, or view your creation with just a URL.',
  },
];

const Video = () => {
  const video = useRef();
  const [active, setActive] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    if (!prefersReducedMotion) {
      const entryObserver = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting === true) {
            video.current.play();
            setActive(true);
          }
        },
        { threshold: [0.6] }
      );

      entryObserver.observe(video.current);
    }
  }, [video, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [prefersReducedMotion]);

  const setCurrentTab = tab => {
    setActiveTab(tab);
    video.current.currentTime = videoTimesAndText[tab - 1].time;
    if (!video.playing) video.current.play();
  };

  const activeTime = () => {
    const times = videoTimesAndText.map(v => v.time);
    const currentTime = video.current?.currentTime;

    times.forEach((time, i) => {
      if (currentTime > times[times.length - 1]) {
        setActiveTab(times.length);
      }
      if (currentTime > time && currentTime < times[i + 1]) {
        setActiveTab(i + 1);
      }
    });
  };

  useEffect(() => {
    const videoEl = video.current;
    videoEl.addEventListener('timeupdate', activeTime, true);

    return () => {
      videoEl.removeEventListener('timeupdate', activeTime, true);
    };
  }, []);

  const tabListRef = useRef();
  useEffect(() => {
    if (!tabListRef.current) return;
    const activeTabElement = tabListRef.current.querySelector(
      '[aria-selected=true]'
    );

    tabListRef.current.scrollTo({
      left: activeTabElement.offsetLeft - tabListRef.current.offsetLeft - 100,
      behavior: 'smooth',
    });
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 140 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 1, ease: 'easeOut' }}
      css={`
        overflow: active ? "hidden" : 'initial';
      `}
    >
      <section
        css={`
          width: 1024px;
          max-width: 90%;
          margin: 0 auto;
          padding: 4rem 0 5rem 0;
          ${props => props.theme.breakpoints.md} {
            margin-top: 90px;
          }
        `}
      >
        <TabsWrapper active={active}>
          <Title
            css={`
              text-align: center;
              margin-bottom: 40px;
            `}
          >
            What’s a Sandbox?
          </Title>
          <Tabs active={active} role="tablist" ref={tabListRef}>
            <Tab
              role="tab"
              active={activeTab === 1}
              aria-selected={activeTab === 1}
            >
              <TabButton
                active={activeTab === 1}
                onClick={() => setCurrentTab(1)}
                type="button"
              >
                No Setup
              </TabButton>
            </Tab>
            <Tab
              role="tab"
              active={activeTab === 2}
              aria-selected={activeTab === 2}
            >
              <TabButton
                active={activeTab === 2}
                onClick={() => setCurrentTab(2)}
                type="button"
              >
                Superfast
              </TabButton>
            </Tab>
            <Tab
              role="tab"
              active={activeTab === 3}
              aria-selected={activeTab === 3}
            >
              <TabButton
                active={activeTab === 3}
                onClick={() => setCurrentTab(3)}
                type="button"
              >
                Multiplayer
              </TabButton>
            </Tab>
            <Tab
              role="tab"
              active={activeTab === 4}
              aria-selected={activeTab === 4}
            >
              <TabButton
                active={activeTab === 4}
                onClick={() => setCurrentTab(4)}
                type="button"
              >
                Updates Live
              </TabButton>
            </Tab>
            <Tab
              role="tab"
              active={activeTab === 5}
              aria-selected={activeTab === 5}
            >
              <TabButton
                active={activeTab === 5}
                onClick={() => setCurrentTab(5)}
                type="button"
              >
                Shared
              </TabButton>
            </Tab>
          </Tabs>
          <Paragraph key={activeTab}>
            {videoTimesAndText[activeTab - 1].text}
          </Paragraph>
        </TabsWrapper>

        <VideoComponent
          muted
          playsInline
          poster={posterSrc}
          src={videoSrc}
          ref={video}
          width={1024}
          active={active}
        />
      </section>
    </motion.div>
  );
};

export default Video;
