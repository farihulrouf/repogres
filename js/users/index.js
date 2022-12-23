
const apiuser = "http://localhost:3000/"
var id_user = ''
var jwt = localStorage.getItem("token");

decoded = jwt_decode(jwt)
//console.log(decoded)
if (jwt === null) {
  console.log(jwt)
  window.location.href = './login.html'
}
else if (Date.now() >= decoded.exp * 1000) {
  window.location.href = './login.html'
}


const userWarningMessage = (dataWarning) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong! ' + dataWarning + ' Must be Input',
    footer: '<a href="">Why do I have this issue?</a>'
  })
}

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

  fetch(apiuser + "api/user/" + id, {
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
    getApiAllUser()
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
          '<input id="email"  class="swal2-input" placeholder="Email" value="' + posts['email'] + '">' +
          '<input id="password" type="password" class="swal2-input" placeholder="Password" value="' + posts['password'] + '">' +
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

  fetch(apiuser + "api/user/" + id, {
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
    getApiAllUser()
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
      '<input id="last_name" class="swal2-input" placeholder="Last Name">' +
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

  fetch(apiuser + 'api/users/singup', {
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
    getApiAllUser()
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

function multiBtnCellRendererUser() { }

multiBtnCellRendererUser.prototype.init = function (params) {
  var self = this;
  self.params = params;
  self.num_buttons = parseInt(this.params.num_buttons);
  self.btnClickedHandlers = {};
  let outerDiv = document.createElement('div')
  for (let i = 0; i < self.num_buttons; i++) {
    let button = document.createElement('button');
    button.innerHTML = self.params.button_html[i];
    outerDiv.appendChild(button);
    self.btnClickedHandlers[i] = function (event) {
      self.params.clicked[i](self.params.get_data_id());
    }.bind(i, self);
    button.addEventListener('click', self.btnClickedHandlers[i]);
  }
  self.eGui = outerDiv;
};

multiBtnCellRendererUser.prototype.getGui = function () {
  return this.eGui;
};

multiBtnCellRendererUser.prototype.destroy = function () {
  for (let i = 0; i < this.num_buttons; i++) {
    this.eGui.removeEventListener('click', this.btnClickedHandlers[i]);
  }
};


const gridOptionUser = {

  defaultColDef: {
    sortable: true,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  columnDefs: [

    //{ headerName: 'No', cellRendererFramework: AgGridRowNumberComponent},
    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      filter: false,
      width: 40, maxWidth: 40,

    },
    {
      headerName: 'First Name',
      field: 'first_name', minWidth: 150,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Last Name',
      field: 'last_name',
      width: 150, maxWidth: 150,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Email',
      field: 'email',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'phone',
      field: 'phone',
      width: 150, maxWidth: 150,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
  
    {

      headerName: 'Last Created',
      field: 'updated_at',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }

    },
    {

      headerName: 'Last Updated',
      field: 'created_at',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      
    },
    {
      headerName: "Action",
      maxWidth: 90,
      filter: false,
      floatingFilter: false,
      suppressMenu: true,
      sortable: false,
      cellRenderer: multiBtnCellRendererUser,
      cellRendererParams: {
        num_buttons: 2, //<i class="bx bx-pencil bx-sm bx-tada-hover"></i>
        button_html: ["<i class='bx bx-pencil bx-sm'></i>", "<i style='color:red;' class='bx bx-x bx-sm bx-tada-hover'></i>"],
        get_data_id: function () {
          return this.data.user_id;
        },
        clicked: {
          0: function (data_id) {
            showLinkUserEdit(data_id)
          },
          1: function (data_id) {
            deleteUser(data_id)
          }
        }
      }
    }
  ],

  // autoHeaderHeight: true,
  pagination: true,
  paginationPageSize: 10,
  domLayout: 'autoHeight',
  enableSorting: true,
  enableFilter: false,    // <-- HERE
  autoHeight: true,
  pagination: true
};


const aggridtableUser = () => {
  const eGridDiv = document.querySelector('#myGridUser');
  new agGrid.Grid(eGridDiv, gridOptionUser);
  getApiAllUser()
}


const getApiAllUser = () => {
  fetch(apiuser + 'api/users/getall', {
    headers: {
      'token': localStorage.getItem("token"),
      'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    //console.log(data)
     gridOptionUser.api.setRowData(data.data.data);
  })
}

if(decoded.Email!='eko@blp.gresikkab.go.id'){
  userWarningMessage('authorization is missing')
  window.location.href = './opdp.html'
}
else {
  aggridtableUser()
}
