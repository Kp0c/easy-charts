import { App } from './components/app/app.js';
import { Header } from "./components/header/header.js";
import { Alerts } from './components/alerts/alerts.js';
import { Upload } from './components/upload/upload.js';

window.customElements.define('ec-app', App);
window.customElements.define('ec-header', Header);
window.customElements.define('ec-upload', Upload);
window.customElements.define('ec-alerts', Alerts);
