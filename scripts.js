// Importing necessary data from another file
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

// Initialize current page and matches (filtered books)
let page = 1;
let matches = books

// Create a document fragment to hold book elements
let CreateDocumentFragment = document.createDocumentFragment()

for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    const element = document.createElement('button') // Creating a new button element in each iteration
    element.classList = 'preview'
    element.setAttribute('data-preview', id)
    UIAppender(image, title, author, CreateDocumentFragment, element) // Passing the newly created button element to UIAppender function
}

// Append the document fragment to the list items element in the DOM
document.querySelector('[data-list-items]').appendChild(CreateDocumentFragment)


// Add an "All Genres" option
const firstGenreElement = document.createElement('option') //Allows creation of options to choose from

firstGenreElement.value = 'any'                            //Here Are
firstGenreElement.innerText = 'All Genres'                 //the options
CreateDocumentFragment.appendChild(firstGenreElement)                   // append to ui




// Add options for each genre
for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option') //allows us to choose different options when clicked
    element.value = id
    element.innerText = name
    CreateDocumentFragment.appendChild(element)
}

// Append the genre options to the genre dropdown element
document.querySelector('[data-search-genres]').appendChild(CreateDocumentFragment)

// Add an "All Authors" option
const firstAuthorElement = document.createElement('option')
firstAuthorElement.value = 'any'
firstAuthorElement.innerText = 'All Authors'
CreateDocumentFragment.appendChild(firstAuthorElement)

// Add options for each author
for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    CreateDocumentFragment.appendChild(element)
}

// Append the author options to the author dropdown element
document.querySelector('[data-search-authors]').appendChild(CreateDocumentFragment)

// Check if the user prefers a dark color scheme
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector('[data-settings-theme]').value = 'night'
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    document.querySelector('[data-settings-theme]').value = 'day'
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

// Update the "Show more" button text and state
document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

// Close search overlay when the cancel button is clicked
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

// Close settings overlay when the cancel button is clicked
document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

// Open search overlay and focus on the search title input when the search button is clicked
document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
})

// Open settings overlay when the settings button is clicked
document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})

// Close active book details when the close button is clicked
document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})

// Handle settings form submission to update theme
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    // Apply the selected theme
    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    // Close the settings overlay
    document.querySelector('[data-settings-overlay]').open = false
})

// Handle search form submission to filter books
document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    // Filter books based on search criteria
    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    // Update the page and matches variables with filtered results
    page = 1;
    matches = result

    // Show or hide the "No results" message
    if (result.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } else {
        document.querySelector('[data-list-message]').classList.remove('list__message_show')
    }

    // Clear the current book list and display the filtered results
    document.querySelector('[data-list-items]').innerHTML = ''

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        UIAppender(image, title, author, CreateDocumentFragment, element)
    }

    document.querySelector('[data-list-items]').appendChild(CreateDocumentFragment)
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    // Scroll to the top and close the search overlay
    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
})

// Handle "Show more" button click to load more books
document.querySelector('[data-list-button]').addEventListener('click', () => {
 

    // Load the next set of books
    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        UIAppender(image, title, author, CreateDocumentFragment, element) // Passing the newly created button element to UIAppender function
    }

    // Append the new books to the list and update the page counter
    document.querySelector('[data-list-items]').appendChild(fragment)
    page += 1
})

// Handle book click event to show book details
document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    // Find the clicked book's data
    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result
        }
    }
    
    // Display the book details in the overlay
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})







//My functions

function UIAppender(image, title, author, appendItems, Element) {
    // Create a new button element for each iteration
    const newElement = Element.cloneNode(true);

    // Set the inner HTML of the button with book details
    newElement.innerHTML = `
        <img
            class="preview__image"
            src="${image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>
    `

    // Append the button element to the document fragment
    appendItems.appendChild(newElement) // Appending the newly created button element to the document fragment
}