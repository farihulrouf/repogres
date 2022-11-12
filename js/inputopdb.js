const inputForm = () => {
    (async () => {

        const { value: fruit } = await Swal.fire({
            title: 'Select field validation',
            input: 'select',
            inputOptions: {
                apples: 'Apples',
                bananas: 'Bananas',
                grapes: 'Grapes',
                oranges: 'Oranges'
            },
            inputPlaceholder: 'Select a fruit',
            showCancelButton: true,
            inputValidator: (value) => {
                return new Promise((resolve) => {
                    if (value === 'oranges') {
                        resolve()
                    } else {
                        resolve('You need to select oranges :)')
                    }
                })
            }
        })

        if (fruit) {
            Swal.fire('You selected: ' + fruit)
        }

    })()

}


const showUserCreateBoxsatu = () => {
    Swal.fire({
        title: 'Create Pagu',
        html:
            '<input id="id" type="hidden">' +
            '<input id="name" class="swal2-input" placeholder="Nama SKPD">' +
            '<input id="paguopd" class="swal2-input" placeholder="Pagu SKPD">' +
            '<select id="dropdown-list" onfocus="loadData()" class="swal2-input"></select>' +
            '<select class="swal2-input time-input" id="input-select"> <option value="">Jenis Tender</option><option value="Tender">Tender</option><option value="Seleksi">Seleksi</option><option value="Tender cepat">Tender Cepat</option></select>' +
            '<input id="paguorp" class="swal2-input" placeholder="Pagu RUP">',
        focusConfirm: false,
       
        preConfirm: () => {
            //paguCreate();
        }
    })
}

const loadData = () => {
    let dropdown = document.getElementById('dropdown-list');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose ';

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

    const url = 'http://localhost:3000/api/pagus';

    const request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function () {
        if (request.status === 200) {
            const objects = JSON.parse(request.responseText);
            let option;
            console.log(objects)
            console.log(objects.data.data.length)
            for (let i = 0; i < objects.data.data.length; i++) {
                //console.log(data)
                option = document.createElement('option');
                option.text = objects.data.data[i].name;
                option.value = objects.data.data[i].abbreviation;
                dropdown.add(option);
            }
        } else {
            console.log("data tidak ada")
            // Reached the server, but it returned an error
           // const objects = JSON.parse(this.responseText);
           // for (let object of objects.data.data) {
        }
    }

    request.onerror = function () {
        console.error('An error occurred fetching the JSON from ' + url);
    };

    request.send();
    
}

