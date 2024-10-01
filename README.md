# Easy Charts
Created for Dev Challenge XXI Online Round

## Description
Easy Charts is a library to easily create charts based on data in different formats

## Technical Information
The solution is based on pure vanilla js with SheetJS lib only (to read xls/xlsx files) using [Vite](https://vitejs.dev/) as a bundler.

For tests it is using [Vitest](https://vitest.dev/) that is using [WebdriverIO](https://webdriver.io/) under the hood.

## Project structure
- `components` - Project is using component-based approach with custom elements. Components are using `ec-` prefix that means "easy charts."
    - The `ec-app` component is the main component containing the whole app, routing logic and app state.
- `styles` - additional styles
    - `common` - styles that are common for the app and most likely needed in most/all components
- `main.js` - file defines all components

## Available functionality

## How to run
1. Clone the repo
2. Run `npm install`
3. Run `npm run dev`

## How to run test
1. Clone the repo
2. Run `npm install`
3. Run `npm run test`
