// В стартовом проекте нет готовой логики домашней работы.
// Спроектируйте модель данных и переходы между состояниями самостоятельно.
"use strict"

const STORAGE_KEY = "book"
const HINT_KEY = "book-editor-hint-shown"
const DRAFT_KEY = "book-draft"

const form = document.querySelector(".card-form")
const statePanels = document.querySelectorAll("[data-state-panel]")
const editorHint = document.querySelector("#editor-hint")

const createButtons = document.querySelectorAll('[data-action="create"]')
const cancelButton = document.querySelector('[data-action="cancel"]')
const editButton = document.querySelector('[data-action="edit"]')
const deleteButton = document.querySelector('[data-action="delete"]')
const bookList = document.querySelector("#book-list")

const titleInput = document.querySelector("#card-title")
const authorInput = document.querySelector("#card-author")
const genreSelect = document.querySelector("#card-genre")
const descriptionInput = document.querySelector("#card-description")

const savedTitle = document.querySelector("#saved-title")
const savedAuthor = document.querySelector("#saved-author")
const savedGenre = document.querySelector("#saved-genre")
const savedDescription = document.querySelector("#saved-description")

const draftPanel = document.querySelector("#draft-panel")
const restoreDraftButton = document.querySelector('[data-action="restore-draft"]')
const discardDraftButton = document.querySelector('[data-action="discard-draft"]')

let books = []
let selectedBookId = null

function showState(state) {
  statePanels.forEach((panel) => {
    panel.hidden = panel.dataset.statePanel !== state
  })

  if (state === "editor") {
    const hintShown = sessionStorage.getItem(HINT_KEY)
    editorHint.hidden = hintShown === "true"

    if (!hintShown) {
      sessionStorage.setItem(HINT_KEY, "true")
    }
  }

  renderDraftNotice()
}

function renderBook(book) {
  savedTitle.textContent = book.title
  savedAuthor.textContent = book.author
  savedGenre.textContent = book.genre
  savedDescription.textContent = book.description
}

function fillForm(book) {
  titleInput.value = book.title
  authorInput.value = book.author
  genreSelect.value = book.genre
  descriptionInput.value = book.description
}

function renderCollection() {
  bookList.replaceChildren()

  books.forEach((book) => {
    const item = document.createElement("li")
    item.className = "book-collection__item"

    const button = document.createElement("button")
    const isSelected = book.id === selectedBookId

    button.type = "button"
    button.className = isSelected
      ? "button book-collection__button button--primary"
      : "button book-collection__button button--secondary"

    button.textContent = book.title
    button.setAttribute("aria-pressed", String(isSelected))

    button.addEventListener("click", () => {
      showCollection(book.id)
      editButton.focus()
    })

    item.append(button)
    bookList.append(item)
  })
}

function showCollection(bookId = null) {
  if (books.length === 0) {
    selectedBookId = null
    showState("empty")
    return
  }

  const book = books.find((item) => item.id === bookId) || books[0]
  selectedBookId = book.id

  renderBook(book)
  renderCollection()
  showState("viewer")
}

function renderDraftNotice() {
  const editorPanel = document.querySelector('[data-state-panel="editor"]')
  const isEditing = !editorPanel.hidden
  const hasDraft = sessionStorage.getItem(DRAFT_KEY) !== null

  draftPanel.hidden = isEditing || !hasDraft
}

function clearDraft() {
  sessionStorage.removeItem(DRAFT_KEY)
  renderDraftNotice()
}

form.addEventListener("input", () => {
  const formData = new FormData(form)

  const draft = {
    bookId: selectedBookId,
    title: formData.get("title"),
    author: formData.get("author"),
    genre: formData.get("genre"),
    description: formData.get("description")
  }

  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
  renderDraftNotice()
})

restoreDraftButton.addEventListener("click", () => {
  const draftJson = sessionStorage.getItem(DRAFT_KEY)

  if (!draftJson) {
    return
  }

  const draft = JSON.parse(draftJson)

  if (draft.bookId !== null && !books.some((book) => book.id === draft.bookId)) {
    clearDraft()
    return
  }

  selectedBookId = draft.bookId

  fillForm(draft)
  showState("editor")
  titleInput.focus()
})

discardDraftButton.addEventListener("click", () => {
  clearDraft()
  form.reset()
  showCollection(selectedBookId)

  if (books.length > 0) {
    editButton.focus()
  } else {
    createButtons[0].focus()
  }
})

createButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedBookId = null
    form.reset()
    showState("editor")
    titleInput.focus()
  })
})

cancelButton.addEventListener("click", () => {
  clearDraft()
  form.reset()
  showCollection(selectedBookId)

  if (books.length > 0) {
    editButton.focus()
  } else {
    createButtons[0].focus()
  }
})

form.addEventListener("submit", (event) => {
  event.preventDefault()

  const formData = new FormData(form)

  const book = {
    id: selectedBookId ?? Math.max(0, ...books.map((item) => item.id)) + 1,
    title: formData.get("title"),
    author: formData.get("author"),
    genre: formData.get("genre"),
    description: formData.get("description")
  }

  const nextBooks = selectedBookId === null
    ? [...books, book]
    : books.map((item) => item.id === selectedBookId ? book : item)

  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBooks))

  clearDraft()

  books = nextBooks
  showCollection(book.id)
  editButton.focus()
})

editButton.addEventListener("click", () => {
  const book = books.find((item) => item.id === selectedBookId)

  fillForm(book)
  showState("editor")
  titleInput.focus()
})

deleteButton.addEventListener("click", () => {
  const nextBooks = books.filter((book) => book.id !== selectedBookId)

  if (nextBooks.length > 0) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBooks))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }

  const draftJson = sessionStorage.getItem(DRAFT_KEY)

  if (draftJson && JSON.parse(draftJson).bookId === selectedBookId) {
    clearDraft()
  }

  books = nextBooks
  form.reset()
  showCollection()

  if (books.length > 0) {
    editButton.focus()
  } else {
    createButtons[0].focus()
  }
})

const savedBooksJson = localStorage.getItem(STORAGE_KEY)

if (savedBooksJson) {
  const restoredData = JSON.parse(savedBooksJson)

  if (Array.isArray(restoredData)) {
    books = restoredData
  } else {
    books = [{ ...restoredData, id: 1 }]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
  }
}

showCollection()
renderDraftNotice()
