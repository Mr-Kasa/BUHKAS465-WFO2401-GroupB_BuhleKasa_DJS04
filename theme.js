/**
 * A custom web component that provides a theme selection overlay.
 * 
 * @class
 * @extends {HTMLElement}
 */
class Theme extends HTMLElement {
  /**
   * Creates an instance of the Theme component.
   * The constructor sets up the shadow DOM and event listeners.
   */
  constructor() {
    super();
    console.log("Theme constructor called");

    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        :host {
          --color-blue: 0, 150, 255;
          --color-force-dark: 10, 10, 20;
          --color-force-light: 255, 255, 255;
          --color-dark: 10, 10, 20;
          --color-light: 255, 255, 255;
        }

        @media (prefers-color-scheme: dark) {
          :host {
            --color-dark: 255, 255, 255; 
            --color-light: 10, 10, 20;
          }
        }

        * {
          box-sizing: border-box;
        }

        .overlay {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          border-width: 0;
          box-shadow: 0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12);
          animation-name: enter;
          animation-duration: 0.6s;
          z-index: 10;
          background-color: rgba(var(--color-light), 1);
        }

        @media (min-width: 30rem) {
          .overlay {
            max-width: 30rem;
            left: 0%;
            top: 0;
            border-radius: 8px;
          }
        }

        .overlay__form {
          padding-bottom: 0.5rem;
          margin: 0 auto;
        }

        .overlay__row {
          display: flex;
          gap: 0.5rem;
          margin: 0 auto;
          justify-content: center;
        }

        .overlay__button {
          font-family: Roboto, sans-serif;
          background-color: rgba(var(--color-blue), 0.1);
          transition: background-color 0.1s;
          border-width: 0;
          border-radius: 6px;
          height: 2.75rem;
          cursor: pointer;
          width: 50%;
          color: rgba(var(--color-blue), 1);
          font-size: 1rem;
          border: 1px solid rgba(var(--color-blue), 1);
        }

        .overlay__button_primary {
          background-color: rgba(var(--color-blue), 1);
          color: rgba(var(--color-force-light), 1);
        }

        .overlay__button:hover {
          background-color: rgba(var(--color-blue), 0.2);
        }

        .overlay__button_primary:hover {
          background-color: rgba(var(--color-blue), 0.8);
          color: rgba(var(--color-force-light), 1);
        }

        .overlay__input {
          width: 100%;
          margin-bottom: 0.5rem;
          background-color: rgba(var(--color-dark), 0.05);
          border-width: 0;
          border-radius: 6px;
          width: 100%;
          height: 4rem;
          color: rgba(var(--color-dark), 1);
          padding: 1rem 0.5rem 0 0.75rem;
          font-size: 1.1rem;
          font-weight: bold;
          font-family: Roboto, sans-serif;
          cursor: pointer;
        }

        .overlay__input_select {
          padding-left: 0.5rem;
        }

        .overlay__field {
          position: relative;
          display: block;
        }

        .overlay__label {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          font-size: 0.85rem;
          color: rgba(var(--color-dark), 0.4);
        }

        .overlay__input:hover {
          background-color: rgba(var(--color-dark), 0.1);
        }

        .overlay__content {
          padding: 2rem 1.5rem;
          text-align: center;
          padding-top: 3rem;
        }
        option {
          color: black;
        }
      </style>
      <dialog class="overlay" data-settings-overlay>
        <div class="overlay__content">
          <form class="overlay__form" data-settings-form id="settings">
            <label class="overlay__field">
              <div class="overlay__label">Theme</div>
              <select class="overlay__input overlay__input_select" data-settings-theme name="theme">
                <option value="day">Day</option>
                <option value="night">Night</option>
              </select>
            </label>
          </form>
          <div class="overlay__row">
            <button class="overlay__button" data-settings-cancel>Cancel</button>
            <button class="overlay__button overlay__button_primary" type="submit" form="settings">Save</button>
          </div>
        </div>
      </dialog>
    `;

    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));

    this.dialog = shadowRoot.querySelector('[data-settings-overlay]');
    const cancelBtn = shadowRoot.querySelector('[data-settings-cancel]');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.close();
      });
    }

    const themeForm = shadowRoot.querySelector('[data-settings-form]');
    if (themeForm) {
      themeForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const { theme } = Object.fromEntries(formData);

        if (theme === "night") {
          document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
          document.documentElement.style.setProperty("--color-light", "10, 10, 20");
        } else {
          document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
          document.documentElement.style.setProperty("--color-light", "255, 255, 255");
        }

        this.dialog.close();
      });
    }

    this.applyInitialTheme();
  }

  /**
   * Applies the initial theme based on the user's system preference.
   * Sets the theme select value and updates CSS variables.
   * @private
   */
  applyInitialTheme() {
    const themeSelect = this.shadowRoot.querySelector('[data-settings-theme]');
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      themeSelect.value = "night";
      document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
      document.documentElement.style.setProperty("--color-light", "10, 10, 20");
    } else {
      themeSelect.value = "day";
      document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
      document.documentElement.style.setProperty("--color-light", "255, 255, 255");
    }
  }

  /**
   * Closes the theme settings dialog.
   */
  close() {
    this.dialog.close();
  }
}

customElements.define('theme-component', Theme);

export default Theme;

