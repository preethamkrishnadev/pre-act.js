if (typeof Promise === 'undefined') {
    import('https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js');
  }
  
  if (typeof Object.assign !== 'function') {
    Object.assign = function(target, ...args) {
      if (target == null) throw new TypeError('Cannot convert undefined or null to object');
      for (let i = 0; i < args.length; i++) {
        const source = args[i];
        if (source != null) {
          for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }
      }
      return target;
    };
  }
  