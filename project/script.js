// В стартовом проекте нет готовой логики домашней работы.
// Спроектируйте модель данных и переходы между состояниями самостоятельно.
"use strict"

console.log("Стартовый проект подключен")

const form = document.querySelector(".card-form")
const statePanels = document.querySelectorAll("[data-state-panel]")

const createButton = document.querySelector('[data-action="create"]')
const cancelButton = document.querySelector('[data-action="cancel"]')
const titleInput = document.querySelector("#card-title")

function showState(state) {
  statePanels.forEach((panel) => {
    panel.hidden = panel.dataset.statePanel !== state
  })
}

createButton.addEventListener("click", () => {
  form.reset()
  showState("editor")
  titleInput.focus()
})

cancelButton.addEventListener("click", () => {
  form.reset()
  showState("empty")
  createButton.focus()
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

  console.log("Данные книги:", book)
})

showState("empty")
