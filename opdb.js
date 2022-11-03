
const api_url = "http://localhost:3000/api/pagus";
const api_url_anggaran = "http://localhost:3000/api/anggaran";
const api_url_tender = "http://localhost:3000/api/tender"
const api_url_langsung = "http://localhost:3000/api/langsung"
const api_url_pengecualian = "http://localhost:3000/api/kecuali"
var id_global = '';


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
          trHTML += '<td class="td-icon"><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\''+id_obj+'\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailPage(\''+id_obj+'\')">visibility </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="paguDelete(\''+id_obj+'\')">delete_forever</span></a></td>';
         
          trHTML += "</tr>";
        }
        document.getElementById("mytable").innerHTML = trHTML;
        
      }
    };
    //console.log("data di load sudah");
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
        '<input id="paguopd" class="swal2-input" placeholder="Pagu ODP">' +
        '<input id="paguorp" class="swal2-input" placeholder="PAGU ORP">',
      focusConfirm: false,
      preConfirm: () => {
        paguCreate();
      }
    })
}

function showCreateAnggaran(anggaran) {
  //console.log(anggaran)
  let header_title = anggaran
  if(header_title=="Anggaran"){
    Swal.fire({
      title:  anggaran,
        html:
        '<input id="id" type="hidden">' +
        '<input id="name" class="swal2-input" placeholder="Name">' +
        '<input id="paket" type="hidden" class="swal2-input" placeholder="Jumlah" value="00000">' +
        '<input id="pagu" class="swal2-input" placeholder="Jumlah">',
      focusConfirm: false,
      preConfirm: () => {
          CreateDetailPagu(api_url_anggaran, header_title)
           
      }
    })
  }
  else if(header_title=="tender") {
    Swal.fire({
      title:  anggaran,
      html:
        '<input id="id" type="hidden">' +
        '<select id="Ultra" class="swal2-input" onchange="alert(this.value)"> <option value="0">Select</option><option value="8">text1</option> <option value="5">text2</option></select>'+
        '<input id="paket" class="swal2-input"  placeholder="Paket">' +
        '<input id="pagu" class="swal2-input"  placeholder="Pagu">'+
        '<input type="date" class="swal2-input" id="pemilihan" name="trip-start" value="2018-07-22" min="2018-01-01" max="2025-12-31">'+
        '<input type="date" class="swal2-input" id="pelaksanaan" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31">'+
        '<input type="date" class="swal2-input" id="pemanfaatan" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31">'+
        '<input id="pdn" class="swal2-input" placeholder="PDN %">',

      focusConfirm: false,
      preConfirm: () => {

        CreateDetailPagu(api_url_tender, header_title)
      
      }
    })
  }
  else {
    Swal.fire({
      title:  anggaran,
      html:
        '<input id="id" type="hidden">' +
        '<select id="Ultra" class="swal2-input" onchange="alert(this.value)"> <option value="0">Select</option><option value="8">text1</option> <option value="5">text2</option></select>'+
        '<input id="paket" class="swal2-input"  placeholder="Paket">' +
        '<input id="pagu" class="swal2-input"  placeholder="Pagu">'+
        '<input type="date" class="swal2-input" id="pelaksanaan" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31">'+
        '<input id="pdn" class="swal2-input" placeholder="PDN %">',

      focusConfirm: false,
      preConfirm: () => {

        CreateDetailLain(api_url_langsung, header_title)
      
      }
    })
    /*
     if(header_title == 'Langsung') {
          //const api_param = api_url_langsung
        }
        else if(header_title=="Kecuali") {
          //const api_param = api_url_pengecualian
        }
      */

  }
 
}



function CreateDetailPagu(api_param, header_title) {

  const waktupemilihan = document.getElementById("pemilihan").value;
  const waktupelaksanaan = document.getElementById("pelaksanaan").value;
  const waktupemanfaatan = document.getElementById("pemanfaatan").value;
  const pdn = document.getElementById("pdn").value;
  const paket = document.getElementById("paket").value;
  const pagu = document.getElementById("pagu").value;
  //console.log(pagu)
  //console.log(pdn)
  //console.log(waktupemilihan)
  //console.log(waktupelaksanaan)
  //console.log(waktupemilihan)
 // console.log(pagu)
  //console.log(paket)
  console.log(id_global)
  //console.log(pagu)
  
  console.log("ini hereader",header_title)
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", api_param);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "name": "Penelitian pengembangan Dan perekayasaan",
    "paket": paket,
    "pagu": pagu,
    "jadwal": waktupemanfaatan,
    "pemilihan": waktupemilihan,
    "pelaksanaan": waktupelaksanaan,
    "pdn": pdn,
    "idpagu": id_global
  }));

  xhttp.onreadystatechange = function() {
    detailTender(id_global)
    //detailPenunjukanLangsug(id_global)
    //detailPurchasing(id_global)
 
  };
  
  //console.log(id_global)
}

function CreateDetailLain(api_param, header_title) {

  //const waktupemilihan = document.getElementById("pemilihan").value;
  //const waktupelaksanaan = document.getElementById("pelaksanaan").value;
  const waktupemanfaatan = document.getElementById("pelaksanaan").value;
  const pdn = document.getElementById("pdn").value;
  const paket = document.getElementById("paket").value;
  const pagu = document.getElementById("pagu").value;
  //console.log(pagu)
 
  console.log(id_global)
  //console.log(pagu)
  
  console.log("ini hereader",header_title)
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", api_param);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({ 
    "name": "Penelitian pengembangan Dan perekayasaan",
    "paket": paket,
    "pagu": pagu,
    "tipe": header_title,
    "jadwal": waktupemanfaatan,
    "pdn": pdn,
    "idpagu": id_global
  }));

  xhttp.onreadystatechange = function() {
      detailLangsung(id_global)
      detailPenunjukanLangsug(id_global)
      detailPurchasing(id_global)
       detailPengecualian(id_global)
  };
  
  //console.log(id_global)
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
    
    };
    
}
function detailDelete(id, tender, api) {
    //console.log("data coba delete id", tender)
    let typedelete = ''
    console.log("informasi api",api)
    //console.log(api_param)
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", api+"/"+id);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
      "id": id
    }));
    xhttp.onreadystatechange = function() {
      detailAnggaran(id_global)
      detailTender(id_global)
      detailLangsung(id_global)
      detailKecuali(id_global)
      
    };
}
function detailPage(id) {
    var x = document.getElementById("detail");
    var y = document.getElementById("opdb")
    y.style.display = "none";
    x.style.display = "block";
    id_global = id;
    detailGolbalAnggaran()
    detailPaguItem(id)
    detailAnggaran(id)
    detailTender(id)
    detailLangsung(id)
    //detailKecuali(id)
    detailPenunjukanLangsug(id)
    detailPurchasing(id)
    detailPengecualian(id)
    
}




function detailPaguItem(id){
  const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api_url+'/'+id);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const objects = JSON.parse(this.responseText);
        //console.log(objects.data.data)
        const posts = objects.data.data
        var node = ''
        var divHtml = '' 
        //console.log(posts);
        node = document.createTextNode(posts.name);
        
        for(i=0;i<3;i++){

          const para = document.createElement("p");
          if(i==0){
            node = document.createTextNode(posts.name);
          }
          else if (i==1) {
            node = document.createTextNode(posts.paguopdp);
          }
          else if(i==2) {
            node = document.createTextNode(posts.paguorp);
          }
            para.appendChild(node);
            const element = document.getElementById("infodetail");
            element.appendChild(para);
          }
           
      }
    };
}

function createElement(){

  var text = ["text1", "tex2", "text3", "text4"];
	text.forEach(function(el) {
    var div = document.createElement("div");
    div.className = "finalBlock";
    div.innerHTML = el;
    document.body.appendChild(div);
  })
}


function detailAnggaran(id) {
  //console.log(id)
  const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api_url_anggaran+'/pagu/'+id);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {      
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        if(objects.data.data === null) {
          console.log('data kosong')
        }
        else {
          for (let object of objects.data.data) {
            let id_obj = object['id']
            //console.log(id_obj)
            trHTML += '<tr>'; 
            trHTML += '<td>'+1+'</td>';
            trHTML += '<td>'+object['name']+'</td>';
            trHTML += '<td>'+object['pagu']+'</td>';
            trHTML += '<td>'+object['pagu']+'</td>';
            trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\''+id_obj+'\')">edit </span></a>';
            trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\''+id_obj+'\',`anggaran`,\''+api_url_anggaran+'\')">delete_forever</span></a></td>';
           
            trHTML += "</tr>";
          }
        }
        
        document.getElementById("anggaran").innerHTML = trHTML;
        
      }
    };
    //console.log("data di load sudah");
}

function detailGolbalAnggaran() {
  //console.log(id)
  const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api_url_anggaran);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {      
        var trHTML = ''; 
        const objects = JSON.parse(this.responseText);
        if(objects.data.data === null) {
          console.log('data kosong')
        }
        else {
          for (let object of objects.data.data) {
          
            let id_obj = object['id']
            console.log(objects.data.data)
            trHTML += '<tr>'; 
            trHTML += '<td>'+1+'</td>';
            trHTML += '<td>'+object['name']+'</td>';
            trHTML += '<td>'+object['pagu']+'</td>';
            trHTML += '<td>'+object['pagu']+'</td>';
            trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\''+id_obj+'\')">edit </span></a>';
            trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\''+id_obj+'\',`anggaran`,\''+api_url_anggaran+'\')">delete_forever</span></a></td>';
           
            trHTML += "</tr>";
          
          }
        }
        
        document.getElementById("anggaran").innerHTML = trHTML;
        
      }
    };
    //console.log("data di load sudah");
}

function detailTender(id) {
  //console.log("eksekusi id tender", id)
  
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_tender+'/pagu/'+id)
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {      
      var trHTML = ''; 
      const objects = JSON.parse(this.responseText);
      if(objects.data.data != null){

        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(id_obj)
          trHTML += '<tr>'; 
          trHTML += '<td>'+1+'</td>';
          trHTML += '<td>'+object['name']+'</td>';
          trHTML += '<td>'+object['paket']+'</td>';
          trHTML += '<td>'+object['pagu']+'</td>';
          trHTML += '<td>'+object['pemilihan']+'</td>';
          trHTML += '<td>'+object['pelaksanaan']+'</td>'; 
          trHTML += '<td>'+object['jadwal']+'</td>';
          trHTML += '<td>'+object['pdn']+'</td>'; 
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\''+id_obj+'\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\''+id_obj+'\',`tender`,\''+api_url_tender+'\')">delete_forever</span></a></td>';
        
          trHTML += "</tr>";
        }
        document.getElementById("tender").innerHTML = trHTML;
      }
      else {
        console.log('data kosong')
      }
      
    }
  };
  
}
function detailLangsung(id) {
  //console.log("eksekusi id tender", id)
  
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung+'/pagu/'+id)
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {      
      var trHTML = ''; 
      const objects = JSON.parse(this.responseText);
      if(objects.data.data!=null){

        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(id_obj)
          trHTML += '<tr>'; 
          trHTML += '<td>'+2+'</td>';
          trHTML += '<td>'+object['name']+'</td>';
          trHTML += '<td>'+object['paket']+'</td>';
          trHTML += '<td>'+object['pagu']+'</td>';
          trHTML += '<td>'+object['jadwal']+'</td>';
          trHTML += '<td>'+object['pdn']+'</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\''+id_obj+'\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\''+id_obj+'\', `langsung`,\''+api_url_langsung+'\')">delete_forever</span></a></td>';
        
          trHTML += "</tr>";
        }
        document.getElementById("langsung").innerHTML = trHTML;
        }
    }
  };
  
}

const  detailPenunjukanLangsug = (id) =>{
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung+'/pagu/'+id+'/plangsung')
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {      
      var trHTML = ''; 
      const objects = JSON.parse(this.responseText);
      if(objects.data.data !=null) {

        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(id_obj)
          trHTML += '<tr>'; 
          trHTML += '<td>'+1+'</td>';
          trHTML += '<td>'+object['name']+'</td>';
          trHTML += '<td>'+object['paket']+'</td>';
          trHTML += '<td>'+object['pagu']+'</td>';
          trHTML += '<td>'+object['jadwal']+'</td>';
          trHTML += '<td>'+object['pdn']+'</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\''+id_obj+'\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\''+id_obj+'\', `kecuali`,\''+api_url_pengecualian+'\')">delete_forever</span></a></td>';
        
          trHTML += "</tr>";
        }
        document.getElementById("pllangsung").innerHTML = trHTML;
        }
      
    }
  };
}

const  detailPurchasing = (id) =>{
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung+'/pagu/'+id+'/purchasing')
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {      
      var trHTML = ''; 
      const objects = JSON.parse(this.responseText);
      if(objects.data.data !=null) {

        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(id_obj)
          trHTML += '<tr>'; 
          trHTML += '<td>'+1+'</td>';
          trHTML += '<td>'+object['name']+'</td>';
          trHTML += '<td>'+object['paket']+'</td>';
          trHTML += '<td>'+object['pagu']+'</td>';
          trHTML += '<td>'+object['jadwal']+'</td>';
          trHTML += '<td>'+object['pdn']+'</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\''+id_obj+'\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\''+id_obj+'\', `kecuali`,\''+api_url_pengecualian+'\')">delete_forever</span></a></td>';
        
          trHTML += "</tr>";
        }
        document.getElementById("purchasing").innerHTML = trHTML;
        }
      
    }
  };
}

const  detailPengecualian = (id) =>{
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung+'/pagu/'+id+'/kecuali')
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {      
      var trHTML = ''; 
      const objects = JSON.parse(this.responseText);
      if(objects.data.data !=null) {

        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(id_obj)
          trHTML += '<tr>'; 
          trHTML += '<td>'+1+'</td>';
          trHTML += '<td>'+object['name']+'</td>';
          trHTML += '<td>'+object['paket']+'</td>';
          trHTML += '<td>'+object['pagu']+'</td>';
          trHTML += '<td>'+object['jadwal']+'</td>';
          trHTML += '<td>'+object['pdn']+'</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\''+id_obj+'\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\''+id_obj+'\', `kecuali`,\''+api_url_pengecualian+'\')">delete_forever</span></a></td>';
        
          trHTML += "</tr>";
        }
        document.getElementById("kecuali").innerHTML = trHTML;
        }
      
    }
  };
}

function detailKecuali(id) {
  //console.log("eksekusi id tender", id)
  
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_pengecualian+'/pagu/'+id)
  xhttp.send();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {      
      var trHTML = ''; 
      const objects = JSON.parse(this.responseText);
      if(objects.data.data !=null) {

        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(id_obj)
          trHTML += '<tr>'; 
          trHTML += '<td>'+1+'</td>';
          trHTML += '<td>'+object['name']+'</td>';
          trHTML += '<td>'+object['paket']+'</td>';
          trHTML += '<td>'+object['pagu']+'</td>';
          trHTML += '<td>'+object['paket']+'</td>';
          trHTML += '<td>'+object['pagu']+'</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\''+id_obj+'\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\''+id_obj+'\', `kecuali`,\''+api_url_pengecualian+'\')">delete_forever</span></a></td>';
        
          trHTML += "</tr>";
        }
        document.getElementById("kecuali").innerHTML = trHTML;
        }
      
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
    
    };
}

function showPagu(){
    //const element = document.getElementsByTagName('p')
   //const element = document.getElementById("infodetail");
    // element.remove()
    var x = document.getElementById("detail");
    var y = document.getElementById("opdb")
    x.style.display = "none";
    y.style.display = "block";
    
}

  


  
 
