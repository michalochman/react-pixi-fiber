// The 13 core tags, PixiJS 8 spelling. Every PixiJS adapter implements all of them.
export const TAGS = {
  AnimatedSprite: "AnimatedSprite",
  BitmapText: "BitmapText",
  Container: "Container",
  Graphics: "Graphics",
  Mesh: "Mesh",
  MeshPlane: "MeshPlane",
  MeshRope: "MeshRope",
  MeshSimple: "MeshSimple",
  NineSliceSprite: "NineSliceSprite",
  ParticleContainer: "ParticleContainer",
  Sprite: "Sprite",
  Text: "Text",
  TilingSprite: "TilingSprite",
} as const;
export type Tag = keyof typeof TAGS;
// 2.x tag names, resolved after the registry and the adapter. Removed in 4.0.0.
export const DEPRECATED_TAGS: Record<string, Tag> = { NineSlicePlane: "NineSliceSprite" };
