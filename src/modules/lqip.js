const defaults = {
  selector: '[data-lqip-src],[data-lqip-srcset]',
  selectorRoot: document,
  root: null,
  rootMargin: '100% 0px 100% 0px',
  treshold: 0,
  afterReplace: null,
}

let observer;

const onload = (event) => {
  const { target } = event;
  window.setTimeout(() => {
    target.classList.add('lqip__loaded');
  }, 1);
}

const replacePlaceholder = (placeholder, options) => {
  const transitionend = (event) => {
    event.target.classList.remove('lqip__loading');
    event.target.removeEventListener('transitionend', transitionend);
    options.afterReplace(placeholder, event.target);
  }

  const img = document.createElement('img');
  if (options && typeof options.afterReplace === 'function') {
    img.addEventListener('transitionend', transitionend, false);
  }
  const srcset = placeholder.getAttribute('data-lqip-srcset');
  const src = placeholder.getAttribute('data-lqip-src');
  img.classList.add('lqip__original', 'lqip__loading');
  img.alt = placeholder.alt;
  if (src) {
    img.removeAttribute('data-lqip-src');
    img.src = src;
  }
  if (srcset) {
    img.removeAttribute('data-lqip-srcset');
    img.setAttribute('srcset', srcset);
    img.setAttribute('sizes', placeholder.getAttribute('sizes'));
  }
  placeholder.parentNode.appendChild(img);
  img.addEventListener('load', onload, false);
}

const lqip = (userOptions = defaults) => {
  // Compatability check
  if (
    !('querySelectorAll' in document) ||
    !('IntersectionObserver' in window) ||
    !('assign' in Object)
  ) {
    /* eslint no-console: 0 */
    console.log('The lqip module is not compatible with this browser.');

    // Just replace all images instantly
    const images = document.getElementsByTagName('img');
    const lqipImages = Array.prototype.filter.call(images, (img) => {
      const isLQIP = img.hasAttribute('data-lqip-src') || img.hasAttribute('data-lqip-srcset');
      return isLQIP;
    });

    lqipImages.forEach((img) => {
      if (img.hasAttribute('data-lqip-src')) img.src = img.getAttribute('data-lqip-src');
      if (img.hasAttribute('data-lqip-srcset')) img.setAttribute('srcset', img.getAttribute('data-lqip-srcset'));
      if (typeof userOptions.afterReplace === 'function') {
        userOptions.afterReplace(null, img);
      }
    });

    // Give up, there is no use in trying
    return false;
  }

  const options = Object.assign({}, defaults, userOptions);

  const loader = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        replacePlaceholder(entry.target, options);
        observer.unobserve(entry.target);
      }
    });
  }

  const images = options.selectorRoot.querySelectorAll(options.selector);
  observer = new IntersectionObserver(loader, {
    root: options.root,
    rootMargin: options.rootMargin,
    treshold: options.treshold,
  });

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('lqip__wrapper');

  for (let i = 0; i < images.length; i++) {
    const image = images[i];

    observer.observe(image);

    // Prepare markup
    if (!image.parentElement.classList.contains('lqip__wrapper')) {
      const wrapper = wrapperDiv.cloneNode();
      image.parentNode.insertBefore(wrapper, image);
      wrapper.appendChild(image);
    }
  }

  return observer;
}

export default lqip;
