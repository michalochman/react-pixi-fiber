import React from "react";
import { createAsset } from "use-asset";
import * as PIXI from "pixi.js";

// Suspends until the image is downloaded, so the Suspense fallback covers the whole load.
const textures = createAsset((url: string) => PIXI.Texture.fromURL(url), Infinity);

type TextureRendererProps = {
  assetUrl: string;
  children: (props: { texture: PIXI.Texture }) => React.ReactElement;
};

function TextureRenderer({ assetUrl, children }: TextureRendererProps) {
  return children({ texture: textures.read(assetUrl) });
}

export default TextureRenderer;
