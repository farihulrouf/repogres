const clickDetailReport = () => {
  var reporttoexcel = document.getElementById("reporttoexcel")
  var hideeninpuxbox = document.getElementById("inputbox")
  var printviewinputbox = document.getElementById("printviewinputbox")
  var idlaporan = document.getElementById("idlaporan")
  var clickreport = document.getElementById("clickreport")
  var inputboxprint = document.getElementById("inputboxprint")
  var printreportid = document.getElementById("printreportid")
  hideeninpuxbox.style.display = "none"
  reporttoexcel.style.display = "none"
  clickreport.style.display = "none"
  printreportid.style.display = "flex"
  inputboxprint.style.display = "none"
  printviewinputbox.style.display="none"
  idlaporan.style.display = "block"
}

const inputDetailData = () => {

  var hideeninpuxbox = document.getElementById("inputbox")
  var inputboxprint = document.getElementById("inputboxprint")
  var reporttoexcel = document.getElementById("reporttoexcel")
  var printviewinputbox = document.getElementById("printviewinputbox")
  var idlaporan = document.getElementById("idlaporan")
  var clickreport = document.getElementById("clickreport")
  var printreportid = document.getElementById("printreportid")
  hideeninpuxbox.style.display = "block"
  printviewinputbox.style.display ="none"
  inputboxprint.style.display = "none"
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



  var elt = document.getElementById('printdetaildesk');
  
  var wb = XLSX.utils.table_to_book(elt, { sheet: "sheet1" });
  
  return dl ?
    XLSX.write(wb, { bookType: type, bookSST: true, type: 'base64' }) :
    XLSX.writeFile(wb, fn || ('MySheetName.' + (type || 'xlsx')));

}




function ExportReportToExel(){
  //let tbl1 = document.getElementById("tableinformaridetail")
  let tbl2 = document.getElementById("printviewinputbox")
  let tbl3 = document.getElementById("titleformat")
     
  //let worksheet_tmp1 = XLSX.utils.table_to_sheet(tbl1);
  let worksheet_tmp2 = XLSX.utils.table_to_sheet(tbl2);
  let worksheet_tmp3 = XLSX.utils.table_to_sheet(tbl3);
  //console.log("isi dari",worksheet_tmp2)

  //const wb = XLSX.read(target,{type:'binary',cellText:false,cellDates:true});
  //let a = XLSX.utils.sheet_to_json(worksheet_tmp1, { header: 1, raw: false, dateNF:'YYYY-MM-DD' })
  let b = XLSX.utils.sheet_to_json(worksheet_tmp2, { header: 1, raw: false, dateNF:'YYYY-MM-DD' })
  let c = XLSX.utils.sheet_to_json(worksheet_tmp3, { header: 1, raw: false, dateNF:'YYYY-MM-DD' })
  //let c = XLSX.utils.sheet_to_json(worksheet_tmp3, { header: 1 })
     
  c = c.concat(['']).concat(b)
  //ws['!ref'] = "A2:C3" 
  let worksheet = XLSX.utils.json_to_sheet(c, { skipHeader: true })
  
  const new_workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(new_workbook, worksheet, "worksheet")
  XLSX.writeFile(new_workbook, 'reportskpblp.xlsx')
}






