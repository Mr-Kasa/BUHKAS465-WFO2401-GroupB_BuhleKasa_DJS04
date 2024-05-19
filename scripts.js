import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
//import Preview from './components/preview.js'; // Assuming this path is correct

let page = 1;
let matches = books;

document.addEventListener("DOMContentLoaded", () => {
  /**
   * @typedef {Object} DomElements
   * @property {HTMLElement} dataListItems - Element for listing items.
   * @property {HTMLElement} dataListButton - Button to load more items.
   * @property {HTMLElement} dataSearchOverLay - Search overlay element.
   * @property {HTMLElement} dataSettingsOverlay - Settings overlay element.
   * @property {HTMLElement} dataListActive - Active preview element.
   * @property {HTMLElement} closeBtn - Close button element.
   */
  const DomElements = {
    dataListItems: document.querySelector("[data-list-items]"),
    dataListButton: document.querySelector("[data-list-button]"),
    dataSearchOverLay: document.querySelector("[data-search-overlay]"),
    dataSettingsOverlay: document.querySelector("[data-settings-overlay]"),
    dataListActive: document.querySelector("[data-list-active]"), // Ensure this element is in your HTML
    showLess: document.querySelector("[data-list-close]"),
  };

  /**
   * Appends a UI element with the provided book details.
   *
   * @param {string} image - The source URL of the book image.
   * @param {string} title - The title of the book.
   * @param {string} author - The author of the book.
   * @param {HTMLElement} appendItems - The element to which the new element will be appended.
   * @param {HTMLElement} Element - The template element to clone.
   */
  function UIAppender(image, title, author, appendItems, Element) {
    const newElement = Element.cloneNode(true);
    newElement.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;
    appendItems.appendChild(newElement);
  }

  let CreateDocumentFragment = document.createDocumentFragment();

  for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);
    UIAppender(image, title, author, CreateDocumentFragment, element);
  }

  DomElements.dataListItems.appendChild(CreateDocumentFragment);

  const firstGenreElement = document.createElement("option");
  firstGenreElement.value = "any";
  firstGenreElement.innerText = "All Genres";
  CreateDocumentFragment.appendChild(firstGenreElement);

  for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    CreateDocumentFragment.appendChild(element);
  }

  document
    .querySelector("[data-search-genres]")
    .appendChild(CreateDocumentFragment);

  const firstAuthorElement = document.createElement("option");
  firstAuthorElement.value = "any";
  firstAuthorElement.innerText = "All Authors";
  CreateDocumentFragment.appendChild(firstAuthorElement);

  for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement("option");
    element.value = id;
    element.innerText = name;
    CreateDocumentFragment.appendChild(element);
  }

  document
    .querySelector("[data-search-authors]")
    .appendChild(CreateDocumentFragment);

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.querySelector("[data-settings-theme]").value = "night";
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.querySelector("[data-settings-theme]").value = "day";
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty(
      "--color-light",
      "255, 255, 255"
    );
  }



  /**
   * Hides the extra books and shows only the first 36.
   */
  function hideExtraBooks() {
    const previews = DomElements.dataListItems.querySelectorAll(".preview");
    previews.forEach((preview, index) => {
      if (index >= 36) {
        preview.style.display = "none";
      } else {
        preview.style.display = "";
      }
    });
  }

  /**
   * Handles the show less click event.
   */
  function closeBtnHandler() {
    hideExtraBooks();
    DomElements.showLess.style.display = "none";
    DomElements.dataListButton.style.display = "block";
  }

  DomElements.showLess.addEventListener("click", closeBtnHandler);

  /**
   * Updates the "Show More" button text based on remaining books.
   */
  const showMoreBtnUpdater = () => {
    DomElements.dataListButton.innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${
              matches.length - page * BOOKS_PER_PAGE > 0
                ? matches.length - page * BOOKS_PER_PAGE
                : 0
            })</span>
        `;

    // Show the close button only if there are more than 36 books
    if (DomElements.dataListItems.querySelectorAll(".preview").length > 36) {
      DomElements.showLess.style.display = "block";
    } else {
      DomElements.showLess.style.display = "none";
    }
  };

  showMoreBtnUpdater();

  /**
   * Event listener for the "Show More" button to load more items.
   */
  DomElements.dataListButton.addEventListener("click", () => {
    const startIndex = page * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    const newBooks = matches.slice(startIndex, endIndex);

    if (newBooks.length > 0) {
      const newElementsFragment = document.createDocumentFragment();

      for (const { author, id, image, title } of newBooks) {
        const element = document.createElement("button");
        element.classList = "preview";
        element.setAttribute("data-preview", id);
        UIAppender(image, title, author, newElementsFragment, element);
      }

      DomElements.dataListItems.appendChild(newElementsFragment);
      page++;

      DomElements.dataListButton.disabled =
        matches.length - page * BOOKS_PER_PAGE < 1;

      showMoreBtnUpdater();

      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  });

  /**
   * Event listener for the search cancel button to close the search overlay.
   */
  document
    .querySelector("[data-search-cancel]")
    .addEventListener("click", () => {
      DomElements.dataSearchOverLay.open = false;
    });

  /**
   * Event listener for the settings cancel button to close the settings overlay.
   */
  document
    .querySelector("[data-settings-cancel]")
    .addEventListener("click", () => {
      DomElements.dataSettingsOverlay.open = false;
    });

  /**
   * Event listener for the search header button to open the search overlay.
   */
  document
    .querySelector("[data-header-search]")
    .addEventListener("click", () => {
      DomElements.dataSearchOverLay.open = true;
      document.querySelector("[data-search-title]").focus();
    });

  /**
   * Event listener for the settings header button to open the settings overlay.
   */
  document
    .querySelector("[data-header-settings]")
    .addEventListener("click", () => {
      DomElements.dataSettingsOverlay.open = true;
    });

  /**
   * Event listener for the settings form submission to apply the selected theme.
   */
  document
    .querySelector("[data-settings-form]")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const { theme } = Object.fromEntries(formData);

      if (theme === "night") {
        document.documentElement.style.setProperty(
          "--color-dark",
          "255, 255, 255"
        );
        document.documentElement.style.setProperty(
          "--color-light",
          "10, 10, 20"
        );
      } else {
        document.documentElement.style.setProperty(
          "--color-dark",
          "10, 10, 20"
        );
        document.documentElement.style.setProperty(
          "--color-light",
          "255, 255, 255"
        );
      }

      DomElements.dataSettingsOverlay.open = false;
    });

  /**
   * Event listener for the search form submission to filter and display books.
   */
  document
    .querySelector("[data-search-form]")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const filters = Object.fromEntries(formData);
      const result = [];

      for (const book of books) {
        let genreMatch = filters.genre === "any";

        for (const singleGenre of book.genres) {
          if (genreMatch) break;
          if (singleGenre === filters.genre) {
            genreMatch = true;
          }
        }

        if (
          (filters.title.trim() === "" ||
            book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
          (filters.author === "any" || book.author === filters.author) &&
          genreMatch
        ) {
          result.push(book);
        }
      }

      page = 1;
      matches = result;

      if (result.length < 1) {
        document
          .querySelector("[data-list-message]")
          .classList.add("list__message_show");
      } else {
        document
          .querySelector("[data-list-message]")
          .classList.remove("list__message_show");
      }

      DomElements.dataListItems.innerHTML = "";

      for (const { author, id, image, title } of result.slice(
        0,
        BOOKS_PER_PAGE
      )) {
        const element = document.createElement("button");
        element.classList = "preview";
        element.setAttribute("data-preview", id);
        UIAppender(image, title, author, CreateDocumentFragment, element);
      }

      DomElements.dataListItems.appendChild(CreateDocumentFragment);
      DomElements.dataListButton.disabled =
        matches.length - page * BOOKS_PER_PAGE < 1;

      DomElements.dataListButton.innerHTML = `
            <span>Show more</span>
            <span class="list__remaining"> (${
              matches.length - page * BOOKS_PER_PAGE > 0
                ? matches.length - page * BOOKS_PER_PAGE
                : 0
            })</span>
        `;

      window.scrollTo({ top: 0, behavior: "smooth" });
      DomElements.dataSearchOverLay.open = false;
    });

  /**
   * Event listener for the book list items to display the book details in the preview.
   */
  DomElements.dataListItems.addEventListener("click", (event) => {
    console.log("Click event triggered");
    const pathArray = Array.from(event.composedPath());
    console.log("Path array:", pathArray);
    let active;

    for (const node of pathArray) {
      if (active) break;

      if (node?.dataset?.preview) {
        active = books.find((book) => book.id === node.dataset.preview);
      }
    }

    if (active) {
      const dataListActive = document.querySelector("data-list-active");
      if (!dataListActive) {
        console.error("dataListActive element not found");
        return;
      }

      const shadowRoot = dataListActive.shadowRoot;
      if (!shadowRoot) {
        console.error("No shadowRoot found");
        return;
      }

      const dataListBlur = shadowRoot.querySelector("img[data-list-blur]");
      const dataListImage = shadowRoot.querySelector("img[data-list-image]");

      if (!dataListBlur || !dataListImage) {
        console.error("Required elements not found in the shadow DOM");
        console.log(shadowRoot.innerHTML); // Check what's inside shadowRoot
        return;
      }

      if (active && active.image) {
        dataListBlur.src = active.image;
        dataListImage.src = active.image;
      } else {
        console.error("active.image is undefined or null");
      }

      shadowRoot.querySelector("[data-list-title]").textContent = active.title;
      shadowRoot.querySelector("[data-list-subtitle]").textContent = `${
        authors[active.author]
      } (${new Date(active.published).getFullYear()})`;
      shadowRoot.querySelector("[data-list-description]").textContent =
        active.description;
      dataListActive.open();
    }
  });

  // Initially hide books after the first 36 and set up the close button visibility

 
});
