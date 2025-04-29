export function render(vnode, container) {
  container.innerHTML = '';
  container.appendChild(createDomElement(vnode));
}

export function rerender() {
    // Add rerender logic if needed for future diff optimization
  }