
const apilogin = "http://localhost:3000/api/users/login"

var jwt = localStorage.getItem("token");
decoded = jwt_decode(jwt)
if (jwt != null && Date.now() >= decoded.exp * 1000) {
  console.log(jwt)
  window.location.href = './opdp.html'
}
else if (Date.now() >= decoded.exp * 1000) {
  window.location.href = './login.html'
}




function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log(username, password)
  const xhttp = new XMLHttpRequest();
  
  xhttp.open("POST", apilogin);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "email": username,
    "password": password
  }));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      const objects = JSON.parse(this.responseText);
      console.log(objects);
      
      if (objects.message == 'success') {
        //console.log(objects['token'])
        localStorage.setItem("token",objects.data.data.token);
        console.log('succes login')
        
        Swal.fire({
          text: objects['message'],
          icon: 'success',
          confirmButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = './opdp.html';
          }
        });
        
      } else {
        //console.log("succes login")
        
        Swal.fire({
          text: objects['message'],
          icon: 'error',
          confirmButtonText: 'OK'
        });
        
      }
      
    }
  };
  return false;
  
}


/*
function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", apilogin);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
      "email": username, "password": password
    }));
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 201) {
        console.log("succes Login")
      }
      else {
        console.log("failed login")
      }
  
    };
  }
  */