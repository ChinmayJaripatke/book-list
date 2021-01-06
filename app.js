// Book class: 
// When a new book is added, the below code runs.

class Book {
    constructor(title, author) {
        this.title = title;
        this.author = author;
    }
}

// UI class:
// Handling what the client actually sees:

class UI {

    // Since we don't want to instantiate the UI class, we make the methods static using the 'static' keyword:
    // 1) Method to display a new book:

    static displayBooks() {

        // Data received from the local storage:
        const books = Store.getBooks();

        // Looping through each of the element in the array and then calling the method:
        books.forEach((book) => UI.addBookToList(book));
    }

    // 2) Method to add a new book to the list:

    static addBookToList(book) {

        // Selecting the body of the table:
        const list = document.querySelector("#book-list");

        // Creating a new table row:
        const row = document.createElement("tr");

        // Inserting new data using the 'td' tag in the table:
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td><a href = "#" class = "btn btn-danger btn-sm delete">X</a></td>
        `;

        // Finally, appending all the rows to the list i.e the body of the table:
        list.appendChild(row);
    }

    // 3) Method to clear all the fields after the user submits the title and the author:

    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#name").value = "";
    }

    // 4) Method to delete a particular row i.e a particular book:

    static deleteBook(el) {

        // If the element which the user has clicked contains the 'delete' class, we simply go to the parent of the parent element and remove
        // the entire row. Since just the parent element would be the <td> tag and we want to remove the <tr> tag.
        if (el.classList.contains("delete")) {
            el.parentElement.parentElement.remove();
        }
    }

    // 5) Method to show alert:

    static showAlert(message, className) {

        // Creating a div first:
        const div = document.createElement("div");

        // Assiging the class name to the div dynamically:
        div.className = `alert alert-${className}`;

        // Inserting the text inside the div dynamically:
        div.appendChild(document.createTextNode(message));

        // Grabbing the container to place the new div:
        const container = document.querySelector(".container");

        // Grabbing the element with id "book-form" to place the new div:
        const form = document.querySelector("#book-form");

        // Inserting the new div before the form and after the container:
        container.insertBefore(div, form);

        // The alert message should stay only for 3 seconds.
        // Hence we remove the element which contains the class called "alert" after 3 seconds:
        setTimeout(() => document.querySelector(".alert").remove(), 3000);
    }
}

// Store Class:
// Will be used to handle local storage:

class Store {

    // 1) Method to get the books from local Storage: 

    static getBooks() {

        // Local storage stores items in key-value pairs.
        // In localStorage, items are stored as strings and not as objects hence we need to parse and stringify:

        let books;

        // If there's no such item as 'books' in localStorage, we return an empty array:

        if (localStorage.getItem("books") === null) {
            books = [];
        }

        // Otherwise, we get the items after parsing it and return the array of objects:

        else {
            books = JSON.parse(localStorage.getItem("books"));
        }
        return books;
    }


    // 2) Method to add a book:
    // This method takes a 'book' as a parameter:
    static addBook(book) {

        // First, we get the books using the getBooks method:

        const books = Store.getBooks();

        // Then, we simply push the new book in the 'books' array:
        books.push(book);

        // Finally, we set the localStorage by stringifying the "books" array:
        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(title) {

        // First, we get the books using the getBooks method:

        const books = Store.getBooks();

        // Looping throught the array of "books", if the title matches the title to be removed, we splice the array there:
        books.forEach((book, index) => {
            if (book.title === title) {
                books.splice(index, 1);
            }
        })

        // Finally, we set the localStorage by stringifying the "books" array:

        localStorage.setItem("books", JSON.stringify(books));
    }
}

// Event listeners:

// 1) When the DOM loads, we call the displayBooks method from the UI class which inturn displays all the books in a tabular format:
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// 2) Adding a new book:
// Selecting the form where the user inputs the title and the author of the books:
document.querySelector("#book-form").addEventListener("submit", (e) => {

    // Preventing the page from refreshing again:
    e.preventDefault();

    // Getting the actual values of 'title' and 'author':
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;

    // Validation i.e checking if the user has filled in both the fields:
    if (title === "" || author === "") {

        // Showing an alert if the fields are not filled:
        UI.showAlert("Please fill in both the fields.", "danger");
    }
    else {

        // Instantiate the Book Class:
        const book = new Book(title, author);
        console.log(book);

        // Adding the book to the UI:
        UI.addBookToList(book);

        // Adding book to the local storage:
        Store.addBook(book);

        // Showing success message:
        UI.showAlert("Book added successfully.", "success");

        // Clearing all the fields i.e title and the author so that the user can enter another book:
        UI.clearFields();
    }
})

// 3) Displaying the User's Name:
// Selecting the form where the user enters his/her name:
document.querySelector("#user-detail").addEventListener("submit", (e) => {

    // Preventing the page from refreshing again:
    e.preventDefault();

    // If the user doesn't enter his/her name an alert comes up:
    if (document.querySelector("#name").value == "") {
        // Showing an alert if the name field is not filled:
        UI.showAlert("Please enter your name to continue.", "danger");
    } else {
        // Grabbing the actual value of the user's name:
        const userName = document.querySelector("#name").value;
        console.log(userName);

        // Changing the html to make it personalized:
        document.querySelector("#user-name").innerHTML = `${userName}'s <span class = "text-primary">Book</span> List <i class="fas fa-book text-primary"></i></h1>`
    }

    // Clearing the name field:
    UI.clearFields();
})

// 4) Deleting a particular row i.e a particular book:
// Selecting the body of the table which contains the list:
document.querySelector("#book-list").addEventListener("click", (e) => {

    // Sending the element which the user has clicked.
    // Removing book from UI:
    UI.deleteBook(e.target);

    // Remove book from local storage.
    // previousElementSibling helps us traverse up the table thus getting to the title's text content:
    Store.removeBook(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);


    // Showing success message:
    UI.showAlert("Book removed successfully.", "success");
})