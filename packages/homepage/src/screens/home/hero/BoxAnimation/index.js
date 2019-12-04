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
import React, { useEffect, useState } from 'react';
import { Canvas, useThree } from 'react-three-fiber';
import { useDrag } from 'react-use-gesture';
import { useCannon, Provider } from './useCannon';

function Plane({ position }) {
  const fn = React.useCallback(
    body => {
      body.addShape(new CANNON.Plane());
      body.position.set(...position);
    },
    [position]
  );
  // Register plane as a physics body with zero mass
  const ref = useCannon({ mass: 0 }, fn, []);
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color="#272727" />
    </mesh>
  );
}

function Box({ position }) {
  const { size, viewport } = useThree();
  const [dragging, setDragging] = useState(false);
  const aspect = size.width / viewport.width;
  const bodyRef = React.useRef();

  const fn = React.useCallback(
    body => {
      body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
      body.position.set(...position);

      bodyRef.current = body;
    },
    [position]
  );

  // Register box as a physics body with mass
  const ref = useCannon({ mass: 1000 }, fn, []);

  useEffect(() => {
    if (dragging) {
      bodyRef.current.sleep();
    } else {
      bodyRef.current.wakeUp();
    }
  }, [dragging]);

  const bindDrag = useDrag(
    // eslint-disable-next-line
    ({ delta: [x, y], vxvy: [vx, vy], dragging }) => {
      bodyRef.current.position.set(
        bodyRef.current.position.x + x / aspect,
        bodyRef.current.position.y + -y / aspect,
        1
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
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
}

export default function App() {
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    let timeout = null;
    const createBox = () => {
      setBoxes(b => {
        const newBoxes = [
          ...b,
          {
            key: Math.floor(Math.random() * 1000) + '',
            position: [-5 + Math.random() * 10, -2.5 + Math.random() * 5, 15],
          },
        ];

        if (newBoxes.length > 20) {
          newBoxes.length = 20;
        }

        return newBoxes;
      });

      timeout = setTimeout(createBox, 2500);
    };

    createBox();

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [setBoxes]);

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
      >
        <ambientLight intensity={0.5} />
        <spotLight
          intensity={0.6}
          position={[30, 30, 50]}
          angle={0.2}
          penumbra={1}
          castShadow
        />

        <Provider>
          <Plane position={[0, 0, 0]} />

          {boxes.map(pos => (
            <Box key={pos.key} position={pos.position} />
          ))}
        </Provider>
      </Canvas>
    </div>
  );
}
