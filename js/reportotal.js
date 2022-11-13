

const apiglobal = "http://localhost:3000/"
const api_url_pagu = apiglobal + "api/pagus";
const api_url_total = apiglobal + "api/langsung/totalsemua/"
const api_url_cepat_tender_seleksi = apiglobal + "api/tender/totalpaket"
function loadDataTotal() {

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_pagu);
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      let i = 0
      const objects = JSON.parse(this.responseText);
      for (let object of objects.data.data) {
        let id_obj = object['id']

        trHTML += '<div>'
        trHTML += '<a class="bg-detail-report" href="javascript:void(0)" onclick="clickDetailReportTotal(\'' + id_obj + '\',`anggaran`,\'' + i + '\')">' + object['name'] + '</a>';
        trHTML += '<div class="report-style" id="tenderlangsungpurchasing' + i + '">' + '' + '</div>';
        trHTML += '<div class="report-style" id="tendercepatseleksireport' + i + '">' + '' + '</div>';
        trHTML += "</div>";
        i++;
      }
      document.getElementById("totalseluruhcoolapse").innerHTML = trHTML;

    }
  };
}
const clickDetailReportTotal = (id, anggaran, index) => {
  //console.log("cek id", id)
  //console.log("cek", anggaran)
  // console.log("cek param", 'silver'+index)
  detailLaporanOpd(id, index, 'tenderlangsungpurchasing' + index)
  detailLaporanCepatSeleksi(id, index, 'tendercepatseleksireport' + index)
}
loadDataTotal()


const detailLaporanOpd = (id, index, idclass) => {
  console.log(id)
  console.log(index)
  console.log("idclass", idclass)

  const xhttp = new XMLHttpRequest();

  xhttp.open("GET", api_url_total + id)
  //xhttp.open("GET", api_url_langsung+ '/pagu/'+id);
  xhttp.send();
  console.log("anggaran di eksekusi", id)

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
          //console.log(objects.data.data[i].tipe)
          trHTML += '<div class="report-style-tr">';
          titlepengadaan = object['tipe'] == 'swakelola' ? 'Swakelola' : object['tipe'] == 'plangsung' ? "Penunjukan Langsung" : object['tipe'] == 'kecuali' ? "Pengadaaan Di kecualikan" : object['tipe'] == 'langsung' ? "Pengadaan Langsung" : "E-Purchsing"
          totalpguall = object['tipe'] == 'swakelola' ? '-' : object['totalpagu']
          trHTML += '<p class="border-color-p">' + titlepengadaan + '</p>';
          trHTML += '<p class="border-color-p-center">' + object['total'] + '</p>';
          //trHTML += '<p class="border-color-p">' + totalpguall + '</p>';  
          trHTML += '<p class="border-color-p">' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(totalpguall)
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</p>';
          trHTML += '<br></br>';
          trHTML += '</div>';

        }
      }
      document.getElementById(idclass).innerHTML = trHTML;
    }
  };


}

const detailLaporanCepatSeleksi = (id, index, idclass) => {
  //console.log("lihat id",id)
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api_url_cepat_tender_seleksi + '/' + id)
  //xhttp.open("GET", api_url_total_tender_detail+'/'+id)
  xhttp.send();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var trHTML = '';
      //var namePengadaan = ''
      const objects = JSON.parse(this.responseText);

      if (objects.data.data != null) {
        // let i = 0
        for (let object of objects.data.data) {
          let id_obj = object['id']
          //console.log(object.tipe)


          //i = i + 1;
          trHTML += '<div class="report-style-tr">';
          //titlepengadaan = object['ket'] =='Seleksi' ? 'Swakelola' : object['tipe'] == 'plangsung' ? "Penunjukan Langsung" : object['tipe'] == 'kecuali' ? "Pengadaaan Di kecualikan" : object['tipe']=='langsung' ? "Pengadaan Langsung" : "E-Purchsing"   
          trHTML += '<p class="border-color-p">' + object['ket'] + '</p>';
          trHTML += '<p class="border-color-p-center">' + object['total'] + '</p>';
          trHTML += '<p class="border-color-p">' + 'Rp' + ' ' + new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['totalpagu'])
            .replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft() + '</p>';
          // trHTML += '<p class="border-color-p">' + object['totalpagu'] + '</p>';   
          trHTML += '<br></br>';
          trHTML += '</div>';


          // 

        }

        document.getElementById(idclass).innerHTML = trHTML;
      }
    }
  };

}




const createDivClass = () => {
  /*
  console.log("coba test")
  var idelement= document.getElementById("idelement"); 
  //const element = document.querySelector('div.foo');
  idelement.classList.add('bar');
  console.log(idelement.className);
  */

  const el = document.createElement('div');

  // ✅ Add classes to element
  el.classList.add('bg-yellow', 'text-lg');

  // ✅ Add text content to element
  el.textContent = 'Hello world';

  // ✅ Or set the innerHTML of the element
  // el.innerHTML = `<span>One, two, three</span>`;

  // ✅ add element to DOM
  const box = document.getElementById('idelement');
  box.appendChild(el);
}
