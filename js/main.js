//make book class - create elements and parent section element + properties

class Book {
  constructor(
    name,
    pageNum,
    thumbnail = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACoCAMAAABt9SM9AAAAA1BMVEX/AAAZ4gk3AAAAR0lEQVR4nO3BAQEAAACCIP+vbkhAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO8GxYgAAb0jQ/cAAAAASUVORK5CYII="
  ) {
    this.name = name;
    this.pageNumber = pageNum;
    this.thumbnail = thumbnail;
  }

  set setPage(num) {
    this.pageNumber = num;
  }

  createHTML() {
    const section = document.createElement("section");
    section.classList.add("book");

    const name = document.createElement("h2");
    name.innerText = "";
    section.appendChild(name);

    const thumbnail = document.createElement("img");
    thumbnail.classList.add("thumbnail");
    thumbnail.src = "";
    section.appendChild(thumbnail);

    const page = document.createElement("span");
    page.innerText = "";
    section.appendChild(page);

    document.querySelector("main").appendChild(section);
  }
}

document.querySelector(".add").addEventListener("click", addBook);

function addBook(ISBN, page) {
  fetch(`https://openlibrary.org/isbn/${String(ISBN)}.json`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const book = new Book(data.title, page);
      book.createHTML();
    });
}

addBook(9780140328721, 30);
