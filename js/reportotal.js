

const apiglobal = "http://localhost:3000/"
const api_url_pagu = apiglobal + "api/pagus";

function loadTableTotal() {
    var acc = document.getElementsByClassName("accordion");
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", api_url_pagu);
    xhttp.send();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var trHTML = '';
        let i = 0
        const objects = JSON.parse(this.responseText);
        for (let object of objects.data.data) {
          //console.log(objects.data.data)
         
          
         trHTML += '<button class="accordion" onclick="accordionClick()">' + object['name'] + '</button>';
         // trHTML += '<button class="accordion" onclick="test()">' + object['name'] + '</button>';
          trHTML += '<div class="panel" style="display: none;">' + 'hello world' + '</div>';
         
        
        }
        document.getElementById("totalseluruhcoolapse").innerHTML = trHTML;
        
  
      }
    };
}

loadTableTotal()
const accordionClick = () => {
  
  const acc = document.getElementsByClassName("accordion");
  var i;
  console.log(acc)
  for (i = 0; i < acc.length; i++) {
  
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      console.log('ok test')
      var panel = this.nextElementSibling;
      if (panel.style.display === "block") {
        panel.style.display = "none";
      } else {
        panel.style.display = "block";
      }
    });
  }
}

//accordionClick()