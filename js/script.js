let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
sidebarBtn.onclick = function () {
  sidebar.classList.toggle("active");
  if (sidebar.classList.contains("active")) {
    
    sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
  } else
    
    sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
}

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
  console.log("di eksekusi")
  /*
  var hideeninpuxbox = document.getElementById("inputbox")
  var idlaporan = document.getElementById("idlaporan")
  var clickreport = document.getElementById("clickreport")
  var printreportid = document.getElementById("printreportid")
  hideeninpuxbox.style.display = "block"
  clickreport.style.display = "block"
  printreportid.style.display= "none"
  idlaporan.style.display = "none"
  */


}

