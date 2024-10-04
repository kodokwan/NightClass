const users = [
    { name: "user1", grade: "7", number: "7" },
    { name: "user2", grade: "7", number: "8" }
];

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const enteredname = document.getElementById('name').value;
    const enteredgrade = document.getElementById('grade').value;
    const enterednumber = document.getElementById('number').value;

    
    const user = users.find(user => user.name === enteredname && user.grade === enteredgrade && user.number === enterednumber);

    if (user) {
        localStorage.setItem('username', enteredname);
        localStorage.setItem('usergrade', enteredgrade);
        localStorage.setItem('usernumber', enterednumber);
        alert("로그인 성공!");
        window.location.href = "main.html";
    } else {
        alert("로그인 실패. 정보를 다시 확인하세요."); 
    }
});
