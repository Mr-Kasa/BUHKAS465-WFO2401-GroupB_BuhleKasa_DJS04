import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";
// import Theme from './theme.js';

let page = 1;
let matches = books;

/**
 * Initializes the application when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const DomElements = {
    dataListItems: document.querySelector("[data-list-items]"),
    dataListButton: document.querySelector("[data-list-button]"),
    dataSearchOverLay: document.querySelector("[data-search-overlay]"),
    dataSettingsOverlay: document.querySelector("theme-component").shadowRoot.querySelector("[data-settings-overlay]"),
    dataListActive: document.querySelector("data-list-active"), // Ensure this element is in your HTML
    showLess: document.querySelector("[data-list-close]"),
  };

  /**
   * Appends a new UI element to the specified container.
   * @param {string} image - The image URL of the book.
   * @param {string} title - The title of the book.
   * @param {string} author - The author ID of the book.
   * @param {HTMLElement} appendItems - The container to append the new element to.
   * @param {HTMLElement} Element - The base element to clone and modify.
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

  // Populate genres
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

  document.querySelector("[data-search-genres]").appendChild(CreateDocumentFragment);

  // Populate authors
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

  document.querySelector("[data-search-authors]").appendChild(CreateDocumentFragment);

  /**
   * Hides extra books that exceed a certain limit.
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
   * Handles the close button click event to hide extra books and update UI elements.
   */
  function closeBtnHandler() {
    hideExtraBooks();
    DomElements.showLess.style.display = "none";
    DomElements.dataListButton.style.display = "block";
  }

  DomElements.showLess.addEventListener("click", closeBtnHandler);

  /**
   * Updates the "Show more" button and its visibility.
   */
  const showMoreBtnUpdater = () => {
    DomElements.dataListButton.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0})</span>
    `;

    if (DomElements.dataListItems.querySelectorAll(".preview").length > 36) {
      DomElements.showLess.style.display = "block";
    } else {
      DomElements.showLess.style.display = "none";
    }
  };

  showMoreBtnUpdater();

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

      DomElements.dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE < 1;
      showMoreBtnUpdater();
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  });

  document.querySelector("[data-search-cancel]").addEventListener("click", () => {
    DomElements.dataSearchOverLay.open = false;
  });

  document.querySelector("[data-header-search]").addEventListener("click", () => {
    DomElements.dataSearchOverLay.open = true;
    document.querySelector("[data-search-title]").focus();
  });

  document.querySelector("[data-header-settings]").addEventListener("click", () => {
    DomElements.dataSettingsOverlay.showModal();
  });

  document.querySelector("[data-search-form]").addEventListener("submit", (event) => {
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
        (filters.title.trim() === "" || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
        (filters.author === "any" || book.author === filters.author) &&
        genreMatch
      ) {
        result.push(book);
      }
    }

    page = 1;
    matches = result;

    if (result.length < 1) {
      document.querySelector("[data-list-message]").classList.add("list__message_show");
    } else {
      document.querySelector("[data-list-message]").classList.remove("list__message_show");
    }

    DomElements.dataListItems.innerHTML = "";

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
      const element = document.createElement("button");
      element.classList = "preview";
      element.setAttribute("data-preview", id);
      UIAppender(image, title, author, CreateDocumentFragment, element);
    }

    DomElements.dataListItems.appendChild(CreateDocumentFragment);
    DomElements.dataListButton.disabled = matches.length - page * BOOKS_PER_PAGE < 1;

    DomElements.dataListButton.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${matches.length - page * BOOKS_PER_PAGE > 0 ? matches.length - page * BOOKS_PER_PAGE : 0})</span>
    `;

    window.scrollTo({ top: 0, behavior: "smooth" });
    DomElements.dataSearchOverLay.open = false;
  });

  DomElements.dataListItems.addEventListener("click", (event) => {
    const pathArray = Array.from(event.composedPath());
    let active;

    for (const node of pathArray) {
      if (active) break;

      if (node?.dataset?.preview) {
        active = books.find((book) => book.id === node.dataset.preview);
      }
    }

    if (active) {
      DomElements.dataListActive.open({
        image: active.image,
        title: active.title,
        author: authors[active.author],
        published: active.published,
        description: active.description,
      });
    }
  });

  hideExtraBooks();
});

