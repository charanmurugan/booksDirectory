const express = require("express");
const books = require("./book");
let bookDirectory = books;
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.listen(3000, () => {
  console.log(`port started at ${process.env.PORT}`);
});

app.get("/books", (req, res) => {
  res.send(bookDirectory);
});
app.get("/books/:id", (req, res) => {
  const { id } = req.params;
  const book = bookDirectory.find((b) => b.isbn === id);
  if (!book) return res.status(404).send(`Book does not exist`);

  res.send(book);
});
app.post("/books", (req, res) => {
  const {
    title,
    isbn,
    pageCount,
    publishedDate,
    thumbnailUrl,
    shortDescription,
    longDescription,
    status,
    authors,
    categories,
  } = req.body;

  const bookExist = bookDirectory.find((b) => b.isbn === isbn);
  if (bookExist) return res.send("Book already exist");

  const book = {
    title,
    isbn,
    pageCount,
    publishedDate,
    thumbnailUrl,
    shortDescription,
    longDescription,
    status,
    authors,
    categories,
  };
  bookDirectory.push(book);

  res.send(book);
});

app.put("/books/:id", function (req, res) {
  const { id } = req.params;
  const {
    title,
    isbn,
    pageCount,
    publishedDate,
    thumbnailUrl,
    shortDescription,
    longDescription,
    status,
    authors,
    categories,
  } = req.body;

  let book = bookDirectory.find((b) => b.isbn === id);
  if (!book) return res.status(404).send("Book does not exist");

  const updateField = (val, prev) => (!val ? prev : val);

  const updatedBook = {
    ...book,
    title: updateField(title, book.title),
    isbn: updateField(isbn, book.isbn),
    pageCount: updateField(pageCount, book.pageCount),
    publishedDate: updateField(publishedDate, book.publishedDate),
    thumbnailUrl: updateField(thumbnailUrl, book.thumbnailUrl),
    shortDescription: updateField(shortDescription, book.shortDescription),
    longDescription: updateField(longDescription, book.longDescription),
    status: updateField(status, book.status),
    authors: updateField(authors, book.authors),
    categories: updateField(categories, book.categories),
  };

  const bookIndex = bookDirectory.findIndex((b) => b.isbn === book.isbn);
  bookDirectory.splice(bookIndex, 1, updatedBook);

  res.status(200).send(updatedBook);
});

app.delete("/books/:id", function (req, res) {
  const { id } = req.params;

  let book = bookDirectory.find((b) => b.isbn === id);
  if (!book) return res.status(404).send("Book does not exist");

  bookDirectory = bookDirectory.filter((b) => b.isbn !== id);

  res.send("Success");
});
