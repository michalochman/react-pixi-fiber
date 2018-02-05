import 'jest';
import * as PIXI from 'pixi.js';
import * as React from 'react';
import { connect, Sprite, StagedComponentContext } from 'react-pixi-fiber';
import { create } from 'react-test-renderer'
import { stage } from './utility';

/** Connected component's context-mapped properties. */
interface ConnectedContextProperties { app: StagedComponentContext['app']; }

/** Connected component's own properties. */
interface ConnectedProperties { test: boolean; }

/** Connected component merged properties. */
interface ConnectedMergedProperties extends ConnectedContextProperties, ConnectedProperties {}

/** Create a `connect`'d component for testing. */
function createConnected(fn: (props: ConnectedMergedProperties) => void) {
  const Disconnected: React.SFC<ConnectedMergedProperties> = (props) => {
    fn(props);
    return <Sprite />;
  };
  return connect<ConnectedContextProperties, ConnectedMergedProperties>(context => ({ app: context.app }))(Disconnected);
}

/** `connect` method tests */
describe('connect', () => {
  it('connects context to properties', () => {
    // validate that props.app exists
    const Connected = createConnected((props) => expect(props.app).toBeTruthy());
    stage(<Connected test={true} />);
  });

  it('receives both context-mapped and own properties', () => {
    const propKeys: Array<keyof ConnectedMergedProperties> = ['test', 'app'];
    const Connected = createConnected((props) => {
      // validate that props has the same number of keys as propKeys
      expect(Object.keys(props).length).toBe(propKeys.length);
      // validate that each key in propKeys is contained in props
      propKeys.forEach(key => expect(props[key]).toBeTruthy())
    });
    stage(<Connected test={true} />);
  })
});
