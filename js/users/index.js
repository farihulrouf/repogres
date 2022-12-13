
const apiuser = "http://localhost:3000/"
const loadUsers = () => {

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", apiuser + 'api/users/getall');
  
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("token", localStorage.getItem('token'));
    xhttp.send();
    xhttp.onreadystatechange = function () {
  
      if (this.readyState == 4 && this.status == 200) {
        var trHTML = '';
        //hideloader()
        let i = 0
        const objects = JSON.parse(this.responseText);
          console.log(objects)
          if(objects.data.data == null) {
            console.log('Data Not Found')
          }
          else {
  
          for (let object of objects.data.data) {
            let id_obj = object['user_id']
            i++
            trHTML += '<tr>';
            trHTML += '<td>' + i + '</td>';
            trHTML += '<td>' + object['first_name'] + '</td>'; 
            trHTML += '<td>' + object['email'] + '</td>';      
            trHTML += '<td>' + object['updated_at'] + '</td>'; 
            trHTML += '<td class="actionbutton"><a href="javascript:void(0)" onclick="showLinkUserEdit(\'' + id_obj + '\')"> <i class="bx bx-pencil bx-sm bx-tada-hover"></i></a>';
            trHTML += '<a href="javascript:void(0)" onclick="deleteUser(\'' + id_obj + '\')"><i style="color:red;" class="bx bx-x bx-sm bx-tada-hover"></i></a></td>';
  
            trHTML += "</tr>";
          }
          }
        
  
        document.getElementById("userpengguna").innerHTML = trHTML;
  
      }
  
    };
  }

  loadUsers()

  function deleteUser(id) {
    console.log(id)
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
  
    }).then((result) => {
      if (result.isConfirmed) {
        userDelete(id)
        //linkDelete(id)
       
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        )
      }
    })
  
  }

  const userDelete = (id) => {

    fetch(apiuser+"api/user/"+id, {
      method: 'DELETE',
      headers: {
        token: localStorage.getItem('token')
     },
    }).then(response => {
      console.log('response.status: ', response.status);
      console.log(response)
      Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
      loadUsers()
    }).catch(err => {
      console.log(err)
      
    })
  
  }
  const showLinkUserEdit = (id) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", apiuser + 'api/user/' + id);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("token", localStorage.getItem('token'));
  
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        const posts = objects.data.data
        Swal.fire({
          title: 'Edit User',
          showDenyButton: true,
          confirmButtonText: 'Save',
          denyButtonText: `Don't save`,
          html:
            '<input id="id" type="hidden" value=' + posts['user_id'] + '>' +
            '<input id="first_name"  class="swal2-input" placeholder="First name" value="' + posts['first_name'] + '">' +
            '<input id="last_name"  class="swal2-input" placeholder="Last name" value="' + posts['last_name'] + '">' +
            '<input id="email"  class="swal2-input" placeholder="Email" value="' + posts['email'] + '">'+
            '<input id="password" type="password" class="swal2-input" placeholder="Password" value="' + posts['password'] + '">'+
            '<input id="phone"  class="swal2-input" placeholder="Email" value="' + posts['phone'] + '">',
          focusConfirm: false,
          preConfirm: () => {
            userEdit()
            //linkEdit()
            //paguEdit()
          }
        })
  
  
      }
    };
  }
  const userEdit = () => {
    //console.log("edited")
    const id = document.getElementById("id").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const password = document.getElementById("password").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    let data = new FormData()
    data.append("first_name", first_name)
    data.append("email", email)
    data.append("password", password)
    data.append("phone", phone)
    data.append("last_name", last_name)
    
    fetch(apiuser+"api/user/"+id,{
      method: 'PUT',
      headers: {
         token: localStorage.getItem('token')
      },
      body: data
    }).then(response => {
      Swal.fire(
        'Good job!',
        'You edit have been save',
        'success'
      )
      loadUsers()
    }).catch(err => {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
    })
    
  
  }
  

function showUserCreteUser() {
    Swal.fire({
      title: 'Ceata Link',
      icon: 'success',
      showDenyButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
      html:
        '<input id="id" type="hidden">' +
        '<input id="first_name" class="swal2-input" placeholder="First Name">' +
        '<input id="last_name" class="swal2-input" placeholder="Last Name">'+
        '<input id="email" class="swal2-input" placeholder="email">' +
        '<input id="notel" class="swal2-input" placeholder="Phone">' +
        '<input id="password" type="password" class="swal2-input" placeholder="Password">',
      
      focusConfirm: false,
      preConfirm: () => {
        userCreate()
      }
    })
  }

  const userCreate = () => {
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const notel = document.getElementById("notel").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    //console.log("cox",notel)
    let data = new FormData()
    data.append("first_name", first_name)
    data.append("last_name", last_name)
    data.append("email", email)
    data.append("password", password)
    data.append("phone", notel)
    
    fetch(apiuser+'api/users/singup',{
      method: 'POST',
      headers: {
         token: localStorage.getItem('token')
      },
      body: data
    }).then(response => {
      Swal.fire(
        'Good job!',
        'Your data have been save',
        'success'
      )
      loadUsers()
      //loadTable(1, "")
    }).catch(err => {
      console.log(err)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
    })
    
  
  }

  const logoutUser = () => {
    localStorage.clear();
    window.location.href = './login.html'
  }
  
