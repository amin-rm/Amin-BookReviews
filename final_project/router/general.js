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
// get the book list using promises :
const getBookList = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(books)
    },1000)})

public_users.get('/',function (req, res) {

    getBookList.then((bookList) => {
        res.send(JSON.stringify(bookList, null, 4));
      }).catch((error) => {
        res.status(404).JSON({message : "error getting the list of books"})
      })
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
const getBookIsbn = async (isbn) => {
    try {
      const response = await axios.get(`https://ahmedaminero-5000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/${isbn}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  public_users.get('/isbn/:isbn', async function (req, res) {
    let isbn = req.params.isbn;
  
    if (isbn && books[isbn]) {
      try {
        const bookDetails = await getBookIsbn(isbn);
        res.send(bookDetails);
      } catch (error) {
        res.status(500).json({ message: 'Cannot fetch books !' });
      }
    } 
    else {
      res.status(404).json({ message: 'Book not found' });
    }
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
