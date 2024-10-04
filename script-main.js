const username = localStorage.getItem('username');
const usergrade = localStorage.getItem('usergrade');
const usernumber = localStorage.getItem('usernumber');

document.getElementById("name").innerHTML = username;
document.getElementById("grade").innerHTML = usergrade;
document.getElementById("number").innerHTML = usernumber;
console.log(username);
console.log(usergrade);
console.log(usernumber);