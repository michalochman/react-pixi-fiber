// The 13 core tags, PixiJS 8 spelling. Every PixiJS adapter implements all of them.
export const TAGS = {
  Container: "Container",
  Sprite: "Sprite",
  AnimatedSprite: "AnimatedSprite",
  Text: "Text",
  BitmapText: "BitmapText",
  Graphics: "Graphics",
  TilingSprite: "TilingSprite",
  NineSliceSprite: "NineSliceSprite",
  ParticleContainer: "ParticleContainer",
  Mesh: "Mesh",
  MeshSimple: "MeshSimple",
  MeshPlane: "MeshPlane",
  MeshRope: "MeshRope",
} as const;
export type Tag = keyof typeof TAGS;
// 2.x tag names, resolved after the registry and the adapter. Removed in 4.0.0.
export const DEPRECATED_TAGS: Record<string, Tag> = { NineSlicePlane: "NineSliceSprite" };
