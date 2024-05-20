/**
 * @class Preview
 * @extends HTMLElement
 *
 * @classdesc Custom element to display a preview dialog with an image, title, and description.
 */
class Preview extends HTMLElement {
  /**
   * Creates an instance of Preview.
   * The constructor initializes the shadow DOM, sets up the template, and attaches event listeners.
   */
  constructor() {
    super();
    console.log("Preview constructor called");

    const template = document.createElement("template");
    template.innerHTML = `
    <link rel="stylesheet" href="./styles.css" />
      <dialog class="overlay">
        <div class="overlay__preview">
          <img class="overlay__blur" data-list-blur src="" />
          <img class="overlay__image" data-list-image src="" />
        </div>
        <div class="overlay__content">
          <h3 class="overlay__title" data-list-title></h3>
          <div class="overlay__data" data-list-subtitle></div>
          <p class="overlay__data overlay__data_secondary" data-list-description></p>
        </div>
        <div class="overlay__row">
          <button class="overlay__button overlay__button_primary" data-list-close>Close</button>
        </div>
      </dialog>
    `;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    /**
     * @property {HTMLDialogElement} dialog - The dialog element.
     */
    this.dialog = shadowRoot.querySelector("dialog");

    const closeButton = shadowRoot.querySelector("[data-list-close]");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.close());
    }
  }

  /**
   * Opens the preview dialog and displays the backdrop.
   * @param {Object} data - The data to display in the preview.
   * @param {string} data.image - The URL of the image to display.
   * @param {string} data.title - The title of the preview.
   * @param {string} data.author - The author of the preview content.
   * @param {string} data.published - The published date of the preview content.
   * @param {string} data.description - The description of the preview content.
   */
  open(data) {
    const { image, title, author, published, description } = data;

    this.shadowRoot.querySelector("img[data-list-blur]").src = image;
    this.shadowRoot.querySelector("img[data-list-image]").src = image;
    this.shadowRoot.querySelector("[data-list-title]").textContent = title;
    this.shadowRoot.querySelector("[data-list-subtitle]").textContent = `${author} (${new Date(published).getFullYear()})`;
    this.shadowRoot.querySelector("[data-list-description]").textContent = description;

    this.dialog.showModal();
  }

  /**
   * Closes the preview dialog.
   */
  close() {
    this.dialog.close();
  }
}

customElements.define("data-list-active", Preview);

export default Preview;


