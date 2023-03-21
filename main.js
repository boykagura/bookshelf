const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";
const INCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookShelfList";
const BOOK_ITEMID = "itemId";

function isStorageExist(){
    if(typeof (Storage) === undefined){
        alert("Browser Kamu tidak Mendukung Local Storage");
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', function (){
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook()
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook(){
    const BookTitle = 
    document.getElementById ('inputBookTitle').value;
    const BookAuthor = document.getElementById('inputBookAuthor').value;
    const BookYear = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    const generateID = generateId();
    const BookObject = generateBookObject(generateID, BookTitle, BookAuthor, BookYear, isComplete);
    books.push(BookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}
function generateId() {
    return + new Date ();
}

document.addEventListener(RENDER_EVENT, function (){
    console.log(books);
});

function makeBook (BookObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = BookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis : ' + BookObject.author;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun : '+ BookObject.year ;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    const trashButton = document.createElement('button');
  trashButton.classList.add('red');
  trashButton.innerText = 'Hapus';
  trashButton.setAttribute('id', 'button-delete');

  const Container = document.createElement('article');
  Container.classList.add('book_item');
  Container.append(bookTitle, bookAuthor, bookYear, buttonContainer);
  Container.setAttribute('id', `book-${BookObject.id}`);

    if (BookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.setAttribute('id', 'button-undo');
        undoButton.innerText = 'Belum selesai dibaca';

        undoButton.addEventListener('click', function (){
            undoBookFromCompleted(BookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add("trash-button");

        trashButton.addEventListener ('click', function (){

            removeBookFromCompleted(BookObject.id);
        });
        buttonContainer.append(undoButton, trashButton);
    }

    else {
        const undoButton = document.createElement ('button');
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function(){
            addBookToCompleted(BookObject.id);
        });

        const trashButton = document.createElement ('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function(){
            removeBookFromCompleted(BookObject.id);

        });
        buttonContainer.append(undoButton, trashButton);
    }
    return Container;

}

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';
  
  const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if(!bookItem.isCompleted)
        incompleteBookshelfList.append(bookElement);
        else
        completeBookshelfList.append(bookElement);
    }
});

function addBookToCompleted (bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null) return;
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId){
    for (const bookItem of books) {
        if (bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function removeBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget === -1) return;

    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    }

    function findbookIndex (bookId){
        for(const index in books) {
            if(books[index].id === bookId){
                return index;
            }
        }
        return -1;
    }

    function undoBookFromCompleted(bookId){
        const bookTarget = findBook(bookId);
        if(bookTarget == null) return;

        bookTarget.isCompleted = false;

        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function saveData() {
        if(isStorageExist()) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
            document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }
    document.addEventListener(SAVED_EVENT, function(){
        console.log(localStorage.getItem(STORAGE_KEY));
    });

    function loadDataFromStorage(){
        const serializeData = localStorage.getItem(STORAGE_KEY);
        let data = JSON.parse(serializeData);

        if(data !== null){
            for(const book of data ){
                books.push(book);
            }
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    const checkbox = document.getElementById('inputBookIsComplete');
    let check = false;

    checkbox.addEventListener('change', function(){
        if(checkbox.checked){
            check = TextTrackCueList
            document.querySelector('span').innerText = 'Selesai Dibaca';
        }
        else {
            check = false;
            document.querySelector('span').innerText = 'Belum selesai dibaca';
        }
    });

    document.getElementById('searchBook').addEventListener('submit', function (event){
        event.preventDefault();
        const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
        const bookList = document.querySelectorAll('.item > .inner h2');

        for (const book of bookList ){
            if(searchBook !== book.innerText.toLowerCase()){
                book.parentElement.style.display = 'block';
            }
            else {
                book.parentElement.style.display = 'none';
            }
        }
    });

    document.addEventListener("ondatasaved", () => {
        console.log("Data Berhasil Disimpan")
    });
