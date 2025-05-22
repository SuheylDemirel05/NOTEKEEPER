const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const addBox = document.querySelector(".add-box");
const popupContainer = document.querySelector(".popup-box");
const popup = document.querySelector(".popup");
const closeBtn = document.querySelector("#close-btn");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
const popupTitle = document.querySelector("header h1");
const submitBtn = document.querySelector("form button");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

console.log(notes);

let isUpdate = false;
let updateId = null;

addBox.addEventListener("click", () => {
  popupContainer.classList.add("show");
  popup.classList.add("show");

  document.body.style.overflow = "hidden";
});

closeBtn.addEventListener("click", () => {
  popupContainer.classList.remove("show");
  popup.classList.remove("show");

  document.body.style.overflow = "auto";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = e.target[0].value.trim();
  const description = e.target[1].value.trim();

  if (!title || !description) {
    alert(`Title and description sections cannot be left blank.`);

    return;
  }

  const date = new Date();

  const id = date.getTime();
  const day = date.getDate();
  const month = date.getMonth();
  const updateMonth = months[month];
  const year = date.getFullYear();

  if (isUpdate) {
    const findIndex = notes.findIndex((note) => note.id == updateId);

    notes[findIndex] = {
      title,
      description,
      id,
      date: `${updateMonth} ${day},${year}`,
    };

    isUpdate = false;
    updateId = null;

    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";
  } else {
    let noteItem = {
      title,
      description,
      id,
      date: `${updateMonth} ${day},${year}`,
    };

    notes.push(noteItem);
  }

  localStorage.setItem("notes", JSON.stringify(notes));

  e.target.reset();

  popupContainer.classList.remove("show");
  popup.classList.remove("show");

  renderNotes(notes);
});

function renderNotes(notes) {
  document.querySelectorAll(".note").forEach((item) => item.remove());

  notes.forEach((note) => {
    let noteHTML = `     <li class="note" data-id='${note.id}'>
   
        <div class="details">
          <h2 class="title">${note.title}</h2>
          <p class="description">${note.description}</p>
        </div>


        <div class="bottom">
          <span id="date">${note.date}</span>

          <div class="settings">
            <i class="bx bx-dots-horizontal-rounded"></i>

            <ul class="menu">
              <li class="edit-btn"><i class="bx bx-edit"></i> Edit</li>
              <li class="delete-btn"><i class="bx bx-trash-alt"></i> Delete</li>
            </ul>
          </div>
        </div>
      </li>`;

    addBox.insertAdjacentHTML("afterend", noteHTML);
  });
}

function showMenu(eleman) {
  eleman.parentElement.classList.add("show");

  document.addEventListener("click", (e) => {
    if (e.target.tagName != "I" || e.target != eleman) {
      eleman.parentElement.classList.remove("show");
    }
  });
}

wrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("bx-dots-horizontal-rounded")) {
    showMenu(e.target);
  } else if (e.target.classList.contains("delete-btn")) {
    const response = confirm("Are you sure you want to delete this note?");

    if (response) {
      const note = e.target.closest(".note");

      const noteId = parseInt(note.dataset.id);

      notes = notes.filter((note) => note.id != noteId);

      localStorage.setItem("notes", JSON.stringify(notes));

      renderNotes(notes);
    }
  } else if (e.target.classList.contains("edit-btn")) {
    const note = e.target.closest(".note");

    const noteId = Number(note.dataset.id);

    const foundedNote = notes.find((note) => note.id == noteId);

    popupContainer.classList.add("show");
    popup.classList.add("show");

    form[0].value = foundedNote.title;
    form[1].value = foundedNote.description;

    isUpdate = true;
    updateId = noteId;

    popupTitle.textContent = "Update Item";
    submitBtn.textContent = "Update";
  }
});

document.addEventListener("DOMContentLoaded", renderNotes(notes));
