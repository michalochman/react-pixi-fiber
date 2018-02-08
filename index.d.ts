import * as PIXI from 'pixi.js';

export = ReactPIXIFiber;

declare namespace ReactPIXIFiber {

  //
  // Utility types.
  //

  /**
   * The difference of T and U.
   * [attribution](https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766)
   */
  type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
  /**
   * From T omit property with name U.
   * [attribution](https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766)
   */
  type Omit<T, U extends keyof T> = Pick<T, Diff<keyof T, U>>;
  /** The shape of an object that has an optional `children` property of any type. */
  interface ObjectWithChildren { children?: any; }
  /** The shape of `T` without it's `children` property. */
  type Childless<T extends ObjectWithChildren> = Omit<T, 'children'>;
  /** The shape of a component that has an optional `children` property. */
  interface ChildrenProperties {
    children?: React.ReactNode;
  }
  /** Produces a `Partial` form of any type defined in `ClassMap`, stripped of a `children` property. */
  type PropertiesWithoutChildren<K extends keyof ClassMap> = Partial<Childless<ClassMap[K]>>;
  /** Properties suitable for a display object */
  type DisplayObjectProperties<K extends keyof ClassMap> = ClassAttributes<K> & PropertiesWithoutChildren<K>;
  /** Properties suitable for a PIXI display object container */
  type DisplayObjectContainerProperties<K extends keyof ClassMap> = DisplayObjectProperties<K> & ChildrenProperties;

  //
  // Component identifier types.
  //

  /** BitmapText component identifier type */
  type BitmapText = 'BitmapText';
  /** Container component identifier type */
  type Container = 'Container';
  /** Graphics component identifier type */
  type Graphics = 'Graphics';
  /** ParticleContainer component identifier type */
  type ParticleContainer = 'ParticleContainer';
  /** Sprite component identifier type */
  type Sprite = 'Sprite';
  /** Stage component identifier type */
  type Stage = 'Stage';
  /** Text component identifier type */
  type Text = 'Text';
  /** TilingSprite component identifier type */
  type TilingSprite = 'TilingSprite';

  //
  //  Publically exported React element types that the reconciler can identifiy. You can
  //  use these as you would other components.  This works iefei simlarly to how intrinsic elements
  //  such as HTML and SVG elements work.
  //

  /**
   * BitmapText React element type.
   * @example const text = '';
   * <BitmapText text={text} />
   * @example React.createElement(BitmapText, { text })
   * @example // equivalent to:
   * React.createElement('BitmapText', { text })
   */
  const BitmapText: BitmapText;
  /**
   * Container React element type.
   * @example <Container />
   * @example React.createElement(Container)
   * @example // equivalent to:
   * React.createElement('Container')
   */
  const Container: Container;
  /**
   * Graphics React element type.
   * @example <Graphics />
   * @example React.createElement(Graphics)
   * @example // equivalent to:
   * React.createElement('Graphics')
   */
  const Graphics: Graphics;
  /**
   * ParticleContainer React element type.
   * @example <ParticleContainer />
   * @example React.createElement(ParticleContainer)
   * @example // equivalent to:
   * React.createElement('ParticleContainer')
   */
  const ParticleContainer: ParticleContainer;
  /**
   * Sprite React element type.
   * @example <Sprite />
   * @example React.createElement(Sprite)
   * @example // equivalent to:
   * React.createElement('Sprite')
   */
  const Sprite: Sprite;
  /**
   * Stage React element type.
   * @example <Stage width={100} height={100} />
   * @example React.createElement(Stage)
   * @example // equivalent to:
   * React.createElement('Stage')
   */
  const Stage: Stage;
  /**
   * Text React element type.
   * @example <Text />
   * @example React.createElement(Text)
   * @example // equivalent to:
   * React.createElement('Text')
  */
  const Text: Text;
  /**
   * TilingSprite React element type.
   * @example const texture = PIXI.Texture.fromImage(...);
   * <TilingSprite texture={texture} />
   * @example React.createElement(TilingSprite, { texture })
   * @example // equivalent to:
   * React.createElement('TilingSprite', { texture })
   */
  const TilingSprite: TilingSprite;

  //
  //  Component properties.
  //  - `DisplayObjectProperties` do not have children.
  //  - `DisplayObjectContainerProperties` can have children.
  //

  /**
   * BitmapText properties.
   * @see http://pixijs.download/dev/docs/PIXI.extras.BitmapText.html
   */
  interface BitmapTextProperties extends DisplayObjectProperties<BitmapText> {
    text: string;
  }
  /**
   * Container properties.
   * @see http://pixijs.download/dev/docs/PIXI.Container.html
   */
  interface ContainerProperties extends DisplayObjectContainerProperties<Container> {}
  /**
   * Graphics properties.
   * @see http://pixijs.download/dev/docs/PIXI.Graphics.html
   */
  interface GraphicsProperties extends DisplayObjectContainerProperties<Graphics> {}
  /**
   * ParticleContainer properties.
   * @see http://pixijs.download/dev/docs/PIXI.particles.ParticleContainer.html
   */
  interface ParticleContainerProperties extends DisplayObjectContainerProperties<ParticleContainer> {}
  /**
   * Sprite properties.
   * @see http://pixijs.download/dev/docs/PIXI.Sprite.html
   */
  interface SpriteProperties extends DisplayObjectProperties<Sprite> {}
  /**
   * Stage properties.
   * @see http://pixijs.download/dev/docs/PIXI.Application.html
   */
  interface StageProperties extends DisplayObjectContainerProperties<Stage> {
    backgroundColor?: number;
  }
  /**
   * Text properties.
   * @see http://pixijs.download/dev/docs/PIXI.Text.html
   */
  interface TextProperties extends DisplayObjectProperties<Text> {}
  /**
   * TilingSprite properties.
   * @see http://pixijs.download/dev/docs/PIXI.extras.TilingSprite.html
   */
  interface TilingSpriteProperties extends DisplayObjectProperties<TilingSprite> {
    texture: PIXI.Texture;
  }

  //
  // Types required for augmenting the React module and the JSX namespace to support
  // these custom elements.
  //

  /** Custom React Reconciler render method. */
  function render(pixiElement: PIXI.DisplayObject | PIXI.DisplayObject[], stage: PIXI.Container, callback?: Function): void;

  /** Common class attributes. */
  interface ClassAttributes<T extends keyof InstanceMap> extends React.ClassAttributes<InstanceMap[T]> {}

  /** Map React element types to the PIXI object it's properties decorate. */
  interface ClassMap {
    [BitmapText]: PIXI.extras.BitmapText;
    [Container]: PIXI.Container;
    [Graphics]: PIXI.Graphics;
    [ParticleContainer]: PIXI.particles.ParticleContainer;
    [Sprite]: PIXI.Sprite;
    [Stage]: PIXI.Container;
    [Text]: PIXI.Text;
    [TilingSprite]: PIXI.extras.TilingSprite;
  }

  /** Map React element types to the properties the component supports. */
  interface PropertiesMap {
    [BitmapText]: BitmapTextProperties;
    [Container]: ContainerProperties;
    [Graphics]: GraphicsProperties;
    [ParticleContainer]: ParticleContainerProperties;
    [Sprite]: SpriteProperties;
    [Stage]: StageProperties;
    [Text]: TextProperties;
    [TilingSprite]: TilingSpriteProperties;
  }

  /** Map React element types reference type it emits. */
  interface InstanceMap {
    [BitmapText]: PIXI.extras.BitmapText;
    [Container]: PIXI.Container;
    [Graphics]: PIXI.Graphics;
    [ParticleContainer]: PIXI.particles.ParticleContainer;
    [Sprite]: PIXI.Sprite;
    [Stage]: Element<Stage, any>;
    [Text]: PIXI.Text;
    [TilingSprite]: PIXI.extras.TilingSprite;
  }

  /** The JSX element type. */
  interface Element<T extends keyof InstanceMap, P = {}> extends React.ReactElement<P> {
    type: React.ComponentClass<P>;
    ref: React.Ref<InstanceMap[T]>;
  }
}

/**
 * Augment the `react` module with a new `createElement` and `cloneElement` method supporting
 * our custom components.
 */
declare module 'react' {
  function createElement<T extends keyof ReactPIXIFiber.PropertiesMap, P extends ReactPIXIFiber.ClassAttributes<T> = {}>(
      type: T,
      props?: P | null,
      ...children: React.ReactNode[]): ReactPIXIFiber.Element<T, P>;

  function cloneElement<T extends keyof ReactPIXIFiber.PropertiesMap, P extends ReactPIXIFiber.ClassAttributes<T> = {}>(
    element: ReactPIXIFiber.Element<T, P>,
    props?: P,
    ...children: PIXI.DisplayObject[]): ReactPIXIFiber.Element<T, P>;
}

/**
 * Augment the global JSX namespace to include our custom component type map as
 * intrinsic elements.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactPIXIFiber.PropertiesMap {}
  }
}
