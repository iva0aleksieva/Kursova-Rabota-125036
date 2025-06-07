const params = new URLSearchParams(window.location.search);
const username = params.get('username');
const readerID = params.get('readerID');
const avatar = params.get('avatar');

document.addEventListener('DOMContentLoaded', (e) => {
    //get the user's saved books and display them in a table
    (async () => {
        let userBooks = await getBooksJsonByID(readerID);
        console.log(userBooks)
        generateTableRows(userBooks)

        //get all the delete buttons and book titles,
        //their indexes will match - button[1] is for title[1]
        let deleteButtons = document.querySelectorAll('.remove');
        let titles = document.querySelectorAll('.title')
        deleteButtons.forEach((btn, i) => {
            btn.addEventListener('click', (e) => {
                let selectedTitle = titles[i].innerText;
                (async () => {
                    //get the whole book record by its title and remove it
                    let bookRecord = await findBookByTitle(selectedTitle);
                    await fetch('http://localhost:3000/remove-row-books', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(bookRecord)
                    });
                    alert("Book has been removed.")
                })();
            })
        })
    })();

    //display user info
    let usernameText = document.querySelector('h2')
    usernameText.innerText = username;
    let avatarImg = document.querySelector("#profile-avatar");
    avatarImg.src = `assets\\avatar-images\\avatars_${avatar}.png`

    //keep user info when switching to the home page
    let homeLink = document.querySelector('#home');
    homeLink.addEventListener('click', (e) => {
        window.location.href = `home-page.html?username=${username}&readerID=${readerID}&avatar=${avatar}`;
    })
    //redirect to login page and remove user info from url
    let signOutBtn = document.querySelector('#sign-out');
    signOutBtn.addEventListener('click', (e) =>{
         window.location.href = `login.html`;
    })
})

async function getBooksJsonByID(readerID) {
    const res = await fetch('http://localhost:3000/read-excel-books');
    const data = await res.json();

    let bookData = data.filter(record => String(record.ReaderID).trim() == String(readerID).trim())

    return bookData;
}

async function findBookByTitle(title) {
    const res = await fetch('http://localhost:3000/read-excel-books');
    const data = await res.json();

    const userFound = data.find(record =>
        String(record.Title).trim() === title.trim()
    );
    return userFound;
}

function generateTableRows(JSONdata) {
    let table = document.querySelector('#reading-list');

    JSONdata.forEach(book => {
        let tr = document.createElement('tr');
        let title = document.createElement('td');
        title.classList.add('title');
        title.innerText = String(book.Title);

        let author = document.createElement('td');
        author.classList.add('author');
        author.innerText = String(book.Author);

        let remove = document.createElement('td');
        remove.classList.add('remove');
        remove.innerHTML = '<span>&#128465</span>';

        tr.appendChild(title);
        tr.appendChild(author);
        tr.appendChild(remove);

        table.appendChild(tr)
    });
}