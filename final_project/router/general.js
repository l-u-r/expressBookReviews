const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    let existingusername = users.filter((user) => {
        return user.username === username
    });
    if(existingusername.length > 0){
        return res.status(404).json({message: "Username already exists."});
    } else {
        if (username && password) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "Account created with success."});
        }
    }
    return res.status(404).json({message: "Unable to register."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
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

// Get the book list available in the shop using Promise callbacks or Async-Await
function getBookList(){
    return new Promise((resolve, reject) => {
      resolve(books);
    })
}
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBookList().then(
      (b) => res.send(JSON.stringify(b, null, 4)),
    );  
});

// Get book details based on ISBN using Promise callbacks or Async-Await
function getBasedOnISBN(isbn){
    let b = books[isbn];  
    return new Promise((resolve, reject) => {
        if (b) {
            resolve(b);
        }else{
            reject("Can't find the book.");
        }    
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getBasedOnISBN(isbn).then(
        (b) => res.send(JSON.stringify(b, null, 4)),
        (error) => res.send(error)
    )
});
  
// Get book details based on author using Promise callbacks or Async-Await
function getBasedOnAuthor(author){
    let list = [];
    return new Promise((resolve, reject) => {
        for (var isbn in books) {
            let b = books[isbn];
            if (b.author === author){
                list.push(b);
            }
        }
        resolve(list);  
    })
}
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBasedOnAuthor(author).then(
        result => res.send(JSON.stringify(result, null, 4))
    );
});
  
// Get all books based on title using Promise callbacks or Async-Await
function getBasedOnTitle(title){
    let list = [];
    return new Promise((resolve, reject) => {
        for (var isbn in books) {
            let b = books[isbn];
            if (b.title === title){
                list.push(b);
            }
        }
        resolve(list);  
    })
}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBasedOnTitle(title).then(
        result => res.send(JSON.stringify(result, null, 4))
    );
});


module.exports.general = public_users;
