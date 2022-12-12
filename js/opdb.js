

const api = "http://localhost:3000/"
const api_url = api + "api/pagus";
const api_url_anggaran = api + "api/anggaran";
const api_url_tender = api + "api/tender"
const api_url_langsung = api + "api/langsung"
const api_url_pengecualian = api + "api/kecuali"
const api_url_total_tender_detail = api + "api/langsung/totalsemua"
const api_url_total_paket = api + "api/tender/totalpaket"

const api_sub_kegiatan = api + "api/anggaran/pagu"
var id_global = '';
var dataPdnPenmpungTemp = {};
var subKegiatanGlobal = ''
let subKegiatanGlobalAll = {}
let subKegiatan = [];
let namaSKPD = ''
var Namepaguskpd = ''
var Namepaguorp = ''
var linkdownload = ''
var dateTest = ''
var dataresponse = ''
let pdnTotalObject = {}
let pdnTotalObjectAll = {}

var jwt = localStorage.getItem("token");
if (jwt == null) {
  console.log(jwt)
  window.location.href = './login.html'
}
else {
  //if(isValidToken(jwt)==true){
   // window.location.href = './login.html'
  //}
  //isValidToken(jwt)  
}
/*
function isValidToken(token){
  cTs=Math.floor(Date.now() / 1000);
  console.log(cTs)
  console.log(token >= cTs)
  return (token>=cTs);
}
*/




const loadTable = (index, search) => {

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api + 'api/pagus/filter?page=' + index + '&' + 's=' + search);

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
      if (objects.totaldata == 0) {
        trHTML += '<tr>';
        trHTML += '<td style="color:red">' + '0' + '</td>';
        trHTML += '<td style="color:red">' + 'Data not found' + '</td>';
        trHTML += '<td style="color:red">' + 'Data not found' + '</td>';
        trHTML += '<td style="color:red">' + 'Data not found' + '</td>';
        trHTML += '<td style="color:red">' + 'Data not found' + '</td>';
        trHTML += "</tr>";
      }
      else {

        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['paguopdp']).replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['paguorp']).replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td class="actionbutton"><a href="javascript:void(0)" onclick="showUserEditBox(\'' + id_obj + '\')"> <i class="bx bx-pencil bx-sm bx-tada-hover"></i></a>';
          trHTML += '<a href="javascript:void(0)" onclick="detailPage(\'' + id_obj + '\')"><i class="bx bx-paperclip bx-sm bx-tada-hover"></i></a>';
          trHTML += '<a href="javascript:void(0)" onclick="paguDelete(\'' + id_obj + '\')"><i style="color:red;" class="bx bx-x bx-sm bx-tada-hover"></i></a></td>';

          trHTML += "</tr>";
        }
      }

      document.getElementById("mytable").innerHTML = trHTML;

    }

  };
}

const onserachdata = () => {
  console.log("embo")
  inputdata = document.getElementById("searchdata").value
  console.log(inputdata)
  loadTable("", inputdata)
  //searchdata
}


const loadPagination = async () => {
  const response = await fetch(api + 'api/pagus/filter', {
    headers: { token: localStorage.getItem('token') }
  })

  //xhttp.setRequestHeader("Accept", "application/json");
  //xhttp.setRequestHeader("token", localStorage.getItem('token'));
  const data = await response.json()

  const pagination = document.getElementById("pagination");
  for (i = 1; i <= Math.ceil(parseInt(data.totaldata) / 10); i++) {
    pagination.innerHTML += "<a href='javascript:void(0)'><li class='sectionlist' onclick='showIndex(" + i + ")'>" + i + "</li></a>";
  }
  const listItems = pagination.getElementsByTagName('li')
  listItems[0].classList.add('active');


}

const showIndex = (index) => {

  const pagination = document.getElementById('pagination');
  const listItems = pagination.getElementsByTagName('li')
  for (i = 0; i < listItems.length; i++) {
    listItems[i].classList.remove("active")
  }
  listItems[index - 1].classList.add('active');
  loadTable(index, "")
}

const hideloader = () => {
  document.getElementById('loading').style.display = 'none';
}
//getData()
loadTable(1, "");
loadPagination()
//detailTotalTenderDetail(id_global)

const paguCreate = () => {
  const name = document.getElementById("name").value;
  const paguopd = document.getElementById("paguopd").value;
  const paguorp = document.getElementById("paguorp").value;
  let data = new FormData()
  data.append("name", name)
  data.append("paguopdp", paguopd)
  data.append("paguorp", paguorp)
  data.append("filetipe", "_")

  fetch(api_url,{
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
    loadTable(1, "")
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

function showUserCreateBox() {
  Swal.fire({
    title: 'Create Pagu',
    icon: 'success',
    showDenyButton: true,
    confirmButtonText: 'Save',
    denyButtonText: `Don't save`,
    html:
      '<input id="id" type="hidden">' +
      '<input id="name" class="swal2-input" placeholder="Nama SKPD">' +
      '<input id="paguopd" type="number" class="swal2-input" placeholder="Pagu SKPD">' +
      '<input id="paguorp" type="number" class="swal2-input" placeholder="Pagu RUP">',
    focusConfirm: false,
    preConfirm: () => {
      paguCreate();
    }
  })
}

function showCreateAnggaran(anggaran) {
  let header_title = anggaran
  if (header_title == "anggaran") {
    Swal.fire({
      title: namaSKPD,
      icon: 'success',
      showDenyButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
      html:
        '<input id="id" type="hidden">' +
        '<input id="name" class="swal2-input" placeholder="Sub Kegiatan">' +
        '<input id="pagu" onfocus="(this.type=`number`)" class="swal2-input" placeholder="Jumlah">',
      focusConfirm: false,
      preConfirm: () => {
        //console.log('diseksuusi engaran')
        CreateAnggaran(api_url_anggaran, header_title)
        //detailGolbalAnggaran(id_global)
      }
    })
  }
  else if (header_title == 'swakelola') {
    const options = {};

    subKegiatan.forEach(element => {
      options[element] = element;
    });
    Swal.fire({
      title: 'Swakelola',
      icon: 'success',
      showDenyButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
      html:
        '<input id="id" type="hidden">' +
        '<select id="dropdown-list" style="width:15em" onfocus="loadDataKegiatan()" class="swal2-input"><option value="DEFAULT">Sub Kegiatan SKPD</option></select>' +
        '<input id="pagu" style="width:15em" class="swal2-input" onfocus="(this.type=`number`)" placeholder="Pagu">' +
        '<input id="keterangan" style="width:15em" class="swal2-input"  placeholder="Keterangan">' +
        '<input id="pdn" style="width:15em" type="number" class="swal2-input" placeholder="PDN %">',

      focusConfirm: false,
      preConfirm: () => {
        CreateSwakelola(api_url_langsung, header_title)

      }
    })
  }
  else {

    Swal.fire({
      title: anggaran == 'plangsung' ? "Penunjukan Langsung" : anggaran == 'kecuali' ? "Pengadaaan Di kecualikan" : anggaran == 'langsung' ? "Pengadaan Langsung" : "E-Purchsing",
      icon: 'success',
      showDenyButton: true,
      confirmButtonText: 'Save',
      denyButtonText: `Don't save`,
      html:
        '<input id="id" type="hidden">' +
        '<select id="dropdown-list" style="width:15em" onfocus="loadDataKegiatan()" class="swal2-input"><option value="DEFAULT">Sub Kegiatan SKPD</option></select>' +
        '<input id="paket" style="width:15em" class="swal2-input"  placeholder="Nama Paket">' +
        '<input id="pagu" style="width:15em" type="tex" onfocus="(this.type=`number`)"  class="swal2-input"  placeholder="Pagu">' +
        '<input type="text" style="width:15em" onfocus="(this.type=`date`)" placeholder="Waktu Pelaksanaan" class="swal2-input" id="pelaksanaan" name="trip-start"  min="2022-11-10" max="2025-12-31">' +
        '<input id="pdn" style="width:15em" type="text" onfocus="(this.type=`number`)" class="swal2-input" placeholder="PDN %">',

      focusConfirm: false,
      preConfirm: () => {

        CreateDetailLain(api_url_langsung, header_title)

      }
    })
  }

}


function CreateAnggaran(api_param, header_title) {
  const pagu = document.getElementById("pagu").value
  const name = document.getElementById("name").value

  let data = new FormData()
 
  data.append("name", name)
  data.append("paket", "000")
  data.append("pagu", parseInt(pagu))
  data.append("jadwal", "12-12-2022")
  data.append("pdn", parseInt(20))
  data.append("idpagu", id_global)

  fetch(api_param,{
    method: 'POST',
    headers: {
       token: localStorage.getItem('token')
    },
    body: data
  }).then(response => {
    console.log('response.status: ', response.status);
    console.log(response)
    Swal.fire('Saved!', '', 'success')
    detailAnggaran(id_global)
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

const CreateDetailPagu = (api_param, header_title) => {

  var selecinput = document.getElementById("input-select").value;
  var selectSubkegiatan = document.getElementById("dropdown-list").value
  const waktupemilihan = document.getElementById("pemilihan").value;
  const waktupelaksanaan = document.getElementById("pelaksanaan").value;
  const waktupemanfaatan = document.getElementById("pemanfaatan").value;
  const pdn = document.getElementById("pdn").value;
  const paket = document.getElementById("paket").value;
  const pagu = document.getElementById("pagu").value;
  
  let data = new FormData()
  data.append("name", selectSubkegiatan)
  data.append("paket", paket)
  data.append("pagu", parseInt(pagu))
  data.append("jadwal", waktupemanfaatan)
  data.append("pemilihan", waktupemilihan)
  data.append("tipe", "default")
  data.append("pelaksanaan", waktupelaksanaan)
  data.append("pdn", parseInt(pdn))
  data.append("tender", selecinput)
  data.append("idpagu", id_global)
  data.append("ket", "ket")
  fetch(api + 'api/langsung',{
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
    detailTender(id_global)
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

function CreateSwakelola(api_param, header_title) {

  const pdn = document.getElementById("pdn").value;
  const pagu = document.getElementById("pagu").value;
  const keterangan = document.getElementById("keterangan").value

  var selectSubkegiatan = document.getElementById("dropdown-list").value

  let data = new FormData()
  data.append("name", selectSubkegiatan)
  data.append("paket", "default")
  data.append("pagu", parseInt(pagu))
  data.append("tipe", header_title)
  data.append("jadwal","12-12-2022")
  data.append("ket", "keterangan")
  data.append("tender", "default")
  data.append("pelaksanaan", "12-12-2022")
  data.append("pemilihan", "12-12-2022")
  data.append("pdn", parseInt(pdn))
  data.append("idpagu", id_global)

  fetch(api_param,{
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
      detailLangsung(id_global)
      detailPenunjukanLangsug(id_global)
      detailPurchasing(id_global)
      detailPengecualian(id_global)
      detailSwakelola(id_global)
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

function CreateDetailLain(api_param, header_title) {

  const waktupemanfaatan = document.getElementById("pelaksanaan").value;

  var selectSubkegiatan = document.getElementById("dropdown-list").value
  const pdn = document.getElementById("pdn").value;
  const paket = document.getElementById("paket").value;
  const pagu = document.getElementById("pagu").value;
  let data = new FormData()
  data.append("name", selectSubkegiatan)
  data.append("paket", paket)
  data.append("pagu", parseInt(pagu))
  data.append("tipe", header_title)
  data.append("jadwal", waktupemanfaatan)
  data.append("pdn",parseInt(pdn))

  data.append("ket", "ket")
  data.append("tender", "default")
  data.append("pelaksanaan",waktupemanfaatan)

  data.append("tender", "default")
  data.append("pemilihan",waktupemanfaatan)
  data.append("idpagu", id_global)

 
  fetch(api_param,{
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
      detailLangsung(id_global)
      detailPenunjukanLangsug(id_global)
      detailPurchasing(id_global)
      detailPengecualian(id_global)
      refreshTotal()
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

const deletePagu = (id) => {

  fetch(api+"api/pagus/"+id, {
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
    loadTable(1, "")
  }).catch(err => {
    console.log(err)
    
  })

}

function paguDelete(id) {

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
      deletePagu(id)
     
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
function detailDelete(id, tender, api) {

  let typedelete = ''


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
       deleteTender(id, tender, api)
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


const deleteTender = (id, tender, api) => {


  fetch(api + "/" +id, {
    method: 'DELETE',
    headers: {
      token: localStorage.getItem('token')
   },
  }).then(response => {
    console.log('response.status: ', response.status);
    console.log(response)
    Swal.fire(
      'Deleted!',
      'Your data has been deleted.',
      'success'
    )
    detailAnggaran(id_global)
    detailTender(id_global)
    detailLangsung(id_global)
    detailPenunjukanLangsug(id_global)
    detailPurchasing(id_global)
    detailPengecualian(id_global)
    detailSwakelola(id_global)
    refreshTotal()
  }).catch(err => {
    console.log(err)
    
  })


}
const refreshPage = () => [
  detailAnggaran(id_global)
]


function detailPage(id) {
  var x = document.getElementById("detail");
  var y = document.getElementById("opdb")
  y.style.display = "none";
  x.style.display = "block";
  id_global = id;
  //detailGolbalAnggaran(id)
  detailPaguItem(id)
  detaiDownload(id)
  detailAnggaran(id)
  detailTender(id)
  detailLangsung(id)
  detailPenunjukanLangsug(id)
  detailPurchasing(id)
  detailPengecualian(id)
  detailSwakelola(id)
  detailTotalTenderDetail(id)
  detailTotalTenderDetailCepatSeleksi(id)
  detailTotalTenderDetailReport(id)
  detailTotalTenderDetailReportJumlah(id)
  detailTotalTenderDetailReportJumlahPagu(id)
  //detailTotalTenderDetailReportSeleksi(id)
  detailTotalTenderDetailReportSeleksiJumlah(id)
  detailTotalTenderDetailReportSeleksiRupiah(id)
  // detaiDownload()
  //totalPdn(id)
  //totalPdnTender(id)
  //detaiDownload()
  //infoTotalDn()

  //skpdName(id)

}

function createElement() {

  var text = ["text1", "tex2", "text3", "text4"];
  text.forEach(function (el) {
    var div = document.createElement("div");
    div.className = "finalBlock";
    div.innerHTML = el;
    document.body.appendChild(div);
  })
}



function getvals(id) {
  //headers: {token: localStorage.getItem('token')}
  return fetch(api + 'api/totalpdn/' + id,
    {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': localStorage.getItem('token')
      },
    })
    .then((response) => response.json())
    .then((responseData) => {
      //console.log(responseData);
      dataobject = responseData
      return responseData;
    })
    .catch(error => console.warn(error));
}

const calculatePdn = (objectdata, id) => {
  if (objectdata.data.data == null) {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api_url_anggaran + '/pagu/' + id);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("token", localStorage.getItem('token'));
    xhttp.send();
    let objects = ''

    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var trHTML = '';
        objects = JSON.parse(this.responseText);


        if (objects.data.data === null) {
          console.log('data kosong')
        }
        else {
          let i = 0;
          let j = 0
          for (let object of objects.data.data) {
            let id_obj = object['id']
            i++;


            trHTML += '<tr>';
            trHTML += '<td>' + i + '</td>';
            trHTML += '<td>' + object['name'] + '</td>';
            trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(object['pagu'])
              .replace(/[IDR]/gi, '')
              .replace(/(\.+\d{2})/, '')
              .trimLeft() + '</td>';
            trHTML += '<td>' + 'Nan' + '</td>';
            trHTML += '<td class="actionbutton"><a href="javascript:void(0)" onclick="showAnggaranEditBox(\'' + id_obj + '\',`anggaran`,\'' + api_url_anggaran + '\')"> <i class="bx bx-pencil bx-sm bx-tada-hover"></i></a>';
            trHTML += '<a href="javascript:void(0)" onclick="detailDelete(\'' + id_obj + '\',`anggaran`,\'' + api_url_anggaran + '\')"><i style="color:red;" class="bx bx-x bx-sm bx-tada-hover"></i></a></td>';
        
            trHTML += "</tr>";
            j++;
          }
        }

        document.getElementById("anggaran").innerHTML = trHTML;

      }
    };

  }
  else {
    console.log(objectdata)
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api_url_anggaran + '/pagu/' + id);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("token", localStorage.getItem('token'));
    xhttp.send();
    let objects = ''
    let pdnavg = ''
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var trHTML = '';
        objects = JSON.parse(this.responseText);


        if (objects.data.data === null) {
          console.log('data kosong')
        }
        else {
          let i = 0;
          let j = 0
          for (let object of objects.data.data) {
            let id_obj = object['id']
            i++;
            if (objectdata.data.data[j] == undefined) {
              pdnavg = 'Nan'
            }
            else {
              console.log(pdnavg)
              pdnavg = objectdata.data.data[j].pdn
            }
            trHTML += '<tr>';
            trHTML += '<td>' + i + '</td>';
            trHTML += '<td>' + object['name'] + '</td>';
            trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(object['pagu'])
              .replace(/[IDR]/gi, '')
              .replace(/(\.+\d{2})/, '')
              .trimLeft() + '</td>';
            trHTML += '<td>' + pdnavg + '</td>';      
            trHTML += '<td class="actionbutton"><a href="javascript:void(0)" onclick="showAnggaranEditBox(\'' + id_obj + '\',`anggaran`,\'' + api_url_anggaran + '\')"> <i class="bx bx-pencil bx-sm bx-tada-hover"></i></a>';
            trHTML += '<a href="javascript:void(0)" onclick="detailDelete(\'' + id_obj + '\',`anggaran`,\'' + api_url_anggaran + '\')"><i style="color:red;" class="bx bx-x bx-sm bx-tada-hover"></i></a></td>';   
            trHTML += "</tr>";
            j++;
          }
        }
        //console.log("data onject", objects)

        document.getElementById("anggaran").innerHTML = trHTML;

      }
    };
  }
}
const detailAnggaran = (id) => {
  //const embkono = ["silver", "larougm"]
  //console.log(getvals)
  //var dataob = ''
  getvals(id).then(response =>
    calculatePdn(response, id)
  );
}


/*
function detailPaguItem(id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url + '/' + id);
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);

      const posts = objects.data.data

      namaSKPD = posts.name
      dateTest = posts.name
      Namepaguskpd = posts.paguopdp
      Namepaguorp = posts.paguorp
      linkdownload = posts.filetipe
      //console.log(linkdownload)
      id_global = posts.id
      var trHTML = '';


      trHTML += '<tr>';
      trHTML += '<td>' + 1 + '</td>';
      trHTML += '<td>' + posts['name'] + '</p>' + '</td>';
      trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(posts['paguopdp']).replace(/[IDR]/gi, '')
        .replace(/(\.+\d{2})/, '')
        .trimLeft() + '</p>' + '</td>';
      trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(posts['paguorp']).replace(/[IDR]/gi, '')
        .replace(/(\.+\d{2})/, '')
        .trimLeft() + '</td>';

      trHTML += "</tr>";
    }

    document.getElementById("detailinformasi").innerHTML = trHTML;
  };

}
*/

const detailPaguItem = (id) => {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url + '/' + id);
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);

      const posts = objects.data.data

      namaSKPD = posts.name
      dateTest = posts.name
      Namepaguskpd = posts.paguopdp
      Namepaguorp = posts.paguorp
      linkdownload = posts.filetipe
      //console.log(linkdownload)
      id_global = posts.id
      var trHTML = '';


      trHTML += '<tr>';
      trHTML += '<td>' + 1 + '</td>';
      trHTML += '<td>' + posts['name'] + '</p>' + '</td>';
      trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(posts['paguopdp']).replace(/[IDR]/gi, '')
        .replace(/(\.+\d{2})/, '')
        .trimLeft() + '</p>' + '</td>';
      trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(posts['paguorp']).replace(/[IDR]/gi, '')
        .replace(/(\.+\d{2})/, '')
        .trimLeft() + '</td>';

      trHTML += "</tr>";
    }

      document.getElementById("detailinformasi").innerHTML = trHTML;

    }
  };




const detailTender = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/default')
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  xhttp.send();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        //console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + new Date(object['pemilihan']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + new Date(object['pelaksanaan']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + new Date(object['jadwal']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + object['tender'] + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';
          trHTML += '<td class="actionbutton"><a href="javascript:void(0)" onclick="showTenderDetailEditBox(\'' + id_obj + '\',`tender`,\'' + api_url_langsung + '\')"><i class="bx bx-pencil bx-sm bx-tada-hover"></i></a>';
          trHTML += '<a href="javascript:void(0)" onclick="detailDelete(\'' + id_obj + '\',`plangsung`,\'' + api_url_langsung + '\')"><i style="color:red;" class="bx bx-x bx-sm bx-tada-hover"></i></a></td>';
          trHTML += "</tr>";
        }
      }

      document.getElementById("tender").innerHTML = trHTML;

    }
  };

}


const detailLangsung = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/langsung')
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));

  xhttp.send();
  //console.log("anggaran di eksekusi", id)

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++

          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + new Date(object['pelaksanaan']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';       
          trHTML += '<td class="actionbutton"><a href="javascript:void(0)" onclick="showLangsungEditBox(\'' + id_obj + '\',`langsung`,\'' + api_url_langsung + '\')"> <i class="bx bx-pencil bx-sm bx-tada-hover"></i></a>';
          trHTML += '<a href="javascript:void(0)" onclick="detailDelete(\'' + id_obj + '\',`langsung`,\'' + api_url_langsung + '\')"><i style="color:red;" class="bx bx-x bx-sm bx-tada-hover"></i></a></td>';
          trHTML += "</tr>";
        }
      }

      document.getElementById("langsung").innerHTML = trHTML;

    }
  };

}

const detailPenunjukanLangsug = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/plangsung')
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));

  //xhttp.open("GET", api_url_langsung+ '/pagu/'+id);
  xhttp.send();
  //console.log("anggaran di eksekusi", id)

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++

          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + new Date(object['pelaksanaan']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';
          trHTML += '<td class="actionbutton"><a href="javascript:void(0)" onclick="showLangsungEditBox(\'' + id_obj + '\',`langsung`,\'' + api_url_langsung + '\')"> <i class="bx bx-pencil bx-sm bx-tada-hover"></i></a>';
          trHTML += '<a href="javascript:void(0)" onclick="detailDelete(\'' + id_obj + '\',`plangsung`,\'' + api_url_langsung + '\')"><i style="color:red;" class="bx bx-x bx-sm bx-tada-hover"></i></a></td>';
          trHTML += "</tr>";
        }
      }

      document.getElementById("pllangsung").innerHTML = trHTML;

    }
  };

}


const detailPurchasing = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/purchasing')
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));

  //xhttp.open("GET", api_url_langsung+ '/pagu/'+id);
  xhttp.send();
  //console.log("anggaran di eksekusi", id)

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++

          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + new Date(object['pelaksanaan']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';
          trHTML += '<td class="actionbutton"><a href="javascript:void(0)" onclick="showLangsungEditBox(\'' + id_obj + '\',`langsung`,\'' + api_url_langsung + '\')"> <i class="bx bx-pencil bx-sm bx-tada-hover"></i></a>';
          trHTML += '<a href="javascript:void(0)" onclick="detailDelete(\'' + id_obj + '\',`purchasing`,\'' + api_url_langsung + '\')"><i style="color:red;" class="bx bx-x bx-sm bx-tada-hover"></i></a></td>';
          trHTML += "</tr>";
        }
      }

      document.getElementById("purchasing").innerHTML = trHTML;

    }
  };

}


const detailPengecualian = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/kecuali')
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));

  //xhttp.open("GET", api_url_langsung+ '/pagu/'+id);
  xhttp.send();
  //console.log("anggaran di eksekusi", id)

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++

          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + new Date(object['pelaksanaan']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';

          trHTML += '<td class="actionbutton"><a href="javascript:void(0)" onclick="showLangsungEditBox(\'' + id_obj + '\',`langsung`,\'' + api_url_langsung + '\')"> <i class="bx bx-pencil bx-sm bx-tada-hover"></i></a>';
          trHTML += '<a href="javascript:void(0)" onclick="detailDelete(\'' + id_obj + '\',`kecuali`,\'' + api_url_langsung + '\')"><i style="color:red;" class="bx bx-x bx-sm bx-tada-hover"></i></a></td>';
      
          trHTML += "</tr>";
        }
      }

      document.getElementById("kecuali").innerHTML = trHTML;

    }
  };

}




const detailSwakelola = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/swakelola')
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));

  //xhttp.open("GET", api_url_langsung+ '/pagu/'+id);
  xhttp.send();
  //console.log("anggaran di eksekusi", id)

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++

          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + object['ket'] + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';

          trHTML += '<td class="actionbutton"><a href="javascript:void(0)" onclick="showSwakelolaEditBox(\'' + id_obj + '\',`langsung`,\'' + api_url_langsung + '\')"> <i class="bx bx-pencil bx-sm bx-tada-hover"></i></a>';
          trHTML += '<a href="javascript:void(0)" onclick="detailDelete(\'' + id_obj + '\',`swakelola`,\'' + api_url_langsung + '\')"><i style="color:red;" class="bx bx-x bx-sm bx-tada-hover"></i></a></td>';
          trHTML += "</tr>";
        }
      }

      document.getElementById("swakelola").innerHTML = trHTML;

    }
  };

}

const showUserEditBox = (id) => {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url + '/' + id);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));

  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      const posts = objects.data.data
      Swal.fire({
        title: 'Edit Pagu',
        showDenyButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        html:
          '<input id="id" type="hidden" value=' + posts['id'] + '>' +
          '<input id="filetipe" type="hidden" value=' + posts['filetipe'] + '>' +
          '<input id="name"  class="swal2-input" placeholder="Nama Odp" value="' + posts['name'] + '">' +
          '<input id="paguopd" type="number" class="swal2-input" placeholder="Pagu Odp" value="' + posts['paguopdp'] + '">' +
          '<input id="paguorp" type="number" class="swal2-input" placeholder="Pagu Orp" value="' + posts['paguorp'] + '">',
        focusConfirm: false,
        preConfirm: () => {
          paguEdit()
        }
      })


    }
  };
}

const showAnggaranEditBox = (id, header_title, api_param_anggaran) => {
  console.log(api_param_anggaran)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_param_anggaran + '/' + id);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));

  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      const posts = objects.data.data
      // console.log(posts)
      Swal.fire({
        title: 'Pagu ' + header_title,
        icon: 'success',
        showDenyButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        html:
          '<input id="id" type="hidden" value=' + posts['id'] + '>' +
          '<input id="name" class="swal2-input" placeholder="Sub Kegiatan" value="' + posts['name'] + '">' +
          '<input id="pagu" class="swal2-input" placeholder="Jumlah" value="' + posts['pagu'] + '">',
        focusConfirm: false,
        preConfirm: () => {
          editAnggaran()
          detailAnggaran(id_global)
        }
      })


    }
  };

}

const tenderLangsungEdit = () => {

  const id = document.getElementById("id").value;
  //const name = document.getElementById("name").value;

  var selectSubkegiatan = document.getElementById("dropdown-list").value
  const pagu = document.getElementById("pagu").value;
  const pelaksanaan = document.getElementById("pelaksanaan").value;
  const pemilihan = document.getElementById("pemilihan").value;
  //const pemanfaatan = document.getElementById("pemanfaatan").value;
  const tipe = document.getElementById("tipe").value;
  const pdn = document.getElementById("pdn").value
  // const tender = document.getElementById("tender").value

  //const tenderlo = document.getElementById("tender").value
  const paket = document.getElementById("paket").value
  const idpagu = document.getElementById("idpagu").value
  const keterangan = document.getElementById("ket").value

  let data = new FormData()
  data.append("name", selectSubkegiatan)
  data.append("paket", paket)
  data.append("pagu", parseInt(pagu))
  data.append("tipe", tipe)
  data.append("jadwal", pelaksanaan)
  data.append("pdn",parseInt(pdn))

  data.append("ket", keterangan)
  data.append("tender", "default")
  data.append("pelaksanaan",pelaksanaan)

  data.append("tender", "default")
  data.append("pemilihan",pelaksanaan)
  data.append("idpagu", idpagu)

 
  fetch(api + "api/langsung/" + id,{
    method: 'PUT',
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
      detailLangsung(id_global)
      detailPenunjukanLangsug(id_global)
      detailPurchasing(id_global)
      detailPengecualian(id_global)
      refreshTotal()
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




const showLangsungEditBox = (id, header_title, api_param) => {
  //console.log(api_param_anggaran)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_param + '/' + id);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));

  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      const posts = objects.data.data
      // console.log(posts)
      Swal.fire({
        title: "Edit",
        icon: 'success',
        showDenyButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        html:
          '<input id="id" type="hidden" value=' + posts['id'] + '>' +
          '<input id="tipe" type="hidden" value=' + posts['tipe'] + '>' +
          '<input id="idpagu" type="hidden" value=' + posts['idpagu'] + '>' +
          //'<input id="tender" type="text" value=' + posts['tender'] + '>' +
          //'<input id="pemanfaatan" type="hidden" value=' + posts['pemanfaatan'] + '>' +
          '<input id="pemilihan" type="hidden" value=' + posts['pemilihan'] + '>' +
          //'<input id="paket" type="hidden" value=' + posts['paket'] + '>' + loadSelectTender
          '<input id="ket" type="hidden" value=' + posts['ket'] + '>' +
          '<select id="dropdown-list" style="width:15em"  onfocus="loadDataKegiatanEdit(\'' + posts['name'] + '\')" class="swal2-input"><option value="DEFAULT">Sub Kegiatan SKPD</option></select>' +
          '<input id="paket" style="width:15em" class="swal2-input" placeholder="Sub Kegiatan" value="' + posts['paket'] + '">' +
          '<input id="pagu" style="width:15em" class="swal2-input" placeholder="Jumlah" value="' + posts['pagu'] + '">' +
          '<input type="text" style="width:15em" onfocus="(this.type=`date`)" placeholder="Waktu Pelaksanaan" class="swal2-input" id="pelaksanaan" name="trip-start"  min="2022-11-10" max="2025-12-31"  value="' + posts['pelaksanaan'] + '">' +
          '<input id="pdn" style="width:15em" type="text" onfocus="(this.type=`number`)" class="swal2-input" placeholder="PDN %" value="' + posts['pdn'] + '">',
        focusConfirm: false,
        preConfirm: () => {
          tenderLangsungEdit()
          //detailAnggaran(id_global)
        }
      })


    }
  };

}


const tenderCepatEdit = () => {

  const id = document.getElementById("id").value; //1
  //const name = document.getElementById("name").value;

  var selectSubkegiatan = document.getElementById("dropdown-list").value
  const pagu = document.getElementById("pagu").value;
  const pelaksanaan = document.getElementById("pelaksanaan").value;
  const pemilihan = document.getElementById("pemilihan").value;
  //const pemanfaatan = document.getElementById("pemanfaatan").value;
  const tipe = document.getElementById("input-select").value;
  const pdn = document.getElementById("pdn").value
  // const tender = document.getElementById("tender").value

  const tenderlo = document.getElementById("input-select").value
  const paket = document.getElementById("name").value
  const idpagu = document.getElementById("idpagu").value
  //const keterangan = document.getElementById("ket").value
  let data = new FormData()


  data.append("name", selectSubkegiatan)
  data.append("pagu", parseInt(pagu))
  data.append("jadwal", pelaksanaan)
  data.append("tipe", "default")
  data.append("pdn", parseInt(pdn))
  data.append("idpagu", idpagu)
  data.append("tender", tenderlo)
  data.append("pelaksanaan", pelaksanaan)
  data.append("pemilihan", pemilihan)
  data.append("paket", paket)
  data.append("ket", "ket")

  
  fetch(api + "api/langsung/" + id,{
    method: 'PUT',
    headers: {
       token: localStorage.getItem('token')
    },
    body: data
  }).then(response => {
    Swal.fire(
      'Good job!',
      'Your data have been Edit',
      'success'
    )
      detailAnggaran(id_global)
      detailTender(id_global)
      refreshTotal()
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

const showTenderDetailEditBox = (id, header_title, api_param) => {
  //console.log(api_param_anggaran)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_param + '/' + id);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));

  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      const posts = objects.data.data
      // console.log(posts)
      nampaket = posts['name']
      Swal.fire({
        icon: 'success',
        title: "Edit",
        showDenyButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        html:
          '<input id="id" type="hidden" value=' + posts['id'] + '>' +
          '<input id="idpagu" type="hidden" value=' + posts['idpagu'] + '>' +
          //<option selected="selected">3</option>                                                             onclick="showUserEditBox(\'' + id_obj + '\')
          '<select id="dropdown-list" style="width:15em"  onfocus="loadDataKegiatanEdit(\'' + posts['name'] + '\')" class="swal2-input"></select>' +
          '<input id="name" style="width:15em" class="swal2-input" placeholder="Nama Paket" value="' + posts['paket'] + '">' +
          '<input id="pagu" style="width:15em" class="swal2-input" placeholder="Pagu" value="' + posts['pagu'] + '">' +
          '<select id="input-select" style="width:15em"  onfocus="loadSelectTender(\'' + posts['tender'] + '\')" class="swal2-input"><option value=' + posts['tender'] + '\>' + posts['tender'] + '\</option></select>' +
          '<input id="pdn" type="text" onfocus="(this.type=`number`)" style="width:15em" class="swal2-input" placeholder="PDN %" value="' + posts['pdn'] + '">' +
          '<input type="text" onfocus="(this.type=`date`)" style="width:15em" placeholder="Waktu Pemilihan" class="swal2-input" id="pemilihan" name="trip-start"  min="2022-11-10" max="2025-12-31"  value="' + posts['pemilihan'] + '">' +
          '<input type="text" onfocus="(this.type=`date`)" style="width:15em" placeholder="Waktu Pelaksanaan" class="swal2-input" id="pelaksanaan" name="trip-start"  min="2022-11-10" max="2025-12-31"  value="' + posts['pelaksanaan'] + '">' +
          '<input type="text" onfocus="(this.type=`date`)" style="width:15em" placeholder="Waktu Pemanfaatan" class="swal2-input" id="pemanfaatan" name="trip-start"  min="2022-11-10" max="2025-12-31"  value="' + posts['jadwal'] + '">',
        focusConfirm: false,
        preConfirm: () => {
          tenderCepatEdit()
          //detailAnggaran(id_global)
          //refreshTotal()
        }
      })


    }
  };

}



const showSwakelolaEditBox = (id, header_title, api_param) => {
  //console.log(api_param_anggaran)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_param + '/' + id);
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));

  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      const posts = objects.data.data
      // console.log(posts)
      Swal.fire({
        title: "Edit Swakelola",
        icon: 'success',
        showDenyButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
        html:
          '<input id="id" type="hidden" value=' + posts['id'] + '>' +
          '<input id="idpagu" type="hidden" value=' + posts['idpagu'] + '>' +
          '<select id="dropdown-list" style="width:15em"  onfocus="loadDataKegiatanEdit(\'' + posts['name'] + '\')" class="swal2-input"><option value="DEFAULT">Sub Kegiatan SKPD</option></select>' +

          '<input id="pagu" style="width:15em" class="swal2-input" placeholder="Jumlah" value="' + posts['pagu'] + '">' +
          '<input id="ket" style="width:15em" class="swal2-input" placeholder="Keterangan" value="' + posts['ket'] + '">' +
          // '<input type="text" style="width:15em" onfocus="(this.type=`date`)" placeholder="Waktu Pelaksanaan" class="swal2-input" id="pelaksanaan" name="trip-start"  min="2022-11-10" max="2025-12-31"  value="' + posts['pelaksanaan'] + '">'+
          '<input id="pdn" style="width:15em" type="text" onfocus="(this.type=`number`)" class="swal2-input" placeholder="PDN %" value="' + posts['pdn'] + '">',
        focusConfirm: false,
        preConfirm: () => {
          swakelolaLangsungEdit()
          detailAnggaran(id_global)
        }
      })


    }
  };

}

const swakelolaLangsungEdit = () => {

  const id = document.getElementById("id").value;
  var selectSubkegiatan = document.getElementById("dropdown-list").value
  const pagu = document.getElementById("pagu").value;
  const pdn = document.getElementById("pdn").value
  const idpagu = document.getElementById("idpagu").value
  const keterangan = document.getElementById("ket").value


  let data = new FormData()


  data.append("name", selectSubkegiatan)
  data.append("pagu", parseInt(pagu))
  data.append("jadwal", "12-12-2022")
  data.append("tipe", "swakelola")
  data.append("pdn", parseInt(pdn))
  data.append("idpagu", idpagu)
  data.append("tender", "default")
  data.append("pelaksanaan", "12-12-2022")
  data.append("pemilihan", "12-12-2022")
  data.append("paket", "default")
  data.append("ket", keterangan)
  // xhttp.open("PUT", api + "api/langsung/" + id);
  fetch(api + "api/langsung/" + id,{
    method: 'PUT',
    headers: {
       token: localStorage.getItem('token')
    },
    body: data
  }).then(response => {
    Swal.fire(
      'Good job!',
      'Your data have been Edit',
      'success'
    )
     detailSwakelola(id_global)
     refreshTotal()
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


const editAnggaran = () => {


  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const paguopd = document.getElementById("pagu").value;


  let data = new FormData()
 
  data.append("name", name)
  data.append("paket", "000")
  data.append("pagu", parseInt(paguopd))
  data.append("jadwal", "12-12-2022")
  data.append("pdn", parseInt(20))
  data.append("idpagu", id_global)

  fetch(api_url_anggaran+"/"+id,{
    method: 'PUT',
    headers: {
       token: localStorage.getItem('token')
    },
    body: data
  }).then(response => {
    //console.log('response.status: ', response.status);
    //console.log(response)
    Swal.fire(
      'Good job!',
      'You edit have been save',
      'success'
    )
    detailAnggaran(id_global)
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


const paguEdit = () => {

  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const paguopd = document.getElementById("paguopd").value;
  const paguorp = document.getElementById("paguorp").value;
  const filetipe = document.getElementById("filetipe").value;
  let data = new FormData()
  data.append("name", name)
  data.append("paguopdp", paguopd)
  data.append("paguorp", paguorp)
  data.append("filetipe", filetipe)

  fetch(api_url+"/"+id,{
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
    loadTable(1, "")
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

function showPagu() {
  //const element = document.getElementsByTagName('p')
  //const element = document.getElementById("infodetail");
  // element.remove()
  var x = document.getElementById("detail");
  var y = document.getElementById("opdb")
  //x.innerHTML = ""
  x.style.display = "none";
  y.style.display = "block";
  window.location.reload();
  //localStorage.clear();
  //location.reload()
  //detailPage(id_global)

}

const loadDataKegiatan = () => {
  console.log(id_global)
  let dropdown = document.getElementById('dropdown-list');
  dropdown.length = 0;

  let defaultOption = document.createElement('option');
  defaultOption.text = 'Kegiatan SKPD';

  dropdown.add(defaultOption);
  dropdown.selectedIndex = 0;
  //console.log(data)
  //const url = 'http://localhost:3000/api/pagus';

  const request = new XMLHttpRequest();
  request.open('GET', api_sub_kegiatan + '/' + id_global, true);
  request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader("token", localStorage.getItem('token'));

  request.onload = function () {
    if (request.status === 200) {
      const objects = JSON.parse(request.responseText);
      let option;
      //console.log("isi",objects)
      //console.log(objects.data.data.length)
      for (let i = 0; i < objects.data.data.length; i++) {
        //console.log(data)
        option = document.createElement('option');
        option.text = objects.data.data[i].name;
        option.value = objects.data.data[i].name;
        dropdown.add(option);


      }
    } else {
      console.log("data tidak ada")
    }
  }

  request.onerror = function () {
    console.error('An error occurred fetching the JSON from ' + url);
  };

  request.send();

}

const loadSelectTender = (data) => {

  let dropdown = document.getElementById('input-select');
  dropdown.length = 0;

  //let defaultOption = document.createElement('option');
  //defaultOption.text = 'Jenis Tender';
  //dropdown.add(defaultOption);

  let dataselect = ["Tender", "Seleksi", "Tender Cepat"]
  //dropdown.add(defaultOption);
  for (i = 0; i < dataselect.length; i++) {
    option = document.createElement('option');
    option.text = dataselect[i]
    option.value = dataselect[i]
    dropdown.add(option);
    if (data == dataselect[i]) {
      console.log(data, "dan index ke ", i + 1)
      dropdown.selectedIndex = i + 1;

    }
  }

}

const loadDataKegiatanEdit = (data) => {
  console.log(id_global)
  let dropdown = document.getElementById('dropdown-list');
  dropdown.length = 0;

  let defaultOption = document.createElement('option');
  defaultOption.text = 'Kegiatan SKPD';

  dropdown.add(defaultOption);
  // dropdown.selectedIndex = 0;
  //console.log(data)
  //const url = 'http://localhost:3000/api/pagus';

  const request = new XMLHttpRequest();
  request.open('GET', api_sub_kegiatan + '/' + id_global, true);

  request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  request.setRequestHeader("Accept", "application/json");
  request.setRequestHeader("token", localStorage.getItem('token'));
  request.onload = function () {
    if (request.status === 200) {
      const objects = JSON.parse(request.responseText);
      let option;
      //console.log("isi",objects)
      console.log(objects.data.data.length)
      for (let i = 0; i < objects.data.data.length; i++) {
        //console.log(data)
        option = document.createElement('option');
        option.text = objects.data.data[i].name;
        option.value = objects.data.data[i].name;
        dropdown.add(option);
        if (data == objects.data.data[i].name) {
          console.log(data, "dan index ke ", i + 1)
          dropdown.selectedIndex = i + 1;

        }


      }
    } else {
      console.log("data tidak ada")
    }
  }

  request.onerror = function () {
    console.error('An error occurred fetching the JSON from ' + url);
  };

  request.send();

}

const showFastTender = (anggaran) => {
  //console.log("isi id",id)
  Swal.fire({
    title: 'Add Data ' + anggaran,
    icon: "success",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: 'Save',
    denyButtonText: `Don't save`,
    html:
      '<input id="id" type="hidden">' +
      '<select id="dropdown-list" style="width:15em" onfocus="loadDataKegiatan()" class="swal2-input"><option value="DEFAULT">Sub Kegiatan SKPD</option></select>' +
      '<input id="paket" class="swal2-input" style="width:15em"  placeholder="Nama Paket">' +
      '<input id="pagu" class="swal2-input" style="width:15em"  onfocus="(this.type=`number`)" placeholder="Pagu">' +
      '<select class="swal2-input time-input" style="width:15em" id="input-select"> <option value="">Jenis Tender</option><option value="Tender">Tender</option><option value="Seleksi">Seleksi</option><option value="Tender cepat">Tender Cepat</option></select>' +
      '<input type="text" onfocus="(this.type=`date`)" style="width:15em" placeholder="Waktu Pemilihan" class="swal2-input time-input" id="pemilihan" name="trip-start"  min="2022-11-10" max="2025-12-31">' +
      '<input type="text" onfocus="(this.type=`date`)" style="width:15em"  class="swal2-input time-input" placeholder="Waktu Pelakanaan" id="pelaksanaan" name="trip-start"  min="2022-11-10" max="2025-12-31">' +
      '<input type="text" onfocus="(this.type=`date`)" style="width:15em" class="swal2-input time-input" placeholder="Waktu Pemanfaatan" id="pemanfaatan" name="trip-start"  min="2018-11-10" max="2025-12-31">' +
      '<input id="pdn" type="text" class="swal2-input" style="width:15em" onfocus="(this.type=`number`)"  placeholder="PDN %">',
    focusConfirm: false,
    preConfirm: () => {

      CreateDetailPagu(api_url_tender, anggaran)
      // Swal.fire('Saved!', '', 'success')
      refreshTotal()
      //paguCreate();
    }
  })
}







function detailTotalTenderDetailCepatSeleksi(id) {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api + 'api/langsung/totalseleksitender/' + id)

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_total_tender_detail+'/'+id)
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(objects.data.data)

          i = i + 1;
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['tender'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['totalpagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          // trHTML += '<td>' + object['totalpagu'] + '</td>';
          trHTML += '<td>' + object['total'] + '</td>';

          trHTML += "</tr>";
        }
        document.getElementById("tendercepatseleksi").innerHTML = trHTML;
      }
    }
  };

}

function detailTotalTenderDetail(id) {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_total_tender_detail + '/' + id)

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_total_tender_detail+'/'+id)
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      var namePengadaan = ''
      const objects = JSON.parse(this.responseText);
      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(object.tipe)
          totalpguall = object['tipe'] == 'swakelola' ? '-' : object['total']
          if (object.tipe == 'kecuali') {
            namePengadaan = 'Pengadaan di kecualikan'
          }
          else if (object.tipe == 'plangsung') {
            namePengadaan = 'Penunjukan Langsung'
          }
          else {
            namePengadaan = object.tipe
          }

          i = i + 1;
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + namePengadaan + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['totalpagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          //trHTML += '<td>' + object['totalpagu'] + '</td>';
          trHTML += '<td>' + totalpguall + '</td>';

          trHTML += "</tr>";
        }
        document.getElementById("totalpengadaan").innerHTML = trHTML;
      }
    }
  };

}


function detailTotalTenderDetailReport(id) {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_total_tender_detail + '/' + id)

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_total_tender_detail+'/'+id)
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      var namePengadaan = ''
      const objects = JSON.parse(this.responseText);

      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(object.tipe)
          if (object.tipe == 'kecuali') {
            namePengadaan = 'Pengadaan di kecualikan'
          }
          else if (object.tipe == 'plangsung') {
            namePengadaan = 'Penunjukan Langsung'
          }
          else {
            namePengadaan = object.tipe
          }

          i = i + 1;

          // trHTML += '<tr>';
          trHTML += '<td class="bg-td">' + namePengadaan + '</td>';
          //trHTML += '<td>' + object['total'] + '</td>';
          //trHTML += "</tr>";


          // 

        }

        document.getElementById("reporttender").innerHTML = trHTML;
      }
    }
  };

}

function detailTotalTenderDetailReportJumlah(id) {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_total_tender_detail + '/' + id)

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_total_tender_detail+'/'+id)
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      var namePengadaan = ''
      const objects = JSON.parse(this.responseText);

      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(object.tipe)
          if (object.tipe == 'kecuali') {
            namePengadaan = 'Pengadaan di kecualikan'
          }
          else if (object.tipe == 'plangsung') {
            namePengadaan = 'Penunjukan Langsung'
          }
          else {
            namePengadaan = object.tipe
          }

          i = i + 1;

          // trHTML += '<tr>';
          //trHTML += '<td>' + namePengadaan + '</td>';
          trHTML += '<td>' + object['total'] + '</td>';
          //trHTML += "</tr>";


          // 

        }

        document.getElementById("reporttenderjumlah").innerHTML = trHTML;
      }
    }
  };

}
function detailTotalTenderDetailReportJumlahPagu(id) {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_total_tender_detail + '/' + id)

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_total_tender_detail+'/'+id)
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      var namePengadaan = ''
      const objects = JSON.parse(this.responseText);

      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(object.tipe)
          if (object.tipe == 'kecuali') {
            namePengadaan = 'Pengadaan di kecualikan'
          }
          else if (object.tipe == 'plangsung') {
            namePengadaan = 'Penunjukan Langsung'
          }
          else {
            namePengadaan = object.tipe
          }

          i = i + 1;

          // trHTML += '<tr>';
          //trHTML += '<td>' + namePengadaan + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['totalpagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          //trHTML += "</tr>";


          // 

        }

        document.getElementById("reporttenderpagu").innerHTML = trHTML;
      }
    }
  };

}


function detailTotalTenderDetailReportSeleksiJumlah(id) {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api + 'api/langsung/totalseleksitender/' + id)

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_total_tender_detail+'/'+id)
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      //var namePengadaan = ''
      const objects = JSON.parse(this.responseText);

      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i = i + 1;
          trHTML += '<td>' + object['total'] + '</td>';


        }

        document.getElementById("reporttenderseleksijumlah").innerHTML = trHTML;
      }
    }
  };

}


function detailTotalTenderDetailReportSeleksiRupiah(id) {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api + 'api/langsung/totalseleksitender/' + id)

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_total_tender_detail+'/'+id)
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      //var namePengadaan = ''
      const objects = JSON.parse(this.responseText);

      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(object.tipe)


          i = i + 1;
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['totalpagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';

        }

        document.getElementById("jumlahrupiahcepat").innerHTML = trHTML;
      }
    }
  };

}

function refreshTotal() {
  //console.log("refresh di eksekusi")
  detailTotalTenderDetail(id_global)
  //getvals(id_global)
  detailTotalTenderDetailCepatSeleksi(id_global)
  detailTotalTenderDetailReport(id_global)
  detailTotalTenderDetailReportJumlah(id_global)
  detailTotalTenderDetailReportJumlahPagu(id_global)
  //detailTotalTenderDetailReportSeleksi(id_global)
  detailTotalTenderDetailReportSeleksiJumlah(id_global)
  detailTotalTenderDetailReportSeleksiRupiah(id_global)
  //totalPdn(id_global)
  //totalPdnTender(id_global)
  //infoTotalDn()
  //skpdName(id)

}

const uploudData = () => {
  document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    /*  const fileSize = input.files[0].size / 1024 / 1024; // in MiB
  if (fileSize > 2) {
    alert('File size exceeds 2 MiB');
    // $(file).val(''); //for clearing with Jquery
  } else {
    // Proceed further
  }*/
    const userFile = document.getElementById('file').files[0]
    const fileSize = userFile.size / 1024 / 1024
    //console.log(userFile)
    const formData = new FormData();
    //console.log("data Use", userFile)
    console.log(fileSize)
    if (userFile == null || fileSize > 2) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Please Uploud File First</a>'
      })
    }

    else {
      formData.append('file', userFile);
      formData.append('paguorp', Namepaguorp)
      formData.append('paguopdp', Namepaguskpd)
      formData.append('name', namaSKPD)
      formData.append('idpagu', id_global)
      fetch(api + 'api/pagus/edit/' + id_global, {
        method: "PUT",
        body: formData,
      }).then(res => res.json())
        .then(data => detaiDownload(id_global)).then()
        .catch(err => console.log(err))
      loadingswal()

    }
    //loadingswal()

  })


}

const removeDownload = () => {

  const xhttp = new XMLHttpRequest();

  xhttp.open("PUT", api_url + "/" + id_global);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  xhttp.send(JSON.stringify({
    "name": namaSKPD, "paguopdp": Namepaguskpd, "paguorp": Namepaguorp, "filetipe": "kosong"
  }));

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      Swal.fire('Saved!', '', 'success')
      detailAnggaran(id_global)
      detailTender(id_global)
      refreshTotal()

    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        footer: '<a href="">Why do I have this issue?</a>'
      })
    }

  };

}

const loadingswal = () => {
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'uploud file success',
    showConfirmButton: false,
    timer: 1500
  })
  showFileDownlod()
}

const showFileDownlod = () => {
  var downloaddata = document.getElementsByClassName('download-data');

  for (var i = 0; i < downloaddata.length; i++) {
    downloaddata[i].style.display = 'flex';
  }

}



function detaiDownload(id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url + '/' + id);
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);

      const posts = objects.data.data

      //console.log(linkdownload)
      id_global = posts.id
      let link_data = posts['filetipe'] == "_" ? '<div>File Not Found</div>' : '<a href="' + api + "docs/" + posts['filetipe'] + '"  target="_blank" class="link-download">' + '<i class="bx bx-download bx-sm bx-tada-hover" style="color:teal;"> </i>' + posts['filetipe'] + '</p>' + '</a>'
      var trHTML = '';
      trHTML += '<div class="download-data">';
      trHTML += link_data;
      trHTML += '<a href="javascript:void(0)" onclick="hidengFileDownlod()"><i class="bx bx-x bx-md bx-tada-hover" style="color:red;"></i></a>'
      trHTML += '</div>'


      document.getElementById("listdownload").innerHTML = trHTML;
      //detaiDownload()
    }
  };

}

const hidengFileDownlod = () => {
  var downloaddata = document.getElementsByClassName('download-data');

  for (var i = 0; i < downloaddata.length; i++) {
    downloaddata[i].style.display = 'none';
  }

}


const alertNodownload = () => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong!',
    footer: '<a href="">You havent uploaded the file?</a>'
  })
}



//reportdata

const hiddenAction = () => {

  var printviewinputbox = document.getElementById("printviewinputbox")
  var inputbox = document.getElementById("inputbox")
  var reporttoexcel = document.getElementById("reporttoexcel")
  var inputboxprint = document.getElementById("inputboxprint")
  inputbox.style.display = "none"
  printviewinputbox.style.display = "block"
  inputboxprint.style.display = "flex"
  reporttoexcel.style.display = "none"
  detailReportAnggaran(id_global)
  reportPenunjukaLangsungby(id_global)
  //ExportToExcel('xlsx')
}

const detailReportAnggaran = (id) => {
  //const embkono = ["silver", "larougm"]
  //console.log(getvals)
  //var dataob = ''
  getvals(id).then(response =>
    calculatePdntwo(response, id)
  );
  detailTenderLaporan(id_global)
  reportPengadaanLangsung(id_global)
  reportPurchasingLangsung(id_global)
  laporandetailPengecualian(id_global)
  laporanSwakeola(id_global)
}

const calculatePdntwo = (objectdata, id) => {
  if (objectdata.data.data == null) {
    console.log(" data data null")
  }
  else {
    console.log(objectdata)
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api_url_anggaran + '/pagu/' + id);

    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.setRequestHeader("token", localStorage.getItem('token'));
    xhttp.send();
    //dataPdnPenmpungTemp = embkono
    let objects = ''
    let pdnavg = ''
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var trHTML = '';
        objects = JSON.parse(this.responseText);


        if (objects.data.data === null) {
          console.log('data kosong')
        }
        else {
          let i = 0;
          let j = 0
          for (let object of objects.data.data) {
            let id_obj = object['id']
            i++;
            // console.log(objectdata.data.data[j].totalpagu)
            //pdnavg = object['name'] == objectdata.data.data[j].name ? objectdata.data.data[j].pdn : 'Nan'
            //if(army.indexOf("Marcos") !== -1) 
            if (objectdata.data.data[j] == undefined) {
              //console.log('data undifined')
              pdnavg = 'Nan'
            }
            else {
              //pdnavg = object['name'] == objectdata.data.data[j].name ? objectdata.data.data[j].pdn : 'Nan'
              //console.log(pdnavg)
              console.log(pdnavg)
              pdnavg = objectdata.data.data[j].pdn
            }
            trHTML += '<tr>';
            trHTML += '<td>' + i + '</td>';
            trHTML += '<td>' + object['name'] + '</td>';
            trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
              style: 'currency',
              currency: 'IDR'
            }).format(object['pagu'])
              .replace(/[IDR]/gi, '')
              .replace(/(\.+\d{2})/, '')
              .trimLeft() + '</td>';
            trHTML += '<td>' + pdnavg + '</td>';
            trHTML += "</tr>";
            j++;
          }
        }
        //console.log("data onject", objects)

        document.getElementById("anggaranlaporan").innerHTML = trHTML;

      }
    };
  }
}

const detailTenderLaporan = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/default')

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  xhttp.send();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        //console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          //console.log(mydate.toDateString().replace(/^\S+\s/,''));
          trHTML += '<td>' + new Date(object['pemilihan']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + new Date(object['pelaksanaan']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + new Date(object['jadwal']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + object['tender'] + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';
          trHTML += "</tr>";
        }
      }

      document.getElementById("tenderlaporan").innerHTML = trHTML;

    }
  };

}

const reportPengadaanLangsung = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/langsung')

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_langsung+ '/pagu/'+id);
  xhttp.send();
  //console.log("anggaran di eksekusi", id)

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++

          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + new Date(object['pelaksanaan']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';

          trHTML += "</tr>";
        }
      }

      document.getElementById("pengadaanlangsungreport").innerHTML = trHTML;

    }
  };

}

const reportPenunjukaLangsungby = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/plangsung')
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_langsung+ '/pagu/'+id);
  xhttp.send();
  //console.log("anggaran di eksekusi", id)

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++

          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + new Date(object['pelaksanaan']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';

          trHTML += "</tr>";
        }
      }

      document.getElementById("reportpenunjukanlangsung").innerHTML = trHTML;

    }
  };

}

const reportPurchasingLangsung = (id) => {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/purchasing')
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_langsung+ '/pagu/'+id);
  xhttp.send();
  //console.log("anggaran di eksekusi", id)

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++

          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + new Date(object['pelaksanaan']).toDateString().replace(/^\S+\s/, '') + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';

          trHTML += "</tr>";
        }
      }

      document.getElementById("reportpurchasing").innerHTML = trHTML;

    }
  };

}
const laporandetailPengecualian = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/kecuali')
  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_langsung+ '/pagu/'+id);
  xhttp.send();
  //console.log("anggaran di eksekusi", id)

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++

          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + object['pelaksanaan'] + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';

          trHTML += "</tr>";
        }
      }

      document.getElementById("laporandikecualikan").innerHTML = trHTML;

    }
  };

}

const laporanSwakeola = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/swakelola')

  xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("token", localStorage.getItem('token'));
  //xhttp.open("GET", api_url_langsung+ '/pagu/'+id);
  xhttp.send();
  //console.log("anggaran di eksekusi", id)

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++

          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</td>';
          trHTML += '<td>' + object['ket'] + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';

          trHTML += "</tr>";
        }
      }

      document.getElementById("laporanswakelola").innerHTML = trHTML;

    }
  };

}
const logout = () => {
  localStorage.clear();
  window.location.href = './login.html'
}


