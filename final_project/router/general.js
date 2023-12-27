const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  let usersWithThisName = users.filter((user) => {
    return user.username === username;
  })

  if(username && password) {
    if(usersWithThisName.length <= 0) {
        users.push({"username" : username, "password" : password});
        res.status(200).json({message: "The user " + username + " is successfully registered !"})
    }
    else {
        res.status(404).json({message: "The user " + username + " already exists !"})
    }
  }
  else {
    res.status(404).json({message: "Username/Password are not provided !"})
  }

  return res.status(300).json({message: "Unable to register user :("});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))
  return res.status(300).json({message: "Implemented !"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(isbn) {
    res.send(books[isbn])
  }
  return res.status(300).json({message: "implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  let bookWithAuthor = [];
  for (const key in books)
  {
    const book = books[key];
    if (book.author === author) {
        bookWithAuthor.push(book);
    }
  }
  res.send(bookWithAuthor)
  return res.status(300).json({message: "implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let bookWithTitle = [];
    for (const key in books)
    {
      const book = books[key];
      if (book.title === title) {
          bookWithTitle.push(book);
      }
    }
    res.send(bookWithTitle)
  return res.status(300).json({message: "implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  const book = books[isbn]
  res.send(JSON.stringify(book.reviews))
  return res.status(300).json({message: "implemented"});
});

module.exports.general = public_users;
