/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useState, useRef } from 'react';

import { Tab, TabButton, Tabs, VideoComponent, TabsWrapper } from './elements';
import videoSrc from '../../../assets/videos/video.mp4';
import { Title } from '../heroB/elements';

const Video = () => {
  const video = useRef();
  const [active, setActive] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  useEffect(() => {
    const entryObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting === true) {
          video.current.play();
          setActive(true);
        }
      },
      { threshold: [0.6] }
    );

    const leaveObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting === false) {
          video.current.pause();
          setActive(false);
        }
      },
      { threshold: [0.7] }
    );

    entryObserver.observe(video.current);
    leaveObserver.observe(video.current);
  }, [video]);

  return (
    <section
      css={`
        width: 1024px;
        max-width: 90%;
        margin: auto;
      `}
    >
      <TabsWrapper active={active}>
        <Title
          css={`
            text-align: center;
          `}
        >
          What's a Sandbox?
        </Title>
        <Tabs active={active}>
          <Tab active={activeTab === 1}>
            <TabButton
              active={activeTab === 1}
              onClick={() => {
                setActiveTab(1);
                video.current.currentTime = 0;
              }}
              type="button"
            >
              No Setup
            </TabButton>
          </Tab>
          <Tab active={activeTab === 2}>
            <TabButton
              active={activeTab === 2}
              onClick={() => {
                setActiveTab(2);
                video.current.currentTime = 2;
              }}
              type="button"
            >
              Superfast
            </TabButton>
          </Tab>
          <Tab active={activeTab === 3}>
            <TabButton
              active={activeTab === 3}
              onClick={() => {
                setActiveTab(3);
                video.current.currentTime = 3;
              }}
              type="button"
            >
              Multiplayer
            </TabButton>
          </Tab>
          <Tab active={activeTab === 4}>
            <TabButton
              active={activeTab === 4}
              onClick={() => {
                setActiveTab(4);
                video.current.currentTime = 4;
              }}
              type="button"
            >
              Updates Live
            </TabButton>
          </Tab>
          <Tab active={activeTab === 5}>
            <TabButton
              active={activeTab === 5}
              onClick={() => {
                setActiveTab(5);
                video.current.currentTime = 5;
              }}
              type="button"
            >
              Shared
            </TabButton>
          </Tab>
        </Tabs>
      </TabsWrapper>

      <VideoComponent
        src={videoSrc}
        ref={video}
        width={1024}
        height={592}
        active={active}
      />
    </section>
  );
};

export default Video;
