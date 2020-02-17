// See: https://github.com/facebook/react/blob/9def56ec0e1e71928ee999f48c00b1803ed8772a/packages/react-dom/src/client/ReactDOMComponentTree.js
const randomKey = Math.random()
  .toString(36)
  .slice(2);
export const internalContainerInstanceKey = "__reactContainere$" + randomKey;
export const internalReactPixiFiberRootInstanceKey = "__reactPixiFiberRoot$" + randomKey;

export function markContainerAsRoot(hostRoot, node) {
  node[internalContainerInstanceKey] = hostRoot;
}

export function unmarkContainerAsRoot(node) {
  node[internalContainerInstanceKey] = null;
}

export function isContainerMarkedAsRoot(node) {
  return !!node[internalContainerInstanceKey];
}
