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
import { Canvas, useThree } from 'react-three-fiber';
import { useDrag } from 'react-use-gesture';
import { useSpring, a } from 'react-spring/three';
import ResizeObserver from '@juggle/resize-observer';

import { useCannon, Provider } from './useCannon';

function Plane({ position }) {
  const bodyRef = useRef();

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

function Box({ position, rotation }) {
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
  }, [dragging]);

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
        setDragging(true);
      } else {
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

  useEffect(() => {
    if (!boxes.length) {
      return;
    }

    set({ intensity: 1 });

    setTimeout(() => {
      set({ intensity: 0.6 });
    }, 300);
  }, [boxes, set]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
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
          {showPlane && <Plane position={[0, 0, 0]} />}

          {boxes.map(pos => (
            <Box
              key={pos.key}
              position={pos.position}
              rotation={pos.rotation}
            />
          ))}
        </Provider>
      </Canvas>
    </div>
  );
}
