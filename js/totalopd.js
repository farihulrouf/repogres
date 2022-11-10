const apitotal = "http://localhost:3000/api/jumlahtotal"
const apialltotal = 'http://localhost:3000/api/jumlahtender'
function detailTotalTenderDetailCepatSeleksiAll() {
    //console.log("lihat id",id)
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", apitotal)
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
                    trHTML += '<td>' + object['tipe'] + '</td>';
                    trHTML += '<td>' + object['totalpagu'] + '</td>';
                    trHTML += '<td>' + object['total'] + '</td>';

                    trHTML += "</tr>";
                }
                document.getElementById("allreportseleksi").innerHTML = trHTML;
            }
        }
    };

}

function detailTotalTenderDetailCepatSeleksi() {
    //console.log("lihat id",id)
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", apialltotal)
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
                document.getElementById("allcepatseleksi").innerHTML = trHTML;
            }
        }
    };

}

function detailTotalTenderDetailCepatSeleksi() {
    //console.log("lihat id",id)
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", apialltotal)
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
                document.getElementById("allcepatseleksi").innerHTML = trHTML;
            }
        }
    };

}
detailTotalTenderDetailCepatSeleksi()
detailTotalTenderDetailCepatSeleksiAll()
