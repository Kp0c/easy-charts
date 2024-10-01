import template from './header.html?raw';
import styles from './header.css?inline'
import { BaseComponent } from '../base-component.js';

export class Header extends BaseComponent {
  #THEME_LOCAL_STORAGE_KEY = 'theme';
  #enableLight;
  #enableDark;

  constructor() {
    super(template, styles);
    this.#enableLight = this.shadowRoot.getElementById('enable-light');
    this.#enableDark = this.shadowRoot.getElementById('enable-dark');

    this.#initTheme();

    this.#enableLight.addEventListener('click', () => {
      this.#setTheme('light');
    }, {
      signal: this.destroyedSignal,
    });

    this.#enableDark.addEventListener('click', () => {
      this.#setTheme('dark');
    }, {
      signal: this.destroyedSignal,
    });
  }

  #initTheme() {
    let theme = localStorage.getItem(this.#THEME_LOCAL_STORAGE_KEY);
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    this.#setTheme(theme);
  }

  #setTheme(theme) {
    localStorage.setItem(this.#THEME_LOCAL_STORAGE_KEY, theme);
    document.body.style.setProperty('color-scheme', theme);

    this.#renderButtons(theme)
  }

  #renderButtons(theme) {
    this.#enableLight.hidden = theme === 'light';
    this.#enableDark.hidden = theme === 'dark';
  }
}

