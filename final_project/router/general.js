const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const user = req.body.username;
  const psw = req.body.password;
  if (user && psw) {
    if (!doesExist(user)) { 
      users.push({"username":user,"password":psw});
      return res.status(200).json({message: "Account created successfully."});
    } else {
      return res.status(404).json({message: "User already exists."});
    }
  } 
  return res.status(404).json({message: "Unable to register."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    console.log(ISBN)
    res.send(books[ISBN])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booklist= [] 
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                booklist.push(books[key]);
            }
        }
    }
    if(booklist.length == 0){
        return res.status(300).json({message: "No books available."});
    }
    res.send(booklist)
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booklist= []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'title' && book[i][1] == req.params.title){
                booklist.push(books[key]);
            }
        }
    }
    if(booklist.length == 0){
        return res.status(300).json({message: "Book not found."});
    }
    res.send(booklist);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    res.send(books[ISBN].reviews)
});

module.exports.general = public_users;
