import 'jest';
import * as PIXI from 'pixi.js';
import * as React from 'react';
import { Sprite, StagedComponent, StagedComponentContext } from 'react-pixi-fiber';
import { create } from 'react-test-renderer'
import { stage } from './utility';

interface StagedProperties {
  test: boolean;
}

/** Create a Staged component for testing. */
function createStaged<P = StagedProperties>(fn: (props: P, context: StagedComponentContext) => void) {
  return class extends StagedComponent<P> {
    render() {
      fn(this.props, this.context);
      return <Sprite />;
    }
  }
}

/** `StagedComponent` class tests */
describe('StagedComponent', () => {
  it('receives context from Stage', () => {
    // validate that context.app exists
    const Staged = createStaged((props, context) => expect(context.app).toBeTruthy());
    stage(<Staged test={true} />);
  });

  it('receives own properties', () => {
    const Staged = createStaged((props, context) => {
      const propKeys: Array<keyof StagedProperties> = ['test'];
      // validate that props has the same number of keys as propKeys
      expect(Object.keys(props).length).toBe(propKeys.length);
      // validate that each key in propKeys is contained in props
      propKeys.forEach(key => expect(props[key]).toBeTruthy())
    });
    stage(<Staged test={true} />);
  })
});
