import React from "react";



function TextureRenderer({ assetUrl, children }) {
  console.log('1')
  console.log('2')
  console.log(spriteSheet.read())
  const sheet = spriteSheet.read().default;
  console.log('3')
  const texture = PIXI.Texture.from(sheet);
  console.log('4')

  console.log(sheet)
  console.log(texture)

  return children({ texture });
}

export default TextureRenderer;
