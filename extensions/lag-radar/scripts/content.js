/**
 * Create SVG element. This function is a helper to create SVG elements
 * with attributes and children.
 * @param {string} tag - SVG tag name
 * @param {Object} props - SVG tag attributes
 * @param {SVGElement[]} children - element children
 * @returns {SVGElement} - SVG Element
 */
function createSVG(tag, props = {}, children = []) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.keys(props).forEach(prop => el.setAttribute(prop, props[prop]));
  children.forEach(child => el.appendChild(child));
  return el;
}

/**
 * Renders a radar visualization based on the provided settings. Also listens
 * for changes in the settings and re-renders the radar when they change.
 *
 * Licence: ISC copyright: @mobz 2018
 * The original radar code was written by @mobz and can be found at:
 * @see https://github.com/mobz/lag-radar
 *
 * @param {Object} settings - The settings for rendering the radar.
 * @param {number} settings.size - The size of the radar in pixels.
 * @param {number} [settings.inset=3] - The inset of the radar in pixels.
 * @param {number} [settings.frames=60] - The number of frames in the radar animation.
 * @param {number} [settings.speed=0.01] - The speed of the radar animation.
 * @param {boolean} [settings.visible=true] - Indicates whether the radar is visible.
 */
function render(settings = {}) {
  settings.inset = 3;

  const PI2 = Math.PI * 2;
  const middle = settings.size / 2;
  const radius = middle - settings.inset;

  const hand = createSVG('path', { class: 'hand' });
  const arcs = new Array(settings.frames).fill('path').map(t => createSVG(t));
  const radar = createSVG('svg', { class: 'radar', height: settings.size, width: settings.size }, [
    createSVG('circle', {
      class: 'face',
      cx: middle,
      cy: middle,
      r: radius,
    }),
    createSVG('g', { class: 'sweep' }, arcs),
    hand,
  ]);

  let frame;
  let framePtr = 0;
  let last = {
    rotation: 0,
    now: Date.now(),
    tx: middle + radius,
    ty: middle,
  };

  const calcHue = (() => {
    const max_hue = 120;
    const max_ms = 1000;
    const log_f = 10;
    const mult = max_hue / Math.log(max_ms / log_f);
    return function (ms_delta) {
      return max_hue - Math.max(0, Math.min(mult * Math.log(ms_delta / log_f), max_hue));
    };
  })();

  function animate() {
    const now = Date.now();
    const rdelta = Math.min(PI2 - settings.speed, settings.speed * (now - last.now));
    const rotation = (last.rotation + rdelta) % PI2;
    const tx = middle + radius * Math.cos(rotation);
    const ty = middle + radius * Math.sin(rotation);
    const bigArc = rdelta < Math.PI ? '0' : '1';
    const path = `M${tx} ${ty}A${radius} ${radius} 0 ${bigArc} 0 ${last.tx} ${last.ty}L${middle} ${middle}`;
    const hue = calcHue(rdelta / settings.speed);

    arcs[framePtr % settings.frames].setAttribute('d', path);
    arcs[framePtr % settings.frames].setAttribute('fill', `hsl(${hue}, 80%, 40%)`);
    hand.setAttribute('d', `M${middle} ${middle}L${tx} ${ty}`);
    hand.setAttribute('stroke', `hsl(${hue}, 80%, 60%)`);

    for (let i = 0; i < settings.frames; i++) {
      arcs[(settings.frames + framePtr - i) % settings.frames].style.fillOpacity =
        1 - i / settings.frames;
    }

    framePtr++;
    last = { now, rotation, tx, ty };
    frame = window.requestAnimationFrame(animate);
  }

  if (settings.visible) {
    document.body.appendChild(radar);
    animate();
  }

  function destroy() {
    if (frame) {
      window.cancelAnimationFrame(frame);
    }
    radar.remove();
  }

  async function onStorageChange() {
    const { settings } = await chrome.storage.local.get('settings');
    destroy();
    chrome.storage.onChanged.removeListener(onStorageChange);
    render(settings);
  }

  chrome.storage.onChanged.addListener(onStorageChange);
}

/**
 * This is the main entry point for the content script. It will be executed
 * every time the user navigates to a page that matches the extension's. It
 * will render the radar and listen for changes in the settings to re-render
 */
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get('settings').then(({ settings }) => render(settings));
});
