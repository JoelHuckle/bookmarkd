class Book {
  constructor(title, pageNum, ISBN) {
    this.title = title;
    this.pageNumber = pageNum;
    this.ISBN = ISBN;
    this.thumbnail = `https://covers.openlibrary.org/b/ISBN/${ISBN}-L.jpg`;
  }

  static ISBNList() {
    let arr = [];
    //fetches from storage, converts into array
    const books = localStorage.getItem("books").split(" | ");
    //parses each obj
    books.forEach((n) => {
      n = JSON.parse(n);
      arr.push(n.ISBN);
    });
    return arr;
  }

  static displayBooks() {
    //clears current display of books
    resetHTML();
    //fetches from storage, converts into array
    const books = localStorage.getItem("books").split(" | ");
    //parses each obj
    books.forEach((n) => {
      n = JSON.parse(n);
      const currentBook = new Book(n.title, n.pageNumber, n.ISBN);
      currentBook.createHTML();
    });
  }

  static getIndex() {
    let arr = [];
    const books = localStorage.getItem("books").split(" | ");
    books.forEach((n) => {
      n = JSON.parse(n);
      arr.push(n);
    });
  }

  createHTML() {
    const section = document.createElement("section");
    section.classList.add("book");

    const thumbnail = document.createElement("img");
    thumbnail.classList.add("thumbnail");
    thumbnail.src = this.thumbnail;
    section.appendChild(thumbnail);

    const title = document.createElement("h2");
    title.innerText = this.title;
    section.appendChild(title);

    const pageNum = document.createElement("span");
    pageNum.innerText = `Page: ${this.pageNumber}`;
    section.appendChild(pageNum);

    const pageChange = document.createElement("input");
    pageChange.type = "number";
    pageChange.placeholder = "Update Page";
    pageChange.classList.add("pageChange");
    section.appendChild(pageChange);

    // change page number
    pageChange.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        //prevents default action
        event.preventDefault();

        //sets local storage
        const books = localStorage
          .getItem("books")
          .split(" | ")
          .map((n) => JSON.parse(n));

        books.forEach((n) => {
          if (n.title === this.title) {
            n.pageNumber = this.pageNumber;
          }
        });

        //adds updated object array to local storage
        changeInStorage(books);

        //sets visual
        const newPage = event.target.value;
        this.pageNumber = newPage;
        pageNum.innerText = `Page: ${this.pageNumber}`;
      }
    });

    document.querySelector("main").appendChild(section);
  }
}

document.querySelector(".reset").addEventListener("click", () => {
  localStorage.clear();
  resetHTML();
});

document.querySelector(".add").addEventListener("click", addBook);

//display books on load
if (localStorage.getItem("books")) {
  Book.displayBooks();
}

//resets books before re displaying
function resetHTML() {
  const books = document.querySelectorAll(".book");
  books.forEach((n) => n.remove());
}

function addBook() {
  console.log("adding book...");
  const ISBN = document.querySelector(".ISBN").value;
  const page = document.querySelector(".page").value;

  fetch(`https://openlibrary.org/isbn/${ISBN}.json`)
    .then((res) => res.json())
    .then((data) => {
      if (data.title) {
        // console.log(Book.ISBNList());
        //create new Book instance
        const book = new Book(data.title, page, String(ISBN));
        addToStorage(book);
        Book.displayBooks();
        console.log("book added");
        // }
      } else {
        console.log("error finding title");
      }
    })
    .catch((err) => {
      //displays error message
      document.querySelector(".ISBN").classList.add("--red");
      document.querySelector(".page").classList.add("--red");

      console.log("ERROR");

      //clears error message after 5 seconds
      setTimeout(function () {
        document.querySelector(".ISBN").classList.remove("--red");
        document.querySelector(".page").classList.remove("--red");
      }, 1000);
    });
}

//replaces information of existing obj in local storage
function changeInStorage(arr) {
  let string = "";

  //stringifies array
  arr.forEach((n, i) => {
    i === arr.length - 1
      ? //removes right divider if last item
        (string += JSON.stringify(n))
      : (string += JSON.stringify(n) + " | ");
  });
  localStorage.setItem("books", string);
}

function addToStorage(obj) {
  //stringify object
  obj = JSON.stringify(obj);
  //dont include left divider if object is empty
  if (!localStorage.getItem("books")) {
    console.log("first book added: creating local storage");
    localStorage.setItem("books", obj);
  } else {
    let bookArray = localStorage.getItem("books") + " | " + obj;
    localStorage.setItem("books", bookArray);
  }
}

function getTitles() {
  let arr = [];
  //fetches from storage, converts into array
  const books = localStorage.getItem("books").split(" | ");
  //parses each obj
  books.forEach((n) => {
    n = JSON.parse(n);
    arr.push(n.title);
  });
  return arr;
}
