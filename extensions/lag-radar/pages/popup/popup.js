/**
 * This file is responsible for the popup window that appears when the,
 * user clicks on the extension icon. It will allow the user to change,
 * the settings of the lag radar.
 */
const form = document.querySelector('#settings-form');
const frames = document.querySelector('#settings-frames');
const size = document.querySelector('#settings-size');
const speed = document.querySelector('#settings-speed');
const visible = document.querySelector('#settings-visible');
const saveBtn = document.querySelector('#save');

function getIsRadarVisible() {
  return visible.getAttribute('data-checked') === 'true';
}

function getRadarVisibilityLabel(isVisible = false) {
  const label = isVisible ? 'radarVisibilityVisible' : 'radarVisibilityHidden';
  return chrome.i18n.getMessage(label);
}

function updateLocalSettings() {
  const isRadarVisible = getIsRadarVisible();
  visible.innerHTML = getRadarVisibilityLabel(isRadarVisible);
  chrome.storage.local.set({
    settings: {
      size: Number(size.value),
      frames: Number(frames.value),
      speed: Number(speed.value),
      visible: isRadarVisible,
    },
  });
}

let timeoutId = -1;
function showConfirmationUI() {
  saveBtn.innerHTML = chrome.i18n.getMessage('form_savedLabel');
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    saveBtn.innerHTML = chrome.i18n.getMessage('form_saveLabel');
  }, 2_000);
}

form.addEventListener('submit', e => {
  e.preventDefault();
  updateLocalSettings();
  showConfirmationUI();
});

visible.addEventListener('click', e => {
  e.preventDefault();
  visible.setAttribute('data-checked', !getIsRadarVisible());
  updateLocalSettings();
});

/**
 * Translate all the messages in the popup.html file. All element should
 * have a data-message attribute with the message name. This is a good
 * solution to update the messages without nodes individually in the page.
 */
for (const element of document.querySelectorAll('[data-message]')) {
  const message = element.getAttribute('data-message');
  element.innerHTML = chrome.i18n.getMessage(message);
}

/**
 * Load previous settings defined in the sw.js or already updated by
 * the user in the popup.
 */
chrome.storage.local.get('settings').then(({ settings }) => {
  size.value = settings.size;
  frames.value = settings.frames;
  speed.value = settings.speed;
  visible.innerHTML = getRadarVisibilityLabel(settings.visible);
  visible.setAttribute('data-checked', settings.visible);
});
