//make book class - create elements and parent section element + properties

class Book {
  constructor(title, pageNum, thumbnail = "") {
    this.title = title;
    this.pageNumber = pageNum;
    this.thumbnail = thumbnail;
  }

  set setPage(num) {
    this.pageNumber = num;
  }

  createHTML() {
    console.log("active");
    const section = document.createElement("section");
    section.classList.add("book");

    const title = document.createElement("h2");
    title.innerText = this.title;
    section.appendChild(title);

    const thumbnail = document.createElement("img");
    thumbnail.classList.add("thumbnail");
    thumbnail.src = this.thumbnail;
    section.appendChild(thumbnail);

    const pageNum = document.createElement("span");
    pageNum.innerText = this.pageNum;
    section.appendChild(pageNum);

    document.querySelector("main").appendChild(section);
  }
}

document.querySelector(".add").addEventListener("click", addBook);

function addBook() {
  const ISBN = document.querySelector(".ISBN").value;
  const page = document.querySelector(".page").value;

  fetch(`https://openlibrary.org/isbn/${String(ISBN)}.json`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.title) {
        //create book object
        const book = new Book(data.title, page);
        addToStorage(book);
      } else {
        console.log("error finding title");
      }
    })
    .catch((err) => `error: ${err}`);
}

function addToStorage(obj) {
  //stringify object
  obj = JSON.stringify(obj);
  //dont include left divider if object is empty
  if (!localStorage.getItem("books")) {
    localStorage.setItem("books", obj);
  } else {
    let bookArray = localStorage.getItem("books") + " | " + obj;
    localStorage.setItem("books", bookArray);
  }
}

function displayBooks() {
  //fetches from storage, converts into array
  const books = localStorage.getItem("books").split(" | ");
  //parses each obj
  books.forEach((n) => {
    n = JSON.parse(n);
    currentBook = new Book(n.title, n.pageNumberm, n.thumbnail);
    currentBook.createHTML();
  });
}

//creates HTML for each book object
// function generateBooks(arr) {
//   const arr = Array.from(arr);
//   arr.forEach((n) => n);
// }

//i want to store each book object in an array in local storage but cant. I found online
//a solution that i cound stringify the array and object and parse it once retrieved so i will try that
