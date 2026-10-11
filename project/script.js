// В стартовом проекте нет готовой логики домашней работы.
// Спроектируйте модель данных и переходы между состояниями самостоятельно.
"use strict"

console.log("Стартовый проект подключен")

const form = document.querySelector(".card-form")
const statePanels = document.querySelectorAll("[data-state-panel]")

const createButton = document.querySelector('[data-action="create"]')
const cancelButton = document.querySelector('[data-action="cancel"]')
const editButton = document.querySelector('[data-action="edit"]')
const deleteButton = document.querySelector('[data-action="delete"]')

const titleInput = document.querySelector("#card-title")
const authorInput = document.querySelector("#card-author")
const genreSelect = document.querySelector("#card-genre")
const descriptionInput = document.querySelector("#card-description")

const savedTitle = document.querySelector("#saved-title")
const savedAuthor = document.querySelector("#saved-author")
const savedGenre = document.querySelector("#saved-genre")
const savedDescription = document.querySelector("#saved-description")

let savedBook = null

function showState(state) {
  statePanels.forEach((panel) => {
    panel.hidden = panel.dataset.statePanel !== state
  })
}

function renderBook(book) {
  savedTitle.textContent = book.title
  savedAuthor.textContent = book.author
  savedGenre.textContent = book.genre
  savedDescription.textContent = book.description
}

createButton.addEventListener("click", () => {
  form.reset()
  showState("editor")
  titleInput.focus()
})

cancelButton.addEventListener("click", () => {
  form.reset()

  if (savedBook) {
    showState("viewer")
    editButton.focus()
  } else {
    showState("empty")
    createButton.focus()
  }
})

form.addEventListener("submit", (event) => {
  event.preventDefault()

  const formData = new FormData(form)

  const book = {
    title: formData.get("title"),
    author: formData.get("author"),
    genre: formData.get("genre"),
    description: formData.get("description")
  }

  savedBook = book
  renderBook(savedBook)
  showState("viewer")
  editButton.focus()

  console.log("Данные книги:", savedBook)
})

editButton.addEventListener("click", () => {
  titleInput.value = savedBook.title
  authorInput.value = savedBook.author
  genreSelect.value = savedBook.genre
  descriptionInput.value = savedBook.description

  showState("editor")
  titleInput.focus()
})

deleteButton.addEventListener("click", () => {
  savedBook = null
  form.reset()
  showState("empty")
  createButton.focus()
})

showState("empty")
