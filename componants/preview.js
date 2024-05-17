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
      <div class="backdrop" style="display: none;"></div>
    `;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    /**
     * @property {HTMLDialogElement} dialog - The dialog element.
     */
    this.dialog = shadowRoot.querySelector("dialog");

    /**
     * @property {HTMLDivElement} backdrop - The backdrop element.
     */
    this.backdrop = shadowRoot.querySelector(".backdrop");

    /**
     * @property {HTMLImageElement} dataListBlur - The blurred image element.
     */
    this.dataListBlur = shadowRoot.querySelector("[data-list-blur]");

    /**
     * @property {HTMLImageElement} dataListImage - The image element.
     */
    this.dataListImage = shadowRoot.querySelector("[data-list-image]");

    console.log("dataListBlur:", this.dataListBlur);
    console.log("dataListImage:", this.dataListImage);

    const closeButton = shadowRoot.querySelector("[data-list-close]");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.close());
    }
  }

  /**
   * Opens the preview dialog and displays the backdrop.
   */
  open() {
    this.dialog.showModal();
    this.backdrop.style.display = "block";
  }

  /**
   * Closes the preview dialog and hides the backdrop.
   */
  close() {
    this.dialog.close();
    this.backdrop.style.display = "none";
  }
}

customElements.define("data-list-active", Preview);

export default Preview;
