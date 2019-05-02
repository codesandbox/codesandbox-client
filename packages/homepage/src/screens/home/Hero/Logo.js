import React, { useRef, useEffect } from 'react';
import { TimelineLite } from 'gsap/TweenMax';
import styled from 'styled-components';

const Cube = styled.svg`
  position: absolute;
`;

const Logo = styled(Cube)`
  margin: -24px -21px;
  opacity: 0;
`;

const Cube1 = styled(Cube)``;
const Cube2 = styled(Cube)``;
const Cube3 = styled(Cube)``;
const Cube4 = styled(Cube)``;
const Path = styled(Cube)`
  position: absolute;
  margin-left: -20px;
  margin-top: -5px;
  opacity: 0;
`;
const Boxes = styled(Cube)`
  position: absolute;
  margin-left: 5px;
  margin-top: 11px;
  opacity: 0;
  transform: scale(2);
`;

export default () => {
  const cube1 = useRef(null);
  const cube2 = useRef(null);
  const cube3 = useRef(null);
  const box1 = useRef(null);
  const box2 = useRef(null);
  const box3 = useRef(null);
  const cube4 = useRef(null);
  const container = useRef(null);
  const path = useRef(null);
  const logo = useRef(null);
  const boxes = useRef(null);
  const logoAnimation = new TimelineLite();

  useEffect(
    () => {
      logoAnimation
        .to(cube1.current, 1, { x: 15, y: '-25%' })
        .to(cube2.current, 1, { x: '-49%', y: '-25%' })
        .to(cube3.current, 1, { x: 0, y: '47%' })
        .to(cube1.current, 0, { opacity: 0 }, '+=0.25')
        .to(cube4.current, 0, { opacity: 0 })
        .to(cube2.current, 0, { opacity: 0 })
        .to(cube3.current, 0, { opacity: 0 })
        .to(boxes.current, 0, { opacity: 1 })
        .to(box1.current, 0.2, { x: 3, y: 3 })
        .to(box2.current, 0.2, { x: -3, y: 3 })
        .to(box3.current, 0.2, { x: 0, y: -3 })
        .to(box1.current, 0.3, { opacity: 0 }, '+=2')
        .to(box2.current, 0.3, { opacity: 0 }, '-=0.3')
        .to(box3.current, 0.3, { opacity: 0 }, '-=0.3')
        .to(logo.current, 1, { opacity: 1 }, '-=0.3');
    },
    [logoAnimation]
  );

  return (
    <div
      ref={container}
      css={`
        position: absolute;
        left: 30%;
        top: 30%;
        transform: translateX(-50%) translateY(-50%) scale(4);
      `}
    >
      <Cube1 ref={cube1} width={30} height={35} fill="none" className="box-1">
        <path
          d="M0 26.13l15 8.67V17.478l15-8.653L15 0 0 8.825V26.13z"
          fill="#fff"
        />
        <path d="M15 34.8l15-8.67V8.825l-15 8.653V34.8z" fill="#B8B9BA" />
      </Cube1>
      <Cube2 ref={cube2} width={30} height={35} fill="none" className="cube-2">
        <path
          d="M0 26.13l15 8.67V17.478l15-8.653L15 0 0 8.825V26.13z"
          fill="#fff"
        />
        <path d="M15 34.8l15-8.67V8.825l-15 8.653V34.8z" fill="#B8B9BA" />
      </Cube2>
      <Cube3 ref={cube3} width={30} height={35} fill="none" className="cube-3">
        <path
          d="M0 26.13l15 8.67V17.478l15-8.653L15 0 0 8.825V26.13z"
          fill="#fff"
        />
        <path d="M15 34.8l15-8.67V8.825l-15 8.653V34.8z" fill="#B8B9BA" />
      </Cube3>
      <Cube4 ref={cube4} width={30} height={35} fill="none" className="cube-4">
        <path
          d="M0 26.13l15 8.67V17.478l15-8.653L15 0 0 8.825V26.13z"
          fill="#fff"
        />
        <path d="M15 34.8l15-8.67V8.825l-15 8.653V34.8z" fill="#B8B9BA" />
      </Cube4>
      <Path ref={path} width={69} height={60} fill="none">
        <path
          d="M0 .724V3.5l32.5 18.824v36.54l2 1.136 2-1.137v-36.54L69 3.5V.75l-2.25-.6L34.5 18.8 2.25.15 0 .724z"
          fill="#111518"
        />
      </Path>
      <Logo ref={logo} width={72} height={83} fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M36.095 82.984V40.91L72 20.711v41.515L36.095 82.984zm19.814-16.83V53.182l11.603-7.224v-16.83L41.144 43.713v30.855l14.765-8.415z"
          fill="#B8B9BA"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M36.095 82.984L.19 62.227V20.712L35.534.516 72 20.712 36.095 40.908v42.076zM4.68 28.566v17.392l13.006 7.555v13.202l13.922 7.854V43.714L4.68 28.566zm43.197-16.27l-12.342 6.809-11.781-6.808L9.728 20.15l25.806 15.147 26.368-15.147-14.026-7.854z"
          fill="#fff"
        />
      </Logo>
      <Boxes
        ref={boxes}
        width="60"
        height="61"
        viewBox="-10 -10 120 122"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={box1}
          d="M45 52.4649L30 60.8537V26.5902L60 9.28546V26.5902L45 35.2426V52.4649Z"
          fill="#B8B9BA"
        />
        <path
          ref={box2}
          d="M0 26.6L15 34.5602V52.4746L30 60.8574V26.6L0 9.28876V26.6Z"
          fill="white"
        />
        <path
          ref={box3}
          d="M30 26.5902L60 9.28547L45 0.52004L30 9.18004L15 0.52002L0 9.28547L30 26.5902Z"
          fill="white"
        />
      </Boxes>
    </div>
  );
};
