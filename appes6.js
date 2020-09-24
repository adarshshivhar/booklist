class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById("book-list");

    //create tr element
    const row = document.createElement("tr");

    //add td to tr
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
  }

  deleteBook(target) {
    if (target.className === "delete") {
      target.parentElement.parentElement.remove();
    }
  }

  clearInputFields() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
  }

  showAlert(message, className) {
    //create div
    const div = document.createElement("div");

    //Add classes
    div.className = `alert ${className}`;

    //Add text
    div.appendChild(document.createTextNode(message));

    //Get parents
    const container = document.querySelector(".container");

    //Get form
    const form = document.querySelector("#book-form");

    //Insert alert
    container.insertBefore(div, form);

    //Timeout 3 second
    setTimeout(function () {
      document.querySelector(".alert").remove();
    }, 3000);
  }
}


class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI();

            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static deleteBook(isbn) {
         const books = Store.getBooks();

        books.forEach(function(book, index){
           if(book.isbn === isbn){
               books.splice(index, 1);
           }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
}

//DOM load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

//Event Listner Book Added
document.getElementById("book-form").addEventListener('submit', function(e){
    
    //Get form values
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;
    
    //Instantiate Book
    const book = new Book(title, author, isbn);

    //Instantiate UI
    const ui = new UI();

    //Error Handling
    if(title === '' || author === '' || isbn === ''){
     //Error Alert
     ui.showAlert('Please fill in all fields', 'error');

    }else{
      //Add book to list
      ui.addBookToList(book);

      //store book
      Store.addBook(book);

      //show success
      ui.showAlert('Book Added!', 'success');

      //Clear Input Fields
      ui.clearInputFields();
    }

    
    e.preventDefault();
});


//Event Listner Book Delete
document.getElementById('book-list').addEventListener('click', function(e){
  //Instantiate UI  
  const ui = new UI();

  //Delete Book
  ui.deleteBook(e.target);

  //This will pass the isbn number
  Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);
  
  //Show Alert
  ui.showAlert('Book Delete!', 'success');

  e.preventDefault();
});