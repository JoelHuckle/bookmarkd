class Book {
  constructor(title, pageNum, ISBN) {
    this.title = title;
    this.pageNumber = pageNum;
    this.ISBN = ISBN;
    this.thumbnail = `https://covers.openlibrary.org/b/ISBN/${ISBN}-L.jpg`;
  }

  static displayBooks() {
    //clears current display of books
    resetHTML();
    //fetches from storage, converts into array
    const books = Book.objLst();
    //parses each obj
    books.forEach((n) => {
      n = JSON.parse(n);
      const currentBook = new Book(n.title, n.pageNumber, n.ISBN);
      currentBook.createHTML();
    });
  }

  static getIndex() {
    let arr = [];
    const books = Book.objLst();
    books.forEach((n) => {
      n = JSON.parse(n);
      arr.push(n);
    });
  }

  static objLst() {
    if (!localStorage.getItem("books")) {
      return [];
    }
    return localStorage.getItem("books").split(" | ");
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

    const removeBook = document.createElement("button");
    removeBook.classList.add("reset");
    removeBook.innerText = "Remove";

    removeBook.addEventListener("click", () => {
      const books = Book.objLst().map((n) => JSON.parse(n));
      //removes key if only one book exists
      if (books.length === 1) {
        localStorage.removeItem("books");
      } else {
        //finds title match, removes from array
        books.forEach((n) => {
          if (n.title === this.title) {
            books.splice(books.indexOf(n), 1);
          }
        });

        //updates local storage
        changeInStorage(books);
      }

      //updates visual
      resetHTML();
      Book.displayBooks();
    });

    //adds page change and remove book to flex row
    const container = document.createElement("div");
    container.classList.add("row");
    container.appendChild(pageChange);
    container.appendChild(removeBook);

    //adds child div to main
    section.appendChild(container);
    document.querySelector("main").appendChild(section);
  }
}

//display books on load
if (localStorage.getItem("books")) {
  Book.displayBooks();
}

//resets books before re displaying
function resetHTML() {
  const books = document.querySelectorAll(".book");
  books.forEach((n) => n.remove());
}

function existingBook(title) {
  //returns false if first book
  if (!localStorage.getItem("books")) {
    return false;
  }

  let arr = [];
  const books = Book.objLst();
  books.forEach((n) => {
    n = JSON.parse(n);
    arr.push(n.title);
  });

  return arr.includes(title) ? true : false;
}

document.querySelector(".reset").addEventListener("click", () => {
  localStorage.clear();
  resetHTML();
});

document.querySelector(".add").addEventListener("click", addBook);

function addBook() {
  const ISBN = document.querySelector(".ISBN").value;
  const page = document.querySelector(".page").value;

  fetch(`https://openlibrary.org/isbn/${ISBN}.json`)
    .then((res) => res.json())
    .then((data) => {
      if (data.title) {
        //error if book already added
        if (existingBook(data.title)) {
          document
            .querySelector(".error-text")
            .classList.add("error-text--active");
          setTimeout(() => {
            document
              .querySelector(".error-text")
              .classList.remove("error-text--active");
          }, 1000);
        } else {
          console.log(data);
          const book = new Book(data.title, page, String(ISBN));
          addToStorage(book);
          Book.displayBooks();
        }
      }
    })
    .catch((err) => {
      //displays error message
      document.querySelector(".ISBN").classList.add("--red");
      document.querySelector(".page").classList.add("--red");

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
  const books = Book.objLst();
  //parses each obj
  books.forEach((n) => {
    n = JSON.parse(n);
    arr.push(n.title);
  });
  return arr;
}
