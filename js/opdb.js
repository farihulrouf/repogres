

const api = "http://localhost:3000/"
const api_url = api + "api/pagus";
const api_url_anggaran = api + "api/anggaran";
const api_url_tender = api + "api/tender"
const api_url_langsung = api + "api/langsung"
const api_url_pengecualian = api + "api/kecuali"
const api_url_total_tender_detail = api + "api/langsung/totalsemua"
const api_url_total_paket = api + "api/tender/totalpaket"

var id_global = '';
var subKegiatanGlobal = ''
let subKegiatanGlobalAll = {}
let subKegiatan = [];
let namaSKPD = ''
function loadTable() {

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      let i = 0
      const objects = JSON.parse(this.responseText);
      for (let object of objects.data.data) {
        let id_obj = object['id']
        i++
        trHTML += '<tr>';
        trHTML += '<td>' + i + '</td>';
        trHTML += '<td>' + object['name'] + '</td>';
        trHTML += '<td>' +'Rp'+ ' ' +  new Intl.NumberFormat('en-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(object['paguopdp']).replace(/[IDR]/gi, '')
        .replace(/(\.+\d{2})/, '')
        .trimLeft() + '</td>';
        trHTML += '<td>' +'Rp' +' ' + new Intl.NumberFormat('en-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(object['paguorp']).replace(/[IDR]/gi, '')
        .replace(/(\.+\d{2})/, '')
        .trimLeft() + '</td>';
        trHTML += '<td class="td-icon"><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\'' + id_obj + '\')">edit </span></a>';
        trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailPage(\'' + id_obj + '\')">visibility </span></a>';
        trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="paguDelete(\'' + id_obj + '\')">delete_forever</span></a></td>';

        trHTML += "</tr>";
      }
      document.getElementById("mytable").innerHTML = trHTML;
      //console.log(subKegiatan)

    }
  };
}

loadTable();
//detailTotalTenderDetail(id_global)

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
  xhttp.onreadystatechange = function () {
    loadTable();

  };
}

function showUserCreateBox() {
  Swal.fire({
    title: 'Create Pagu',
    html:
      '<input id="id" type="hidden">' +
      '<input id="name" class="swal2-input" placeholder="Nama SKPD">' +
      '<input id="paguopd" class="swal2-input" placeholder="Pagu SKPD">' +
      '<input id="paguorp" class="swal2-input" placeholder="Pagu RUP">',
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
      html:
        '<input id="id" type="hidden">' +
        '<input id="name" class="swal2-input" placeholder="Sub Kegiatan">' +
        '<input id="pagu" class="swal2-input" placeholder="Jumlah">',
      focusConfirm: false,
      preConfirm: () => {
        //console.log('diseksuusi engaran')
        CreateAnggaran(api_url_anggaran, header_title)
        detailGolbalAnggaran(id_global)
      }
    })
  }
  else if (header_title == "tender") {

    const options = {};
    //console.log("isi dari sub kegitan", subKegiatan)
    //console.log("isi dari sub global", subKegiatanGlobal)
    subKegiatan.forEach(element => {
      options[element] = element;
    });

    Swal.fire({
      title: 'Pengadaan'+' '+'Tender',
      input: 'select',
      inputAttributes: {
        id: "subkegiatan",
        class: "swal2-input",
      },
      inputPlaceholder: 'Sub Kegiatan',
      inputOptions: options,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          resolve()
          subKegiatanGlobal = value
          //console.log("isi dari sub",subKegiatanGlobal)
        })
      },

      html:
        '<div class="contain-popup">' +
        '<input id="id" type="hidden">' +
        '<input id="paket" class="swal2-input"  placeholder="Nama Paket">' +
        '<input id="pagu" class="swal2-input"  onfocus="(this.type=`number`)" placeholder="Pagu">' +
        '<select class="swal2-input time-input" id="input-select"> <option value="">Jenis Tender</option><option value="Cepat">Cepat</option><option value="Seleksi">Seleksi</option><option value="Tender cepat">Tender Cepat</option></select>' +
        '<input type="text" onfocus="(this.type=`date`)" placeholder="Waktu Pemilihan" class="swal2-input time-input" id="pemilihan" name="trip-start"  min="2022-11-10" max="2025-12-31">' +
        '<input type="text" onfocus="(this.type=`date`)"  class="swal2-input time-input" placeholder="Waktu Pelakanaan" id="pelaksanaan" name="trip-start"  min="2022-11-10" max="2025-12-31">' +
        '<input type="text" onfocus="(this.type=`date`)"  class="swal2-input time-input" placeholder="Waktu Pemanfaatan" id="pemanfaatan" name="trip-start"  min="2018-11-10" max="2025-12-31">' +
        '<input id="pdn" type="text" class="swal2-input" onfocus="(this.type=`number`)"  placeholder="PDN %">' +
        '</div>',
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {

        CreateDetailPagu(api_url_tender, header_title)
        refreshTotal()

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
      input: 'select',
      inputAttributes: {
        id: "subkegiatan",
        class: "swal2-input",
      },
      inputPlaceholder: 'Sub Kegiatan',
      inputOptions: options,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          resolve()
          subKegiatanGlobal = value
          //console.log(subKegiatanGlobal)
        })
      },
      html:
        '<input id="id" type="hidden">' +
        '<input id="pagu" class="swal2-input" onfocus="(this.type=`number`)" placeholder="Pagu">' +
        '<input id="keterangan" class="swal2-input"  placeholder="Keterangan">' +
        '<input id="pdn" class="swal2-input" placeholder="PDN %">',

      focusConfirm: false,
      preConfirm: () => {
        CreateSwakelola(api_url_langsung, header_title)

      }
    })
  }
  else {
    const options = {};

    subKegiatan.forEach(element => {
      options[element] = element;
    });


    Swal.fire({
      title: anggaran,
      input: 'select',
      inputAttributes: {
        id: "subkegiatan",
        class: "swal2-input",
      },
      inputPlaceholder: 'Sub Kegiatan',
      inputOptions: options,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          resolve()
          subKegiatanGlobal = value
          //console.log(subKegiatanGlobal)
        })
      },
      html:
        '<input id="id" type="hidden">' +
        '<input id="paket" class="swal2-input"  placeholder="Nama Paket">' +
        '<input id="pagu" class="swal2-input"  placeholder="Pagu">' +
        '<input type="text" onfocus="(this.type=`date`)" placeholder="Waktu Pelaksanaan" class="swal2-input" id="pelaksanaan" name="trip-start"  min="2022-11-10" max="2025-12-31">' +
        '<input id="pdn" class="swal2-input" placeholder="PDN %">',

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
  //console.log("isi dari name", name, "dan isi dari pagu", pagu)
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", api_param);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "name": name,
    "paket": "000",
    "pagu": parseInt(pagu),
    "jadwal": "12-12-2022",
    "pdn": parseInt(20),
    "idpagu": id_global
  }));

  xhttp.onreadystatechange = function () {
    //detailTender(id_global)
    detailAnggaran(id_global)
  };

}

function CreateDetailPagu(api_param, header_title) {
  
  var selecinput = document.getElementById("input-select").value;
  
  const waktupemilihan = document.getElementById("pemilihan").value;
  const waktupelaksanaan = document.getElementById("pelaksanaan").value;
  const waktupemanfaatan = document.getElementById("pemanfaatan").value;
  const pdn = document.getElementById("pdn").value;
  const paket = document.getElementById("paket").value;
  const pagu = document.getElementById("pagu").value;
  
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", api_param);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "name": subKegiatanGlobal,
    "paket": paket,
    "pagu": parseInt(pagu),
    "jadwal": waktupemanfaatan,
    "pemilihan": waktupemilihan,
    "pelaksanaan": waktupelaksanaan,
    "pdn": parseInt(pdn),
    "ket": selecinput,
    "idpagu": id_global
  }));

  xhttp.onreadystatechange = function () {
    detailTender(id_global)
  };
  


}

function CreateSwakelola(api_param, header_title) {

  const pdn = document.getElementById("pdn").value;
  const pagu = document.getElementById("pagu").value;
  const keterangan = document.getElementById("keterangan").value
  console.log(keterangan)
  console.log("ini hereader", header_title)
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", api_param);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "name": subKegiatanGlobal,
    "paket": "default",
    "pagu": parseInt(pagu),
    "tipe": header_title,
    "jadwal": "12-12-2022",
    "ket": keterangan,
    "pdn": parseInt(pdn),
    "idpagu": id_global
  }));

  

  xhttp.onreadystatechange = function () {
    detailLangsung(id_global)
    detailPenunjukanLangsug(id_global)
    detailPurchasing(id_global)
    detailPengecualian(id_global)
    detailSwakelola(id_global)
  };

}

function CreateDetailLain(api_param, header_title) {

  const waktupemanfaatan = document.getElementById("pelaksanaan").value;
  const pdn = document.getElementById("pdn").value;
  const paket = document.getElementById("paket").value;
  const pagu = document.getElementById("pagu").value;

  console.log("ini hereader", header_title)
  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", api_param);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "name": subKegiatanGlobal,
    "paket": paket,
    "pagu": parseInt(pagu),
    "tipe": header_title,
    "jadwal": waktupemanfaatan,
    "pdn": parseInt(pdn),
    "ket": "ket",
    "idpagu": id_global
  }));

  xhttp.onreadystatechange = function () {
    detailLangsung(id_global)
    detailPenunjukanLangsug(id_global)
    detailPurchasing(id_global)
    detailPengecualian(id_global)
    refreshTotal()
  };

}


function paguDelete(id) {

  console.log("data coba delete id", id)

  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", api + "api/pagus/" + id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "id": id
  }));
  xhttp.onreadystatechange = function () {
    loadTable();

  };

}
function detailDelete(id, tender, api) {
  //console.log("data coba delete id", tender)
  let typedelete = ''
  console.log("informasi api", api)
  console.log(api)
  const xhttp = new XMLHttpRequest();
  xhttp.open("DELETE", api + "/" + id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "id": id
  }));
  xhttp.onreadystatechange = function () {
    detailAnggaran(id_global)
    detailTender(id_global)
    detailLangsung(id_global)
    detailPengecualian(id_global)
    detailSwakelola(id_global)
    detailPurchasing(id_global)
    detailGolbalAnggaran(id_global)
    refreshTotal()

  };
}
function detailPage(id) {
  var x = document.getElementById("detail");
  var y = document.getElementById("opdb")
  y.style.display = "none";
  x.style.display = "block";
  id_global = id;
  detailGolbalAnggaran(id)
  detailPaguItem(id)
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
  detailTotalTenderDetailReportSeleksi(id)
  detailTotalTenderDetailReportSeleksiJumlah(id)
  detailTotalTenderDetailReportSeleksiRupiah(id)
  skpdName(id)

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


function detailAnggaran(id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_anggaran + '/pagu/' + id);
  xhttp.send();
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
          i++;
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' +'Rp' +' '+  new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
          .replace(/[IDR]/gi, '')
          .replace(/(\.+\d{2})/, '')
          .trimLeft() + '</td>';
          trHTML += '<td>' + 'Nan' + '</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\'' + id_obj + '\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\'' + id_obj + '\',`anggaran`,\'' + api_url_anggaran + '\')">delete_forever</span></a></td>';

          trHTML += "</tr>";
        }
      }

      document.getElementById("anggaran").innerHTML = trHTML;

    }
  };
}

function detailGolbalAnggaran(id_global) {
  //console.log("di ekseusi")
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_anggaran);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          subKegiatan.push(objects.data.data[i].name)
          //console.log(subKegiatan)

          i++;
          trHTML += '<tr>';
          trHTML += '<td>' + 1 + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['pagu'] + '</td>';
          trHTML += '<td>' + object['pagu'] + '</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\'' + id_obj + '\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\'' + id_obj + '\',`anggaran`,\'' + api_url_anggaran + '\')">delete_forever</span></a></td>';

          trHTML += "</tr>";

        }
      }

      document.getElementById("anggaran").innerHTML = trHTML;

    }
  };
}

function detailPaguItem(id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url + '/' + id);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);

      const posts = objects.data.data
      //console.log(posts.name)
      namaSKPD = posts.name
      //console.log(namaSKPD)
      // i++;
      var trHTML = '';
      trHTML += '<div class="detail-info-pagu">';
      trHTML += '<div class="info-text-detail-pagu">' + '<p>' + `Nama SKPD :` + '</p>' + '<p class="name-text-detail-pagu">' + posts['name'] + '</p>' + '</div>';
      trHTML += '<div class="info-text-detail-pagu">' + '<p>' + `Jumlah Pagu OPD :` + '</p>' + '<p class="name-text-detail-pagu">' +'Rp' +' '+ new Intl.NumberFormat('en-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(posts['paguopdp']).replace(/[IDR]/gi, '')
      .replace(/(\.+\d{2})/, '')
      .trimLeft() + '</p>' + '</div>';
      trHTML += '<div class="info-text-detail-pagu">' + '<p>' + `Jumlah Pagu ORP :` + '</p>' + '<p class="name-text-detail-pagu">' +'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(posts['paguorp']).replace(/[IDR]/gi, '')
      .replace(/(\.+\d{2})/, '')
      .trimLeft() + '</p>' + '</div>';
      trHTML += "</div";

      document.getElementById("detailinformasi").innerHTML = trHTML;
    }
  };
  //console.log("ceka",namaSKPD)
}

function detailTender(id) {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_tender + '/pagu/' + id)
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);

      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++;
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' +'Rp'+ ' '+  new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
          .replace(/[IDR]/gi, '')
          .replace(/(\.+\d{2})/, '')
          .trimLeft() + '</td>';
          trHTML += '<td>' + object['pemilihan'] + '</td>';
          trHTML += '<td>' + object['pelaksanaan'] + '</td>';
          trHTML += '<td>' + object['jadwal'] + '</td>';
          trHTML += '<td>' + object['ket'] + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\'' + id_obj + '\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\'' + id_obj + '\',`tender`,\'' + api_url_tender + '\')">delete_forever</span></a></td>';

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
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_langsung + '/pagu/' + id)
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i = i + 1;
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' +'Rp' +' '+ new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
          .replace(/[IDR]/gi, '')
          .replace(/(\.+\d{2})/, '')
          .trimLeft() + '</td>';
          trHTML += '<td>' + object['jadwal'] + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\'' + id_obj + '\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\'' + id_obj + '\', `langsung`,\'' + api_url_langsung + '\')">delete_forever</span></a></td>';

          trHTML += "</tr>";
        }
        document.getElementById("langsung").innerHTML = trHTML;
      }
    }
  };

}

const detailPenunjukanLangsug = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/plangsung')
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i = i + 1
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' +'Rp'  +' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'] )
          .replace(/[IDR]/gi, '')
          .replace(/(\.+\d{2})/, '')
          .trimLeft() + '</td>';
          trHTML += '<td>' + object['jadwal'] + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\'' + id_obj + '\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\'' + id_obj + '\', `kecuali`,\'' + api_url_pengecualian + '\')">delete_forever</span></a></td>';

          trHTML += "</tr>";
        }
        document.getElementById("pllangsung").innerHTML = trHTML;
      }
      else {
        console.log('data detail langsug kosong')
      }

    }
  };
}

const detailPurchasing = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/purchasing')
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++;
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' + 'Rp' +' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
          .replace(/[IDR]/gi, '')
          .replace(/(\.+\d{2})/, '')
          .trimLeft() + '</td>';
          trHTML += '<td>' + object['jadwal'] + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\'' + id_obj + '\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\'' + id_obj + '\', `langsung`,\'' + api_url_langsung + '\')">delete_forever</span></a></td>';

          trHTML += "</tr>";
        }
        document.getElementById("purchasing").innerHTML = trHTML;
      }

    }
  };
}

const detailPengecualian = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/kecuali')
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data != null) {
        let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + object['paket'] + '</td>';
          trHTML += '<td>' +'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
          .replace(/[IDR]/gi, '')
          .replace(/(\.+\d{2})/, '')
          .trimLeft() + '</td>';
          trHTML += '<td>' + object['jadwal'] + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\'' + id_obj + '\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\'' + id_obj + '\', `langsung`,\'' + api_url_langsung + '\')">delete_forever</span></a></td>';

          trHTML += "</tr>";
        }
        document.getElementById("kecuali").innerHTML = trHTML;
      }

    }
  };
}
const detailSwakelola = (id) => {
  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_langsung + '/pagu/' + id + '/swakelola')
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      const objects = JSON.parse(this.responseText);
      if (objects.data.data != null) {
        let i = 0;
        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++
          //console.log(id_obj)
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' +'Rp' +' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['pagu'])
          .replace(/[IDR]/gi, '')
          .replace(/(\.+\d{2})/, '')
          .trimLeft() + '</td>';
          trHTML += '<td>' + object['ket'] + '</td>';
          trHTML += '<td>' + object['pdn'] + '</td>';
          trHTML += '<td><a href="#"><span class="material-symbols-outlined" onclick="showUserEditBox(\'' + id_obj + '\')">edit </span></a>';
          trHTML += '<a href="#"><span class="material-symbols-outlined" onclick="detailDelete(\'' + id_obj + '\', `langsung`,\'' + api_url_langsung + '\')">delete_forever</span></a></td>';

          trHTML += "</tr>";
        }
        document.getElementById("swakelola").innerHTML = trHTML;
      }

    }
  };
}



function showUserEditBox(id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url + '/' + id);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);
      const posts = objects.data.data
      Swal.fire({
        title: 'Edit Pagu',
        html:
          '<input id="id" type="hidden" value=' + posts['id'] + '>' +
          '<input id="name" class="swal2-input" placeholder="Nama Odp" value="' + posts['name'] + '">' +
          '<input id="paguopd" class="swal2-input" placeholder="Pagu Odp" value="' + posts['paguopdp'] + '">' +
          '<input id="paguorp" class="swal2-input" placeholder="Pagu Orp" value="' + posts['paguorp'] + '">',
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
  xhttp.open("PUT", api_url + "/" + id);
  xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhttp.send(JSON.stringify({
    "name": name, "paguopdp": paguopd, "paguorp": paguorp
  }));
  xhttp.onreadystatechange = function () {
    loadTable();

  };
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

function hiddenAction(){
  //td-icon
  var x = document.getElementById("td-iconx")
  console.log(x)
  x.style.display = "none";
  console.log("di eksekusi")
}

function detailTotalTenderDetailCepatSeleksi(id) {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_total_paket + '/' + id)
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
          i = i + 1;
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['ket'] + '</td>';
          trHTML += '<td>' + object['totalpagu'] + '</td>';
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
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + namePengadaan + '</td>';
          trHTML += '<td>' + object['totalpagu'] + '</td>';
          trHTML += '<td>' + object['total'] + '</td>';

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
          trHTML += '<td>' + namePengadaan + '</td>';
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
          trHTML += '<td>' + object['totalpagu'] + '</td>';
          //trHTML += "</tr>";


          // 

        }

        document.getElementById("reporttenderpagu").innerHTML = trHTML;
      }
    }
  };

}

function detailTotalTenderDetailReportSeleksi(id) {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_total_paket + '/' + id)
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

          // trHTML += '<tr>';
          trHTML += '<td>' + object['ket'] + '</td>';
          //trHTML += '<td>' + object['total'] + '</td>';
          //trHTML += "</tr>";


          // 

        }

        document.getElementById("reporttenderseleksi").innerHTML = trHTML;
      }
    }
  };

}
function detailTotalTenderDetailReportSeleksiJumlah(id) {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_total_paket + '/' + id)
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

          // trHTML += '<tr>';
          trHTML += '<td>' + object['total'] + '</td>';
          //trHTML += '<td>' + object['total'] + '</td>';
          //trHTML += "</tr>";


          // 

        }

        document.getElementById("reporttenderseleksijumlah").innerHTML = trHTML;
      }
    }
  };

}


function detailTotalTenderDetailReportSeleksiRupiah(id) {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_total_paket + '/' + id)
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

          // trHTML += '<tr>';
          trHTML += '<td>' + object['totalpagu'] + '</td>';
          //trHTML += '<td>' + object['total'] + '</td>';
          //trHTML += "</tr>";


          // 

        }

        document.getElementById("jumlahrupiahcepat").innerHTML = trHTML;
      }
    }
  };

}

function skpdName(id) {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url + '/' + id);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      const objects = JSON.parse(this.responseText);

      const posts = objects.data.data
      //console.log(posts.name)
      namaSKPD = posts.name
      //console.log(namaSKPD)
      // i++;
      var trHTML = '';
      trHTML += '<tr>';
      trHTML += '<td>' + posts['name'] + '</td>';
      trHTML += "</tr";

      document.getElementById("skpdname").innerHTML = trHTML;
    }
  };
  //console.log("ceka",namaSKPD)
}

function refreshTotal(){
  console.log("refresh di eksekusi")
  detailTotalTenderDetail(id_global)
  detailTotalTenderDetailCepatSeleksi(id_global)
  detailTotalTenderDetailReport(id_global)
  detailTotalTenderDetailReportJumlah(id_global)
  detailTotalTenderDetailReportJumlahPagu(id_global)
  detailTotalTenderDetailReportSeleksi(id_global)
  detailTotalTenderDetailReportSeleksiJumlah(id_global)
  detailTotalTenderDetailReportSeleksiRupiah(id_global)
  //skpdName(id)

}


