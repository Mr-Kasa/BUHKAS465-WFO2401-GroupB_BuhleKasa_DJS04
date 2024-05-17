import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';
//import Preview from './components/preview.js'; // Assuming this path is correct

let page = 1;
let matches = books;

document.addEventListener('DOMContentLoaded', () => {
    const DomElements = {
        dataListItems: document.querySelector('[data-list-items]'),
        dataListButton: document.querySelector('[data-list-button]'),
        dataSearchOverLay: document.querySelector('[data-search-overlay]'),
        dataSettingsOverlay: document.querySelector('[data-settings-overlay]'),
        dataListActive: document.querySelector('[data-list-active]'), // Ensure this element is in your HTML
        closeBtn : document.querySelector('[data-list-close]')
    };

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
    const element = document.createElement('button');
    element.classList = 'preview';
    element.setAttribute('data-preview', id);
    UIAppender(image, title, author, CreateDocumentFragment, element);
}

DomElements.dataListItems.appendChild(CreateDocumentFragment);

const firstGenreElement = document.createElement('option');
firstGenreElement.value = 'any';
firstGenreElement.innerText = 'All Genres';
CreateDocumentFragment.appendChild(firstGenreElement);

for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    CreateDocumentFragment.appendChild(element);
}

document.querySelector('[data-search-genres]').appendChild(CreateDocumentFragment);

const firstAuthorElement = document.createElement('option');
firstAuthorElement.value = 'any';
firstAuthorElement.innerText = 'All Authors';
CreateDocumentFragment.appendChild(firstAuthorElement);

for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    CreateDocumentFragment.appendChild(element);
}

document.querySelector('[data-search-authors]').appendChild(CreateDocumentFragment);

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector('[data-settings-theme]').value = 'night';
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    document.querySelector('[data-settings-theme]').value = 'day';
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}



// Hide all items after the first 36
document.querySelector('[data-list-close]').addEventListener('click', () => {
    // Hide items after the first 36

     // Check if the number of books is less than 37
     if (matches.length < 37) {
        document.querySelector('[data-list-close]').style.display = "none";
        document.querySelector('[data-list-close]').style.disabled = "true";
    } else {
        document.querySelector('[data-list-close]').style.display = "block";
        document.querySelector('[data-list-close]').style.disabled = "false";
    }
    const items = DomElements.dataListItems.querySelectorAll('.preview');
    for (let i = 36; i < items.length; i++) {
        items[i].style.display = 'none';
    }

});


const showMoreBtnUpdater = ()=> {
DomElements.dataListButton.innerHTML = `
<span>Show more</span>
<span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`;
if(DomElements.dataListItems.querySelectorAll('.preview').length<37){
    DomElements.closeBtn.style.display="none"
}
else {  DomElements.closeBtn.style.display="block"}
}

showMoreBtnUpdater()

DomElements.dataListButton.addEventListener('click', () => {
    const startIndex = page * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    const newBooks = matches.slice(startIndex, endIndex);

    if (newBooks.length > 0) {
        const newElementsFragment = document.createDocumentFragment();

        for (const { author, id, image, title } of newBooks) {
            const element = document.createElement('button');
            element.classList = 'preview';
            element.setAttribute('data-preview', id);
            UIAppender(image, title, author, newElementsFragment, element);
        }

        DomElements.dataListItems.appendChild(newElementsFragment);
        page++;

        DomElements.dataListButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1;

        showMoreBtnUpdater()

        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    } 
});

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    DomElements.dataSearchOverLay.open = false;
});

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    DomElements.dataSettingsOverlay.open = false;
});

document.querySelector('[data-header-search]').addEventListener('click', () => {
    DomElements.dataSearchOverLay.open = true;
    document.querySelector('[data-search-title]').focus();
});

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    DomElements.dataSettingsOverlay.open = true;
});



document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    DomElements.dataSettingsOverlay.open = false;
});

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    const result = [];

    for (const book of books) {
        let genreMatch = filters.genre === 'any';

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book);
        }
    }

    page = 1;
    matches = result;

    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show');
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show');
    }

    DomElements.dataListItems.innerHTML = '';

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id);
        UIAppender(image, title, author, CreateDocumentFragment, element);
    }

    DomElements.dataListItems.appendChild(CreateDocumentFragment);
    DomElements.dataListButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1;

    DomElements.dataListButton.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `;

    window.scrollTo({top: 0, behavior: 'smooth'});
    DomElements.dataSearchOverLay.open = false;
});

DomElements.dataListItems.addEventListener('click', (event) => {
    console.log("Click event triggered");
    const pathArray = Array.from(event.composedPath());
    console.log("Path array:", pathArray);
    let active 

    for (const node of pathArray) {
        if (active) break;

        if (node?.dataset?.preview) {
            active = books.find(book => book.id === node.dataset.preview);
        }
    }

    if (active) {
        const dataListActive = document.querySelector('data-list-active');
        if (!dataListActive) {
            console.error('dataListActive element not found');
            return;
        }
    
        const shadowRoot = dataListActive.shadowRoot;
        if (!shadowRoot) {
            console.error('No shadowRoot found');
            return;
        }
    
        const dataListBlur = shadowRoot.querySelector('img[data-list-blur]');
        const dataListImage = shadowRoot.querySelector('img[data-list-image]');
        


        if (!dataListBlur || !dataListImage) {
            console.error('Required elements not found in the shadow DOM');
            console.log(shadowRoot.innerHTML);  // Check what's inside shadowRoot
            return;
        }
    
        if (active && active.image) {
            dataListBlur.src = active.image;
            dataListImage.src = active.image;
            // Other operations involving active.image
        } else {
            console.error('active.image is undefined or null');
            // Handle the error appropriately
        }
        
        shadowRoot.querySelector('[data-list-title]').textContent = active.title;
        shadowRoot.querySelector('[data-list-subtitle]').textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
        shadowRoot.querySelector('[data-list-description]').textContent = active.description;
        dataListActive.open();
    }
    
})

})