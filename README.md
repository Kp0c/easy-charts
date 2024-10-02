# Easy Charts
Created for Dev Challenge XXI Online Round

## Description
Easy Charts is a library to easily create charts based on data in different formats

## Technical Information
The solution is based on pure vanilla js with SheetJS lib only (to read xls/xlsx files) using [Vite](https://vitejs.dev/) as a bundler.

For tests it is using [Vitest](https://vitest.dev/) that is using [WebdriverIO](https://webdriver.io/) under the hood.

## Project structure
- `components` - Project is using component-based approach with custom elements. Components are using `ec-` prefix that means "easy charts."
    - The `ec-app` component is the main component containing the whole app, and manages the data.
    - The `ec-header` component for the header
    - The `ec-upload` component for the upload section. It parses all files into an object array.
    - The `ec-alerts` component for the alerts section
    - The `ec-data-preview` component to preview data
    - The `ec-data-errors` component to preview data errors
    - The `ec-chart` component to display the chart
  - `base-component.js` - Base component that is used as a base for all components
- `helpers` - Helper classes
    - `observable` - Observable implementation to add reactivity to the app
    - `files.helper` - Functions that are helping to work with files
- `models` - Models
    - `chart-data` - Chart Data model
- `services` - Services
    - `alerts.service` - A service to show alerts
- `styles` - additional styles
    - `common` - styles that are common for the app and most likely needed in most/all components
- `main.js` - file defines all components
- `main.css` - main css file that defines some top-level styles

## Available functionality
- Theming
- Read CSV/Excel/JSON and validate them
- Preview data in the table format
- Generate Bar/Line/Pie Charts
- Export as PNG/SVG
- Print chart

## How to run
1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`

## How to run test
1. Clone the repo
2. Run `npm install`
3. Run `npm run test`
