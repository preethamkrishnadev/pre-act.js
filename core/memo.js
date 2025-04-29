function deepEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

export function memo(Component, areEqual = deepEqual) {
  return function MemoizedComponent(props, node) {
    const cacheKey = `${Component.name}_${JSON.stringify(props)}`;
    const lastRender = node.memoCache?.[Component.name];

    if (lastRender && areEqual(lastRender.props, props)) {
      return lastRender.vnode;
    }

    const vnode = Component(props, node);
    node.memoCache = node.memoCache || {};
    node.memoCache[Component.name] = { props, vnode };
    return vnode;
  };
}
