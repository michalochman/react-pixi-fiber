import 'jest';
import * as PIXI from 'pixi.js';
import * as React from 'react';
import { lift, Sprite, StagedComponentContext } from 'react-pixi-fiber';
import { create } from 'react-test-renderer'
import { stage } from './utility';

/** Lifted component properties */
interface LiftedProperties { test: boolean; }

/** Create a `lift`'d component for testing. */
function createLifted(fn: (props: LiftedProperties, context: StagedComponentContext) => void) {
  return lift<LiftedProperties>((props, context) => {
    fn(props, context);
    return <Sprite />;
  });
}

/** `lift` method tests */
describe('lift', () => {
  it('projects a React.StatelessComponent to a StagedSFC with context', () => {
    // validate that context.app exists
    const Lifted = createLifted((props, context) => expect(context.app).toBeTruthy());
    stage(<Lifted test={true} />);
  });

  it('maintains own properties after projection', () => {
    // validate that props.test exists and is true
    const Lifted = createLifted((props, context) => expect(props.test).toBe(true));
    stage(<Lifted test={true} />);
  });
});
