import { fetchBooksByGenre, fetchBookDetails, getBookCover } from './APIUtils.mjs'
//get user info, if they're logged in
const params = new URLSearchParams(window.location.search);
const username = params.get('username');
const readerID = params.get('readerID');
const avatar = params.get('avatar');

let selectedGenres = [];
let isFetching = false;
let loadingTexts = ["Oragnising shelves...", "Hunting for hidden gems...",
    "Dusting off old books...", "Checking for plot twists...",
    "Looking for good tropes...", "Summoning ancient scrolls...", "Avoiding cliffhangers..."]

//Check box handling
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', (e) => {
        //if box is checked, add value to array
        if (e.target.checked) {
            selectedGenres.push(e.target.value);
        } else {
            //if box is unchecked, find its index and remove it from array
            let targetIndex = selectedGenres.indexOf(e.target.value);
            if (targetIndex > -1) {
                selectedGenres.splice(targetIndex, 1)
            }
        }
        //console.log(selectedGenres) //debug
    })
})


let searchResults = [];
//Get buttons
let recButton = document.getElementById('rec-btn');
let addBtn = document.querySelector('.add-btn');
let profileLink = document.querySelector('#profile');

let title, author = "", description;

//Generating a reccomendation
recButton.addEventListener('click', (e) => {
    e.preventDefault();
    //Print a message if no genres are selected
    if (selectedGenres.length == 0) {
        alert("No genre selected!")
    } else {
        //start fetching, show loading overlay
        isFetching = true;
        searchResults = fetchBooksByGenre(selectedGenres);
        searchResults.then((foundBooks) => {
            //after fetching books that match the genres, select a random book
            let randomBookIndex = Math.floor(Math.random() * foundBooks.length);
            console.log(foundBooks[randomBookIndex])
            let randomBook = foundBooks[randomBookIndex];
            //stop loading if no book is found
            if (randomBook == undefined) {
                isFetching = false;
                alert("No matching books found :(");
            }
            //concatenate all authors
            randomBook.authors.forEach(a => {
                author += a.name + " ";
            })

            //get book details from api
            fetchBookDetails(randomBook.key).then((book) => {
                title = book.title;

                //not all books have descriptions, if they don't display its subjects
                if (book.description == undefined) {
                    book.subjects.forEach(s => {
                        description += s + " ";
                    })
                }
                else if (typeof book.description == 'object') {
                    description = book.description.value;
                } else {
                    description = book.description
                }

                //display the information for the generated book
                let recTitle = document.getElementById('title');
                let recaAuthor = document.getElementById('author');
                let recDescription = document.getElementById('description');
                recTitle.innerText = title;
                recaAuthor.innerText = author;
                recDescription.innerText = description;

                let cover = document.getElementById('rec-cover')
                cover.src = getBookCover(randomBook.cover_id)

                //finish displaying loading when the book cover loads
                cover.addEventListener('load', (e) => {
                    isFetching = false;
                    //show button for adding books to list
                    addBtn.style.display = 'flex';
                })
                cover.addEventListener('error', (e) => {
                    isFetching = false;
                    console.log("Image couldn't be loaded")
                })
            })
        })
    }

})

profileLink.addEventListener('click', (e) => {
    if (username && readerID && avatar) {
        window.location.href = `profile.html?username=${username}&readerID=${readerID}&avatar=${avatar}`;
    } else {
        window.location.href = 'login.html';
    }
})

addBtn.addEventListener('click', (e) => {
    if (username && readerID && avatar) {
        (async () => {
            let bookToAdd = { ReaderID: readerID, Title: title, Author: author }
            console.log(bookToAdd)
            await fetch('http://localhost:3000/add-row-books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookToAdd)
            });
            alert("Book has been added to your To-Read List")
        })();
    } else {
        window.location.href = 'login.html';
    }
})


//Loading related
let loadingScreen = document.querySelector('.loading-screen')
let loadingText = document.querySelector('.loading-text')
setInterval(() => {
    if (isFetching) {
        loadingScreen.classList.remove("d-none")
    } else {
        loadingScreen.classList.add("d-none")
    }
}, 1000 / 30)

setInterval(() => {
    if (isFetching) {
        loadingText.innerText = loadingTexts[Math.floor(Math.random() * loadingTexts.length)]
    }
}, 1050)



