/**
 * Exercise TypeScript definitions
 */

import * as React from 'react';
import { connect, Sprite, StagedComponentContext, SpriteProperties } from 'react-pixi-fiber';

/** Common fixtures */

interface TestContextProperties {
  app: StagedComponentContext['app'];
}

interface TestProperties {
  required: boolean;
}

interface TestMergedProperties extends TestContextProperties, TestProperties {}

const mapContextToTestContextProperties = (context: StagedComponentContext): TestContextProperties => ({ app: context.app });

/** Test `React.SFC` */
const TestSFC: React.SFC<TestMergedProperties> = ({ app, required }) => {
  return <Sprite />;
};

/** Exercise `connect` with a `React.SFC` */
export const ConnectedTestSFC = connect<TestContextProperties, TestMergedProperties>(mapContextToTestContextProperties)(TestSFC);

/** Test `React.Component` */
class TestComponent extends React.Component<TestMergedProperties> {
  render() {
    return <Sprite />;
  }
}

/** Exercise `connect` with a `React.Component` */
export const ConnectedTestComponent = connect<TestContextProperties, TestMergedProperties>(mapContextToTestContextProperties)(TestComponent);
