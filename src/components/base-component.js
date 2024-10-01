/**
 * Represents a base component for the app
 *
 * @extends HTMLElement
 */
export class BaseComponent extends HTMLElement {
  #destroyController = new AbortController();
  destroyedSignal = this.#destroyController.signal;

  constructor(templateText, stylesText) {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = stylesText;

    const templateElement = document.createElement('template');
    templateElement.innerHTML = templateText;

    shadow.appendChild(style);
    shadow.appendChild(templateElement.content.cloneNode(true));
  }
}
