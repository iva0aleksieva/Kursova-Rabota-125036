let username;
let password;
let readerID;
let avatar;
let loginButton = document.querySelector('#login-btn');

loginButton.addEventListener('click', (e) => {
    username = document.querySelector('.username-input').value;
    password = document.querySelector('.password').value;

    //if username and password are not falsy, check if user has an account
    (async () => {
        if (username && password) {

            if (await checkIfUserExists(username, password)) {
                //if user info is correct redirect to their profile and keep thei info in the url
                window.location.href = `profile.html?username=${username}&readerID=${readerID}&avatar=${avatar}`;
            }
            else {
                alert("No user with this username or password exists.")
            }
        } else {
            alert('Enter username and password!')
        }
    })();

})



async function checkIfUserExists(username, password) {
    const res = await fetch('http://localhost:3000/read-excel-users');
    const data = await res.json();
    console.log(data)

    const userFound = data.find(record =>
        String(record.Username).trim() === username.trim() && String(record.Password).trim() === password.trim()
    );
    if (userFound) {
        readerID = userFound.ReaderID;
        avatar = String(userFound.Avatar);
        return true;
    } else {
        return false;
    }
}