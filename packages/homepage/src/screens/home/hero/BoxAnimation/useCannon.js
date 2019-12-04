import * as CANNON from 'cannon';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useRender } from 'react-three-fiber';

// Cannon-world context provider
const context = React.createContext(undefined);
export function Provider({ children }) {
  // Set up physics
  const [world] = useState(() => new CANNON.World());
  useEffect(() => {
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    world.gravity.set(0, 0, -15);
  }, [world]);

  // Run world stepper every frame
  useRender(() => {
    world.step(1 / 60);
  }, false);
  // Distribute world via context
  return <context.Provider value={world}>{children}</context.Provider>;
}

// Custom hook to maintain a world physics body
export function useCannon({ ...props }, fn, deps = []) {
  const ref = useRef();
  // Get cannon world object
  const world = useContext(context);
  // Instanciate a physics body
  const [body] = useState(() => new CANNON.Body(props));
  useEffect(() => {
    // Call function so the user can add shapes
    fn(body);

    // Add body to world on mount
    world.addBody(body);
    // Remove body on unmount
    return () => {
      world.remove(body);
    };
  }, [body, fn, world]);

  useRender(() => {
    const { current } = ref;
    if (current !== undefined) {
      // Transport cannon physics into the referenced threejs object
      current.position.copy(body.position);
      current.quaternion.copy(body.quaternion);
    }
  }, false);

  return ref;
}
