export function onEnter(el, animation = 'fade-in') {
  el.classList.add('preact-anim-enter', animation);
  requestAnimationFrame(() => {
    el.classList.add('preact-anim-enter-active');
  });
}

export function onExit(el, animation = 'fade-out', done = () => {}) {
  el.classList.add('preact-anim-exit', animation);
  el.addEventListener('animationend', done, { once: true });
}
