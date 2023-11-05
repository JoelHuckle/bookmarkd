# Bookmarkd
A website for tracking pages of books 
**Link to project:**(https://bookmarkdbooks.netlify.app)

## How It's Made:
**Tech used:** HTML, CSS, JavaScript

Using the [Open Library Api](https://openlibrary.org/developers/api), an ISBN inputted by the user returns a book title and thumbnail. Along with the page number input, these are added to their own instance of a Book object.

To save progress across multiple sessions, I stringified each book object and saved it in the users local storage. This is then displayed whenever the user opens the website or if a  book is added or removed.

I used flexbox to make the website responsive on a range of viewports, allowing the book list to wrap and fit the users screen size.







