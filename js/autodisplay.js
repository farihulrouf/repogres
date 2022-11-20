const clickDetailReport = () => {
  var reporttoexcel = document.getElementById("reporttoexcel")
  var hideeninpuxbox = document.getElementById("inputbox")
  var idlaporan = document.getElementById("idlaporan")
  var clickreport = document.getElementById("clickreport")
  var printreportid = document.getElementById("printreportid")
  hideeninpuxbox.style.display = "none"
  reporttoexcel.style.display = "none"
  clickreport.style.display = "none"
  printreportid.style.display = "flex"
  idlaporan.style.display = "block"
}

const inputDetailData = () => {

  var hideeninpuxbox = document.getElementById("inputbox")

  var reporttoexcel = document.getElementById("reporttoexcel")
  var idlaporan = document.getElementById("idlaporan")
  var clickreport = document.getElementById("clickreport")
  var printreportid = document.getElementById("printreportid")
  hideeninpuxbox.style.display = "block"
  reporttoexcel.style.display="flex"
  clickreport.style.display = "flex"
  printreportid.style.display = "none"
  idlaporan.style.display = "none"

}

const reportUmum = () => {

  var opdb = document.getElementById("opdb")
  var totalkeseluruhan = document.getElementById("totalkeseluruhan")
  opdb.style.display = "none"
  totalkeseluruhan.style.display = "block"
}
const backToreport = () => {

  var opdb = document.getElementById("opdb")
  var totalkeseluruhan = document.getElementById("totalkeseluruhan")
  opdb.style.display = "block"
  totalkeseluruhan.style.display = "none"

}

const printForm = () => {
  printJS({
    printable: 'printdetaildesk',
    type: 'html',
    targetStyles: ['*'],
    header: ''
  })
}

const printFormTotal = () => {
  printJS({
    printable: 'totalprint',
    type: 'html',
    targetStyles: ['*'],
    header: ''
  })
}

const ExportToExcel = (type, fn, dl) => {



  var elt = document.getElementById('inputbox');
  
  var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
  
  return dl ?
    XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
    XLSX.writeFile(wb, fn || ('MySheetName.' + (type || 'xlsx')));

}

const hiddenAction = () => {
  /*var actionbutton = document.getElementsByClassName('actionbutton');

  for (var i = 0; i < actionbutton.length; i ++) {
    //div.classList.remove('info')
    //labelEmail.remove();
    actionbutton[i].style.display = 'none';
  }
  */
  ExportToExcel('xlsx')
}





