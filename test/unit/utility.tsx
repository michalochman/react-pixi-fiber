import * as React from 'react';
import { Stage } from 'react-pixi-fiber';
import { create } from 'react-test-renderer';

/** Render a `JSX.Element` inside a `Stage`. */
export function stage(component: JSX.Element) {
  create((<Stage>{component}</Stage>));
}
