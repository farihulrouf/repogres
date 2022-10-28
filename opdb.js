
const api_url = "http://localhost:3000/api/pagus";

function loadTable() {
    
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api_url);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {      
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(id_obj)
          trHTML += '<tr>'; 
          trHTML += '<td>'+1+'</td>';
          trHTML += '<td>'+object['name']+'</td>';
          trHTML += '<td>'+object['paguopdp']+'</td>';
          trHTML += '<td>'+object['paguorp']+'</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\''+id_obj+'\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailPage(\''+id_obj+'\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="paguDelete(\''+id_obj+'\')">delete_forever</span></a></td>';
         
          trHTML += "</tr>";
        }
        document.getElementById("mytable").innerHTML = trHTML;
        
      }
    };
    console.log("data di load sudah");
  }

  loadTable();

 
  function paguCreate() {
    const name = document.getElementById("name").value;
    const paguopd = document.getElementById("paguopd").value;
    const paguorp = document.getElementById("paguorp").value;
      
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", api_url);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
      "name": name, "paguopdp": paguopd, "paguorp": paguorp
    }));
    xhttp.onreadystatechange = function() {
      loadTable();
      /*if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
        loadTable();
        console.log("eksekusi")
      }*/
    };
  }

  function showUserCreateBox() {
    Swal.fire({
      title: 'Create Pagu',
      html:
        '<input id="id" type="hidden">' +
        '<input id="name" class="swal2-input" placeholder="Name">' +
        '<input id="paguopd" class="swal2-input" placeholder="Paguodp">' +
        '<input id="paguorp" class="swal2-input" placeholder="Paguorp">',
      focusConfirm: false,
      preConfirm: () => {
        paguCreate();
      }
    })
  }


  function paguDelete(id) {
    
    console.log("data coba delete id",id)

    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/api/pagus/"+id);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
      "id": id
    }));
    xhttp.onreadystatechange = function() {
      loadTable();
      /*if (this.readyState == 4) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
        loadTable();
      } 
      */
    };
    
  }

function detailPage(id) {

  let element = document.getElementById("opdb");
  element.remove();

  const xhttp = new XMLHttpRequest();
  let posts = ''
  xhttp.open("GET", api_url+'/'+id);
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      posts = objects.data.data
      console.log(posts)
      const para = document.createElement("p");
      const node = document.createTextNode(posts.name);
      para.appendChild(node);
      //para.appendChild(node2);
      element = document.getElementById("detail");
      element.appendChild(para);
      //element.appendChild(para2);
        
    }
      
  };
}


  function showUserEditBox(id) {
    //console.log("id data",id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api_url+'/'+id);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        //console.log(objects.data.data)
        const posts = objects.data.data
        console.log(posts);
        Swal.fire({
          title: 'Edit Pagu',
          html:
            '<input id="id" type="hidden" value='+posts['id']+'>' +
            '<input id="name" class="swal2-input" placeholder="Nama Odp" value="'+posts['name']+'">' +
            '<input id="paguopd" class="swal2-input" placeholder="Pagu Odp" value="'+posts['paguopdp']+'">' +
            '<input id="paguorp" class="swal2-input" placeholder="Pagu Orp" value="'+posts['paguorp']+'">',
          focusConfirm: false,
          preConfirm: () => {
            paguEdit()
          }
        })
        
        
      }
    };
  }


  function paguEdit() {

    const id = document.getElementById("id").value;
    const name = document.getElementById("name").value;
    const paguopd = document.getElementById("paguopd").value;
    const paguorp = document.getElementById("paguorp").value;
      
    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", api_url+"/"+id);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
      "name": name, "paguopdp": paguopd, "paguorp": paguorp
    }));
    xhttp.onreadystatechange = function() {
      loadTable();
      /*if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        Swal.fire(objects['message']);
        loadTable();
        console.log("eksekusi")
      }*/
    };
  }
  


  
 
