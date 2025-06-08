let avatars = document.querySelectorAll('.avatar');
let chosenAvatar;

//change the size of the chosen avatar
avatars.forEach(avatar => {
    avatar.addEventListener('click', (e) => {
        avatars.forEach(a => a.classList.remove('avatar-chosen'));
        avatar.classList.add('avatar-chosen')
        chosenAvatar = avatar.alt;
    })
})

let registerButton = document.querySelector('.register-btn');
registerButton.addEventListener('click', (e) => {
    let username = document.querySelector('.username-input').value;
    let password = document.querySelector('.password').value;

    if (username && password && chosenAvatar) {
        //if all information is present, write the new user's info to the exel file
        (async () => {
            let id = await getNextId();
            let newUser = {
                ReaderID: id,
                Username: username,
                Password: password,
                Avatar: chosenAvatar
            };

            await fetch('http://localhost:3000/add-row-users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            alert("Account has been created!")

        })();
    } else{
        alert("Some information is missing, please make sure you've enetered a username, password and chosen an avatar.")
    }
})

//get the next available id by checking the records' length
async function getNextId() {
    const res = await fetch('http://localhost:3000/read-excel-users');
    const data = await res.json();
    return data.length + 1;
}