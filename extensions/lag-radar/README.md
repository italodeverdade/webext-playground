The Lag Radar extension is a tool that helps developers visualize and debug performance issues in their web applications. Is created using [lag-radar from mobz](https://github.com/mobz/lag-radar) to visualize a radar in your screen.

## Features

- **Radar Visibility**: The radar can be toggled on and off using the settings page (popup) when clicking in the extension icon.
- **Lag Visualization**: The radar will show a visual representation of the performance of your web application in real-time using HSL colors.

## Usage

1. Load the extension as unpacked.
2. Open the popup interface to control the radar visibility.
3. The radar will appear on your web application, showing drops below 60fp in real-time.

## Chrome Extension API

This extensions uses the following Chrome Extension APIs:
| API | Description |
| --- | ----------- |
| [chrome.storage](https://developer.chrome.com/docs/extensions/reference/storage/) | To persist radar settings in local. |
| [chrome.i18n](https://developer.chrome.com/docs/extensions/reference/i18n/) | To provide internationalization support. |

## Development

The main scripts for this extension are located in [content.js](scripts/content.js), [popup.js](pages/popup/popup.js) and [sw.js](scripts/sw.js).

## Contributing

Contributions are welcome!
