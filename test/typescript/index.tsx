import * as PIXI from "pixi.js";
import * as React from "react";
import {
  BitmapText,
  Container,
  Graphics,
  ParticleContainer,
  Sprite,
  Stage,
  StageClass,
  Text,
  TilingSprite,
  CustomPIXIComponent,
  createStageClass,
} from "react-pixi-fiber";

const anchor = new PIXI.ObservablePoint(() => {}, undefined, 0.5, 0.5);

const texture = PIXI.Texture.from("https://i.imgur.com/IaUrttj.png");

const CompositionExample: React.FC = () => (
  <Container>
    <BitmapText text="" />
  </Container>
);

type AnimatedSpriteProps = {
  textures: PIXI.AnimatedSprite["textures"];
};
const AnimatedSprite = CustomPIXIComponent<PIXI.AnimatedSprite, AnimatedSpriteProps>(
  {
    customDisplayObject: props => new PIXI.AnimatedSprite(props.textures),
    customApplyProps: (instance, oldProps, newProps) => {
      console.log(instance.animationSpeed);
      console.log(instance.textures);
      console.log(oldProps.textures);
      console.log(newProps.textures);
    },
    customDidAttach: instance => {
      console.log(instance.textures);
    },
    customWillDetach: instance => {
      console.log(instance.textures);
    },
  },
  "AnimatedSprite"
);

interface WickedContainerProps {
  isJungleMassive?: boolean;
  isWicked: boolean;
}

class WickedContainerClass extends PIXI.Container implements WickedContainerProps {
  isJungleMassive: boolean | undefined;
  isWicked: boolean;

  constructor(isWicked: boolean) {
    super();

    this.isWicked = isWicked;
  }
}

const WickedContainer = CustomPIXIComponent<WickedContainerClass, WickedContainerProps>(
  {
    customDisplayObject: props => {
      const instance = new WickedContainerClass(props.isWicked);

      if (props.isJungleMassive) {
        instance.isJungleMassive = props.isJungleMassive;
      }

      return instance;
    },
    customApplyProps: (instance, oldProps, newProps) => {
      console.log(instance.children);
      console.log(instance.isWicked);
      console.log(oldProps.isJungleMassive);
    },
    customDidAttach: instance => {
      console.log(instance.isWicked);
    },
    customWillDetach: instance => {
      console.log(instance.isJungleMassive);
    },
  },
  "WickedContainer"
);

const CustomPIXIComponentExample: React.FC = () => <AnimatedSprite textures={[]} />;

const StageClassExample: React.FC = () => {
  const Stage = createStageClass();

  const stageRef = React.useRef<StageClass>(null);
  const spriteRef = React.useRef<PIXI.Sprite>(null);
  const wickedContainerRef = React.useRef<WickedContainerClass>(null);

  React.useEffect(() => {
    if (stageRef.current) {
      console.log("stageRef", stageRef.current._app);
      console.log("stageRef", stageRef.current.props);
    }

    if (spriteRef.current) {
      console.log("spriteRef", spriteRef.current.position);
      console.log("spriteRef", spriteRef.current.children);
    }

    if (wickedContainerRef.current) {
      console.log("wickedContainerRef", wickedContainerRef.current.children);
      console.log("wickedContainerRef", wickedContainerRef.current.isWicked);
      console.log("wickedContainerRef", wickedContainerRef.current.isJungleMassive);
    }
  }, []);

  return (
    <Stage key="stage" options={{ backgroundColor: 0xffffff }} ref={stageRef}>
      <BitmapText
        key="bitmapText1"
        text="Bitmap text 1"
        style={{ font: { name: "Font", size: 42 }, align: "left", tint: 0xffffff }}
      />
      <BitmapText key="bitmapText2" text="Bitmap text 2" font={{ name: "Font", size: 42 }} align="left" tint={0xffffff} />
      <Container position="10,10">
        <BitmapText text="" />
      </Container>
      <Graphics />
      <ParticleContainer autoResize={false}>
        <Sprite texture={PIXI.Texture.WHITE} />
      </ParticleContainer>
      <Sprite anchor={anchor} texture={texture} ref={spriteRef} interactive pointerup={(): void => {}} />
      <Text text="Regular text" />
      <TilingSprite texture={texture} />
      <CompositionExample />
      <AnimatedSprite animationSpeed={2} textures={[]} position="0,10" />
      <WickedContainer isWicked={false} />
      <WickedContainer isWicked={true} isJungleMassive={true} ref={wickedContainerRef} />
    </Stage>
  );
};

const StageFunctionExample: React.FC = () => {
  const stageRef = React.useRef<PIXI.Container>(null);
  const spriteRef = React.useRef<PIXI.Sprite>(null);
  const wickedContainerRef = React.useRef<WickedContainerClass>(null);

  React.useEffect(() => {
    if (stageRef.current) {
      console.log("stageRef", stageRef.current.children);
      console.log("stageRef", stageRef.current.position);
    }

    if (spriteRef.current) {
      console.log("spriteRef", spriteRef.current.position);
      console.log("spriteRef", spriteRef.current.children);
    }

    if (wickedContainerRef.current) {
      console.log("wickedContainerRef", wickedContainerRef.current.children);
      console.log("wickedContainerRef", wickedContainerRef.current.isWicked);
      console.log("wickedContainerRef", wickedContainerRef.current.isJungleMassive);
    }
  }, []);

  return (
    <Stage key="stage" options={{ backgroundColor: 0xffffff }}>
      <BitmapText key="bitmapText" text="" />
      <Container position="10,10">
        <BitmapText text="" />
      </Container>
      <Graphics />
      <ParticleContainer autoResize={false}>
        <Sprite texture={PIXI.Texture.WHITE} />
      </ParticleContainer>
      <Sprite anchor={anchor} texture={texture} ref={spriteRef} interactive pointerup={(): void => {}} />
      <Text />
      <TilingSprite texture={texture} />
      <CompositionExample />
      <AnimatedSprite animationSpeed={2} textures={[]} position="0,10" />
      <WickedContainer isWicked={false} />
      <WickedContainer isWicked={true} isJungleMassive={true} ref={wickedContainerRef} />
    </Stage>
  );
};
