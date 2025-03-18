#!/bin/sh

echo "Removing react-pixi-fiber from node_modules"
rm -rf node_modules/react-pixi-fiber && \
echo "- ok"

echo "Injecting local react-pixi-fiber into node_modules"
mkdir -p node_modules/react-pixi-fiber && \
cp -R ../index.js node_modules/react-pixi-fiber/ && \
cp -R ../cjs node_modules/react-pixi-fiber/ && \
cp ../package.json node_modules/react-pixi-fiber/ && \
echo "- ok"

echo "Invalidate node_modules cache"
rm -rf node_modules/.cache && \
echo "- ok"

