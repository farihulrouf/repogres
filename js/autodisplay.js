const clickDetailReport = () => {
    var hideeninpuxbox = document.getElementById("inputbox")
    var idlaporan = document.getElementById("idlaporan")
    var clickreport = document.getElementById("clickreport")
    var printreportid = document.getElementById("printreportid")
    hideeninpuxbox.style.display = "none"
    clickreport.style.display = "none"
    printreportid.style.display= "flex"
    idlaporan.style.display = "block"
  }
  
  const inputDetailData = () => {
    
    var hideeninpuxbox = document.getElementById("inputbox")
    var idlaporan = document.getElementById("idlaporan")
    var clickreport = document.getElementById("clickreport")
    var printreportid = document.getElementById("printreportid")
    hideeninpuxbox.style.display = "block"
    clickreport.style.display = "flex"
    printreportid.style.display= "none"
    idlaporan.style.display = "none"
     
  }

  const reportUmum = () => {

    var opdb = document.getElementById("opdb")
    var totalkeseluruhan = document.getElementById("totalkeseluruhan")
    opdb.style.display= "none"
    totalkeseluruhan.style.display="block"
  }
  const backToreport = () => {

    var opdb = document.getElementById("opdb")
    var totalkeseluruhan = document.getElementById("totalkeseluruhan")
    opdb.style.display= "block"
    totalkeseluruhan.style.display="none"

  }

const printForm = () => {
	printJS({
    printable: 'printdetaildesk',
    type: 'html',
    targetStyles: ['*'],
    header: ''
 })
}



  
  