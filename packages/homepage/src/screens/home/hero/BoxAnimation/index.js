/** POC for three-fiber and cannon (a 3d physics lib)
 *
 *  useCannon is a custom hook that lets you link a physics body to a threejs
 *  mesh with zero effort. It will automatically update the mesh with the
 *  correct positioning.
 *
 *  When components with useCannon mount they are known to cannons world, when
 *  they unmount, they'll remove themselves from physics processing.
 *
 *  Check out three-fiber here: https://github.com/drcmda/react-three-fiber
 */

import * as THREE from 'three';
import * as CANNON from 'cannon';
import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useThree, useFrame } from 'react-three-fiber';
import { useDrag } from 'react-use-gesture';
import { useSpring, a } from 'react-spring/three';
import ResizeObserver from '@juggle/resize-observer';

import fallback from '../../../../assets/images/hero-fallback.png';
import { useCannon, Provider } from './useCannon';

import { AnimationContainer, FallbackImageBackground } from './elements';

function Plane({ position, disableAnimation }) {
  const bodyRef = useRef();
  const fpsBelow10 = useRef(0);
  const lastCall = useRef(Date.now());

  // If we have 3 consecutive frames that are below 5fps it's most likely that
  // hardware acceleration has been disabled and we'll disable the whole animation
  useFrame(() => {
    const currentTime = Date.now();
    const delta = currentTime - lastCall.current;
    lastCall.current = currentTime;
    if (delta > (1 / 5) * 1000 && document.hasFocus()) {
      fpsBelow10.current++;

      if (fpsBelow10.current > 3) {
        disableAnimation();
      }
    } else {
      fpsBelow10.current = 0;
    }
  });

  const fn = React.useCallback(
    body => {
      body.addShape(new CANNON.Plane());
      body.position.set(...position);

      bodyRef.current = body;
    },
    [position]
  );
  // Register plane as a physics body with zero mass
  const ref = useCannon({ mass: 0 }, fn, []);

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color="#242424" />
    </mesh>
  );
}

function Box({ position, rotation, onDrag, onDragStop }) {
  const { size, viewport } = useThree();
  const [dragging, setDragging] = useState(false);
  const aspect = size.width / viewport.width;
  const bodyRef = React.useRef();

  const fn = React.useCallback(
    body => {
      body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)));
      body.position.set(...position);
      body.angularVelocity.set(...rotation);

      bodyRef.current = body;
    },
    [position, rotation]
  );

  // Register box as a physics body with mass
  const ref = useCannon({ mass: 100 }, fn, []);

  useEffect(() => {
    if (dragging) {
      bodyRef.current.sleep();
    } else {
      bodyRef.current.wakeUp();
    }
  }, [dragging, onDrag, onDragStop]);

  const bindDrag = useDrag(
    // eslint-disable-next-line
    ({ delta: [x, y], vxvy: [vx, vy], dragging, event }) => {
      event.nativeEvent.preventDefault();
      event.nativeEvent.stopPropagation();

      bodyRef.current.position.set(
        bodyRef.current.position.x + x / aspect,
        bodyRef.current.position.y + -y / aspect,
        bodyRef.current.position.z
      );

      if (dragging) {
        onDrag();
        setDragging(true);
      } else {
        onDragStop();
        setDragging(false);
      }

      bodyRef.current.velocity.x = vx * 5;
      bodyRef.current.velocity.y = -vy * 5;
    },
    { pointerEvents: true }
  );

  return (
    <mesh {...bindDrag()} ref={ref} castShadow receiveShadow>
      <boxGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
}

export default function App({ boxes, showPlane }) {
  const [prop, set] = useSpring(() => ({ intensity: 0.6, color: '#fff' }));
  const [animationDisabled, setAnimationDisabled] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  const setDraggingTrue = React.useCallback(() => {
    setDragging(true);
  }, []);

  const setDraggingFalse = React.useCallback(() => {
    setDragging(false);
  }, []);

  useEffect(() => {
    if (!boxes.length) {
      return;
    }

    set({ intensity: 1 });

    setTimeout(() => {
      set({ intensity: 0.6 });
    }, 300);
  }, [boxes, set]);

  if (animationDisabled) {
    return (
      <AnimationContainer>
        <FallbackImageBackground
          fallback={fallback}
          alt="boxes falling on the ground"
        />
      </AnimationContainer>
    );
  }

  return (
    <AnimationContainer
      style={{
        touchAction: dragging ? 'none' : 'initial',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 20] }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
        resize={{ polyfill: ResizeObserver }}
      >
        <ambientLight intensity={0.5} />

        <a.spotLight
          {...prop}
          position={[-80, 60, 50]}
          angle={0.2}
          penumbra={1}
          castShadow
        />

        <Provider>
          {showPlane && (
            <Plane
              disableAnimation={() => {
                setAnimationDisabled(true);
              }}
              position={[0, 0, 0]}
            />
          )}

          {boxes.map(pos => (
            <Box
              onDrag={setDraggingTrue}
              onDragStop={setDraggingFalse}
              key={pos.key}
              position={pos.position}
              rotation={pos.rotation}
            />
          ))}
        </Provider>
      </Canvas>
    </AnimationContainer>
  );
}
