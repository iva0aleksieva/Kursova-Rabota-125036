//API Util functions

export async function fetchBooksByGenre(genres) { //returns array with 50 book results
    let searchData = [];

    for (let i = 0; i < genres.length; i++) {
        const url = `https://openlibrary.org/subjects/${genres[i]}.json?limit=50`;
        const response = await fetch(url);
        const json = await response.json();
        searchData.push(json.works);
    }
    let foundBooks = [];
    console.log(searchData)


    for (const books of searchData) {
        const filtered = books.filter((book) => {
            //use book subjects array or an empty one if it doesn't exist
            const subjects = (book.subject || []).map(s => s.toLowerCase());
            let formattedGenres = [...genres];
            formattedGenres = formattedGenres.map(g => {
                if (g.includes("-") && g != "non-fiction") {
                    return g.replace("-", " ");
                } else if (g.includes("_")) {
                    return g.replace("_", " ")
                } else return g
            })
            return formattedGenres.every((genre) => subjects.includes(genre.toLowerCase()));
        });

        foundBooks.push(...filtered);
    }
    console.log(foundBooks)
    return foundBooks;
}
export async function fetchBookDetails(key) {
    const url = `https://openlibrary.org${key}.json`;
    const response = await fetch(url);
    const details = await response.json();

    return details;
}

export function getBookCover(coverId) {
    const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;

    return coverUrl;
}
