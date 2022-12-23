

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
var decoded =''
var jwt = localStorage.getItem("token");

decoded = jwt_decode(jwt)
//console.log(decoded)
if (jwt === null) {
  console.log(jwt)
  window.location.href = './login.html'
}

else if (Date.now() >= decoded.exp * 1000) {
  window.location.href = './login.html'
}


document.getElementById("user-opdp").value = decoded.First_name

function multiBtnCellRenderer() { }

multiBtnCellRenderer.prototype.init = function (params) {
  var self = this;
  self.params = params;
  self.num_buttons = parseInt(this.params.num_buttons);
  self.btnClickedHandlers = {};
  let outerDiv = document.createElement('div')
  for (let i = 0; i < self.num_buttons; i++) {
    let button = document.createElement('button');
    button.innerHTML = self.params.button_html[i];
    outerDiv.appendChild(button);
    self.btnClickedHandlers[i] = function (event) {
      self.params.clicked[i](self.params.get_data_id());
    }.bind(i, self);
    button.addEventListener('click', self.btnClickedHandlers[i]);
  }
  self.eGui = outerDiv;
};

multiBtnCellRenderer.prototype.getGui = function () {
  return this.eGui;
};

multiBtnCellRenderer.prototype.destroy = function () {
  for (let i = 0; i < this.num_buttons; i++) {
    this.eGui.removeEventListener('click', this.btnClickedHandlers[i]);
  }
};

function currencyFormatter(params) {
  return 'Rp' + ' ' + formatNumber(params.value);
}

function formatNumber(number) {
  // this puts commas into the number eg 1000 goes to 1,000,
  // i pulled this from stack overflow, i have no idea how it works
  return Math.floor(number).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
const dateFormatter = (params) => {
  var dateAsString = params.data.date;
  //var dateParts = dateAsString.split('-');
  return `${dateAsString[0]} - ${dateAsString[1]} - ${dateAsString[2]}`;
}
const gridOptionAnggaran = {

  defaultColDef: {
    sortable: true,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  columnDefs: [

    //{ headerName: 'No', cellRendererFramework: AgGridRowNumberComponent},
    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      filter: false,
      width: 40, maxWidth: 40,

    },
    {
      headerName: 'Sub Kegiatan',
      field: 'name', minWidth: 600,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },

    {
      field: 'pagu',
      valueFormatter: currencyFormatter,
      cellStyle: {
        backgroundColor: '#aaffaa', // light green
        fontSize: '14px',


      }
    },
    {
      field: 'pdn',
      width: 70, maxWidth: 70,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {

      headerName: 'Last Created',
      field: 'CreatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }

    },
    {

      headerName: 'Last Updated',
      field: 'UpdatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      
    },
    {

      headerName: 'User Created',
      field: 'usercreate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Updated',
      field: 'userupdate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {
      headerName: "Action",
      maxWidth: 90,
      filter: false,
      floatingFilter: false,
      suppressMenu: true,
      sortable: false,
      cellRenderer: multiBtnCellRenderer,
      cellRendererParams: {
        num_buttons: 2, //<i class="bx bx-pencil bx-sm bx-tada-hover"></i>
        button_html: ["<i class='bx bx-pencil bx-sm'></i>", "<i style='color:red;' class='bx bx-x bx-sm bx-tada-hover'></i>"],
        get_data_id: function () {
          return this.data.id;
        },
        clicked: {
          0: function (data_id) {
            showAnggaranEditBox(data_id, `anggaran`, api_url_anggaran)
          },
          1: function (data_id) {
            detailDelete(data_id, `anggaran`, api_url_anggaran)
            //$.delete(`/employee/${data_id}`)
          }
        }
      }
    }
  ],

  // autoHeaderHeight: true,
  pagination: true,
  paginationPageSize: 10,
  domLayout: 'autoHeight',
  enableSorting: true,
  enableFilter: false,    // <-- HERE
  autoHeight: true,
  pagination: true
};


const aggridtable = (id) => {
  const eGridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(eGridDiv, gridOptionAnggaran);
  getApiAnggaran(id)
}


const getApiAnggaran = (id) => {
  fetch(api + 'api/anggaran/pagu/' + id, {
    headers: {
      'token': localStorage.getItem("token"),
      'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    //dynamicallyConfigureColumnsFromObject(data.data.data[0])
    gridOptionAnggaran.api.setRowData(data.data.data);
  })
}
const gridOptionsTenderCepat = {

  defaultColDef: {
    sortable: true,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  columnDefs: [

    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      filter: false,
      width: 40, maxWidth: 40,

    },
    {
      headerName: 'Sub Kegiatan',
      field: 'name', minWidth: 300,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Nama Paket',
      field: 'paket', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },

    {
      field: 'pagu',
      valueFormatter: currencyFormatter,
      cellStyle: {
        backgroundColor: '#aaffaa', // light green
        fontSize: '14px',


      }
    },
    {
      headerName: 'Pemilihan',
      field: 'pemilihan', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Pelaksanaan',
      field: 'pelaksanaan', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Jadwal',
      field: 'jadwal', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Keterangan',
      field: 'tender', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      field: 'pdn',
      width: 70, maxWidth: 70,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {

      headerName: 'Last Created',
      field: 'CreatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'Last Updated',
      field: 'UpdatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }

    },
    {

      headerName: 'User Created',
      field: 'usercreate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Updated',
      field: 'userupdate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {
      headerName: "Action",
      maxWidth: 90,
      filter: false,
      floatingFilter: false,
      suppressMenu: true,
      sortable: false,
      cellRenderer: multiBtnCellRenderer,
      cellRendererParams: {
        num_buttons: 2, //<i class="bx bx-pencil bx-sm bx-tada-hover"></i>
        button_html: ["<i class='bx bx-pencil bx-sm'></i>", "<i style='color:red;' class='bx bx-x bx-sm bx-tada-hover'></i>"],
        get_data_id: function () {
          return this.data.id;
        },
        clicked: {
          0: function (data_id) {
            showTenderDetailEditBox(data_id, `tender`, api_url_langsung)
          },
          1: function (data_id) {
            detailDelete(data_id, `tender`, api_url_langsung)
          }
        }
      }
    }
  ],

  // autoHeaderHeight: true,
  pagination: true,
  domLayout: 'autoHeight',
  paginationPageSize: 10,
  enableSorting: true,
  enableFilter: false,    // <-- HERE
  autoHeight: true,
  pagination: true
};

const aggridTenderCepat = (id) => {

  const eGridDiv = document.querySelector('#myTender');

  new agGrid.Grid(eGridDiv, gridOptionsTenderCepat);
  getApiTenderCepat(id)

}

const getApiTenderCepat = (id) => {
  fetch(api + 'api/langsung/pagu/' + id + '/default', {
    headers: {
      'token': localStorage.getItem("token"),
      'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    //console.log("coba data", response)
    return response.json();
  }).then(function (data) {
    gridOptionsTenderCepat.api.setRowData(data.data.data);
  })
}
const gridOptionsTenderLangsung = {

  defaultColDef: {
    sortable: true,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  columnDefs: [

    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      filter: false,
      width: 40, maxWidth: 40,

    },
    {
      headerName: 'Sub Kegiatan',
      field: 'name', minWidth: 300,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Nama Paket',
      field: 'paket', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },

    {
      field: 'pagu',
      valueFormatter: currencyFormatter,
      cellStyle: {
        backgroundColor: '#aaffaa', // light green
        fontSize: '14px',


      }
    },
    {
      headerName: 'Pemilihan',
      field: 'pemilihan', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Pelaksanaan',
      field: 'pelaksanaan', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },


    {
      field: 'pdn',
      width: 70, maxWidth: 70,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {

      headerName: 'Last Created',
      field: 'CreatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'Last Updated',
      field: 'UpdatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Created',
      field: 'usercreate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Updated',
      field: 'userupdate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {
      headerName: "Action",
      maxWidth: 90,
      filter: false,
      floatingFilter: false,
      suppressMenu: true,
      sortable: false,
      cellRenderer: multiBtnCellRenderer,
      cellRendererParams: {
        num_buttons: 2, //<i class="bx bx-pencil bx-sm bx-tada-hover"></i>
        button_html: ["<i class='bx bx-pencil bx-sm'></i>", "<i style='color:red;' class='bx bx-x bx-sm bx-tada-hover'></i>"],
        get_data_id: function () {
          return this.data.id;
        },
        clicked: {
          0: function (data_id) {
            showLangsungEditBox(data_id, `langsung`, api_url_langsung)
          },
          1: function (data_id) {
            detailDelete(data_id, `langsung`, api_url_langsung)
          }
        }
      }
    }
  ],

  // autoHeaderHeight: true,
  pagination: true,
  domLayout: 'autoHeight',
  paginationPageSize: 10,
  enableSorting: true,
  enableFilter: false,    // <-- HERE
  autoHeight: true,
  pagination: true
};
const aggridTenderLangsung = (id) => {
  const eGridDiv = document.querySelector('#myTenderLangsung');
  new agGrid.Grid(eGridDiv, gridOptionsTenderLangsung);
  getApiTenderLangsung(id)
}

const getApiTenderLangsung = (id) => {
  fetch(api + 'api/langsung/pagu/' + id + '/langsung', {
    headers: {
      'token': localStorage.getItem("token"),
      'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    //console.log("coba data", response)
    return response.json();
  }).then(function (data) {
    gridOptionsTenderLangsung.api.setRowData(data.data.data);
  })
}
const gridOptionsPlangsug = {

  defaultColDef: {
    sortable: true,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  columnDefs: [

    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      filter: false,
      width: 40, maxWidth: 40,

    },
    {
      headerName: 'Sub Kegiatan',
      field: 'name', minWidth: 300,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Nama Paket',
      field: 'paket', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },

    {
      field: 'pagu',
      valueFormatter: currencyFormatter,
      cellStyle: {
        backgroundColor: '#aaffaa', // light green
        fontSize: '14px',


      }
    },
    {
      headerName: 'Pemilihan',
      field: 'pemilihan', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Pelaksanaan',
      field: 'pelaksanaan', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },


    {
      field: 'pdn',
      width: 70, maxWidth: 70,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {

      headerName: 'Last Created',
      field: 'CreatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'Last Updated',
      field: 'UpdatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Created',
      field: 'usercreate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Updated',
      field: 'userupdate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {
      headerName: "Action",
      maxWidth: 90,
      filter: false,
      floatingFilter: false,
      suppressMenu: true,
      sortable: false,
      cellRenderer: multiBtnCellRenderer,
      cellRendererParams: {
        num_buttons: 2, //<i class="bx bx-pencil bx-sm bx-tada-hover"></i>
        button_html: ["<i class='bx bx-pencil bx-sm'></i>", "<i style='color:red;' class='bx bx-x bx-sm bx-tada-hover'></i>"],
        get_data_id: function () {
          return this.data.id;
        },
        clicked: {
          0: function (data_id) {
            showLangsungEditBox(data_id, `plangsung`, api_url_langsung)
          },
          1: function (data_id) {
            detailDelete(data_id, `plangsung`, api_url_langsung)
          }
        }
      }
    }
  ],

  // autoHeaderHeight: true,
  pagination: true,
  domLayout: 'autoHeight',
  paginationPageSize: 10,
  enableSorting: true,
  enableFilter: false,    // <-- HERE
  autoHeight: true,
  pagination: true
};
const aggridTenderPlangsung = (id) => {
  const eGridDiv = document.querySelector('#myTenderPlangsung');
  new agGrid.Grid(eGridDiv, gridOptionsPlangsug);
  getApiPlangsung(id)

}
const getApiPlangsung = (id) => {
  fetch(api + 'api/langsung/pagu/' + id + '/plangsung', {
    headers: {
      'token': localStorage.getItem("token"),
      'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    //console.log("coba data", response)
    return response.json();
  }).then(function (data) {
    gridOptionsPlangsug.api.setRowData(data.data.data);
  })
}
const gridOptionPurchasing = {

  defaultColDef: {
    sortable: true,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  columnDefs: [

    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      filter: false,
      width: 40, maxWidth: 40,

    },
    {
      headerName: 'Sub Kegiatan',
      field: 'name', minWidth: 300,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Nama Paket',
      field: 'paket', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },

    {
      field: 'pagu',
      valueFormatter: currencyFormatter,
      cellStyle: {
        backgroundColor: '#aaffaa', // light green
        fontSize: '14px',


      }
    },
    {
      headerName: 'Pemilihan',
      field: 'pemilihan', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Pelaksanaan',
      field: 'pelaksanaan', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },


    {
      field: 'pdn',
      width: 70, maxWidth: 70,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {

      headerName: 'Last Created',
      field: 'CreatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'Last Updated',
      field: 'UpdatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Created',
      field: 'usercreate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Updated',
      field: 'userupdate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {
      headerName: "Action",
      maxWidth: 90,
      filter: false,
      floatingFilter: false,
      suppressMenu: true,
      sortable: false,
      cellRenderer: multiBtnCellRenderer,
      cellRendererParams: {
        num_buttons: 2, //<i class="bx bx-pencil bx-sm bx-tada-hover"></i>
        button_html: ["<i class='bx bx-pencil bx-sm'></i>", "<i style='color:red;' class='bx bx-x bx-sm bx-tada-hover'></i>"],
        get_data_id: function () {
          return this.data.id;
        },
        clicked: {
          0: function (data_id) {
            showLangsungEditBox(data_id, `purchasing`, api_url_langsung)
          },
          1: function (data_id) {
            detailDelete(data_id, `purchasing`, api_url_langsung)
            //$.delete(`/employee/${data_id}`)
          }
        }
      }
    }
  ],

  // autoHeaderHeight: true,
  pagination: true,
  domLayout: 'autoHeight',
  paginationPageSize: 10,
  enableSorting: true,
  enableFilter: false,    // <-- HERE
  autoHeight: true,
  pagination: true
};
const aggridTenderPurchasing = (id) => {

  const eGridDiv = document.querySelector('#myTenderPurchasing');

  new agGrid.Grid(eGridDiv, gridOptionPurchasing);
  getApiTenderPurchsing(id)

}

const getApiTenderPurchsing = (id) => {
  fetch(api + 'api/langsung/pagu/' + id + '/purchasing', {
    headers: {
      'token': localStorage.getItem("token"),
      'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    gridOptionPurchasing.api.setRowData(data.data.data);
  })


}
const gridOptionsDikecualikan = {

  defaultColDef: {
    sortable: true,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  columnDefs: [

    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      filter: false,
      width: 40, maxWidth: 40,

    },
    {
      headerName: 'Sub Kegiatan',
      field: 'name', minWidth: 300,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Nama Paket',
      field: 'paket', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },

    {
      field: 'pagu',
      valueFormatter: currencyFormatter,
      cellStyle: {
        backgroundColor: '#aaffaa', // light green
        fontSize: '14px',


      }
    },
    {
      headerName: 'Pemilihan',
      field: 'pemilihan', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {
      headerName: 'Pelaksanaan',
      field: 'pelaksanaan', minWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },


    {
      field: 'pdn',
      width: 70, maxWidth: 70,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {

      headerName: 'Last Created',
      field: 'CreatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'Last Updated',
      field: 'UpdatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Created',
      field: 'usercreate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Updated',
      field: 'userupdate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {
      headerName: "Action",
      maxWidth: 90,
      filter: false,
      floatingFilter: false,
      suppressMenu: true,
      sortable: false,
      cellRenderer: multiBtnCellRenderer,
      cellRendererParams: {
        num_buttons: 2, //<i class="bx bx-pencil bx-sm bx-tada-hover"></i>
        button_html: ["<i class='bx bx-pencil bx-sm'></i>", "<i style='color:red;' class='bx bx-x bx-sm bx-tada-hover'></i>"],
        get_data_id: function () {
          return this.data.id;
        },
        clicked: {
          0: function (data_id) {
            showLangsungEditBox(data_id, `kecuali`, api_url_langsung)
            //showLangsungEditBox(data_id,`langsung`, + api_url_langsung)
          },
          1: function (data_id) {
            //$.delete(`/employee/${data_id}`)
            detailDelete(data_id, `kecuali`, api_url_langsung)
          }
        }
      }
    }
  ],

  // autoHeaderHeight: true,
  pagination: true,
  domLayout: 'autoHeight',
  paginationPageSize: 10,
  enableSorting: true,
  enableFilter: false,    // <-- HERE
  autoHeight: true,
  pagination: true
};
const aggridTenderDikecualikan = (id) => {
  const eGridDiv = document.querySelector('#myTenderDikecualikan');
  new agGrid.Grid(eGridDiv, gridOptionsDikecualikan);
  getApiDikecualikan(id)
}

const getApiDikecualikan = (id) => {

  fetch(api + 'api/langsung/pagu/' + id + '/kecuali', {
    headers: {
      'token': localStorage.getItem("token"),
      'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    gridOptionsDikecualikan.api.setRowData(data.data.data);
  })
}
const gridOptionsSwakelola = {

  defaultColDef: {
    sortable: true,
    filter: 'agTextColumnFilter',
    resizable: true
  },
  columnDefs: [

    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      filter: false,
      width: 40, maxWidth: 40,

    },
    {
      headerName: 'Sub Kegiatan',
      field: 'name', minWidth: 500,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },


    {
      field: 'pagu',
      valueFormatter: currencyFormatter,
      cellStyle: {
        backgroundColor: '#aaffaa', // light green
        fontSize: '14px',


      }
    },
    {
      headerName: 'Pdn',
      field: 'pdn', width: 100, minWidth: 100,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },

    {
      headerName: 'Keterangan',
      field: 'ket',
      width: 150, maxWidth: 150,
      cellStyle: { // light green
        fontSize: '14px',
      }
    },
    {

      headerName: 'Last Created',
      field: 'CreatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'Last Updated',
      field: 'UpdatedAt',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      valueFormatter: function(params) {
        let dt = moment(params.value, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
        return (dt == 'Invalid date' || dt == '0001-01-01 00:00:00' ? '' : dt)
       }
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Created',
      field: 'usercreate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {

      headerName: 'User Updated',
      field: 'userupdate',
      width: 200, maxWidth: 200,
      cellStyle: { // light green
        fontSize: '14px',
      },
      // valueFormatter: dateFormatter,

    },
    {
      headerName: "Action",
      maxWidth: 90,
      filter: false,
      floatingFilter: false,
      suppressMenu: true,
      sortable: false,
      cellRenderer: multiBtnCellRenderer,
      cellRendererParams: {
        num_buttons: 2, //<i class="bx bx-pencil bx-sm bx-tada-hover"></i>
        button_html: ["<i class='bx bx-pencil bx-sm'></i>", "<i style='color:red;' class='bx bx-x bx-sm bx-tada-hover'></i>"],
        get_data_id: function () {
          return this.data.id;
        },
        clicked: {
          0: function (data_id) {
            showSwakelolaEditBox(data_id, `swakelola`, api_url_langsung)
          },
          1: function (data_id) {
            detailDelete(data_id, `swakelola`, api_url_langsung)
          }
        }
      }
    }
  ],

  // autoHeaderHeight: true,
  pagination: true,
  domLayout: 'autoHeight',
  paginationPageSize: 10,
  enableSorting: true,
  enableFilter: false,    // <-- HERE
  autoHeight: true,
  pagination: true
};
const aggridTenderSwakelola = (id) => {
  const eGridDiv = document.querySelector('#myTenderSwakelola');
  new agGrid.Grid(eGridDiv, gridOptionsSwakelola);
  getApiTenderSwakelola(id)
}

const getApiTenderSwakelola = (id) => {
  fetch(api + 'api/langsung/pagu/' + id + '/swakelola', {
    headers: {
      'token': localStorage.getItem("token"),
      'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    //console.log("coba data", response)
    return response.json();
  }).then(function (data) {
    gridOptionsSwakelola.api.setRowData(data.data.data);
  })
}

const getApiTotal = (id) => {
  fetch(api + 'api/anggaran/pagu/total/' + id, {
    headers: {
      'token': localStorage.getItem("token"),
      'X-FP-API-KEY': 'iphone', //it can be iPhone or your any other attribute
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    getTotalPagu(data)
  })
}

const getTotalPagu = (data) => {
        //console.log("pagu",data.data.data[0].totalpagu)
        //console.log(data)
        const formatCurrencry = new Intl.NumberFormat('en-ID', {
          style: 'currency',
          currency: 'IDR'
        }).format(data.data.data[0].totalpagu).replace(/[IDR]/gi, '')
          .replace(/(\.+\d{2})/, '')
          .trimLeft()

        var trHTML = '';
        trHTML += '<div>';
        trHTML += '<div style="color:#0A2558; width: 400px; font-size:16px; padding-bottom: 15px; border-bottom: 1px solid #0A2558; font-weight: 400; margin-top:15px;margin-bottom:15px;">' +'Total Pagu: Rp'+' ' + formatCurrencry + '</div>';
        trHTML += "</div>";

        document.getElementById("totalPaguAnggaran").innerHTML = trHTML;
  //console.log("pagu",data)
}

/*
new Intl.NumberFormat('en-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(object['paguopdp']).replace(/[IDR]/gi, '')
            .replace(/(\.+\d{2})/, '')
            .trimLeft()
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

  fetch(api_url, {
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
        CreateAnggaran(api_url_anggaran, header_title)
      }
    }).then(val => {

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
        '<input type="text" style="width:15em" onfocus="(this.type=`date`)" placeholder="Waktu Pemilihan" class="swal2-input" id="pemilihan" name="trip-start"  min="2022-11-10" max="2025-12-31">' +
        '<input id="pdn" style="width:15em" type="text" onfocus="(this.type=`number`)" class="swal2-input" placeholder="PDN %">',

      focusConfirm: false,
      preConfirm: () => {

        CreateDetailLain(api_url_langsung, header_title)

      }
    })
  }

}

const swallWarningMessage = (dataWarning) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong! ' + dataWarning + ' Must be Input',
    footer: '<a href="">Why do I have this issue?</a>'
  })
}

function CreateAnggaran(api_param, header_title) {
  const pagu = document.getElementById("pagu").value
  const name = document.getElementById("name").value
  if (name == '') {
    swallWarningMessage('Sub kegiatan')
  }
  else if (pagu == '') {
    swallWarningMessage('Pagu')
  }
  else {
    let data = new FormData()
    data.append("name", name)
    data.append("paket", "000")
    data.append("pagu", parseInt(pagu))
    data.append("jadwal", "12-12-2022")
    data.append("pdn", parseInt(20))
    data.append("idpagu", id_global)
    data.append("userupdate", decoded.First_name)
    data.append("usercreate", decoded.First_name)

    fetch(api_param, {
      method: 'POST',
      headers: {
        token: localStorage.getItem('token')
      },
      body: data
    }).then(response => {
      console.log('response.status: ', response.status);
      console.log(response)
      Swal.fire('Saved!', '', 'success')
      getApiAnggaran(id_global)
      getApiTotal(id_global)
      //getApi()
      //detailAnggaran(id_global)
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
  console.log(selecinput)
  if (selectSubkegiatan == 'Kegiatan SKPD') {
    swallWarningMessage('Kegiatan SKPD')
  }
  else if (selecinput == 'Jenis Tender' || selecinput == '') {
    swallWarningMessage('Jenis Tender')
  }
  else if (paket == '') {
    swallWarningMessage('Nama Paket')
  }
  else if (pagu == '') {
    swallWarningMessage('Pagu')
  }
  else if (pdn == '') {
    swallWarningMessage('PDN')
  }
  else if (waktupelaksanaan == '') {
    swallWarningMessage('Waktu Pelaksanaan')
  }
  else if (waktupemilihan == '') {
    swallWarningMessage('Waktu Pemililhan')
  }
  else if (waktupemanfaatan == '') {
    swakelolaLangsungEdit('Waktu Pemanfaatan')
  }
  else {
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
    data.append("userupdate", decoded.First_name)
    data.append("usercreate", decoded.First_name)
    fetch(api + 'api/langsung', {
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
      getApiTenderCepat(id_global)
      getApiTenderLangsung(id_global)
      getApiPlangsung(id_global)
      getApiDikecualikan(id_global)
      getApiTenderPurchsing(id_global)
      //detailTender(id_global)
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

}

function CreateSwakelola(api_param, header_title) {

  const pdn = document.getElementById("pdn").value;
  const pagu = document.getElementById("pagu").value;
  const keterangan = document.getElementById("keterangan").value
  var selectSubkegiatan = document.getElementById("dropdown-list").value

  if (selectSubkegiatan == 'Kegiatan SKPD') {
    swallWarningMessage('Kegiatan SKPD')
  }
  else if (pagu == '') {
    swallWarningMessage('Name Pagu')
  }
  else if (keterangan == '') {
    swallWarningMessage('Keterangan')
  }
  else if (pdn == '') {
    swallWarningMessage('PDN')
  }
  else {
    let data = new FormData()
    data.append("name", selectSubkegiatan)
    data.append("paket", "default")
    data.append("pagu", parseInt(pagu))
    data.append("tipe", header_title)
    data.append("jadwal", "12-12-2022")
    data.append("ket", "keterangan")
    data.append("tender", "default")
    data.append("pelaksanaan", "12-12-2022")
    data.append("pemilihan", "12-12-2022")
    data.append("pdn", parseInt(pdn))
    data.append("idpagu", id_global)
    data.append("userupdate", decoded.First_name)
    data.append("usercreate", decoded.First_name)

    fetch(api_param, {
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
      getApiTenderSwakelola(id_global)

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
}

function CreateDetailLain(api_param, header_title) {

  const pelaksanaan = document.getElementById("pelaksanaan").value;

  var selectSubkegiatan = document.getElementById("dropdown-list").value
  const pemilihan = document.getElementById('pemilihan').value
  const pdn = document.getElementById("pdn").value;
  const paket = document.getElementById("paket").value;
  const pagu = document.getElementById("pagu").value;
  if (selectSubkegiatan == 'Kegiatan SKPD') {
    swallWarningMessage('Kegiatan SKPD')
  }
  else if (paket == '') {
    swallWarningMessage('Paket')
  }
  else if (pagu == '') {
    swallWarningMessage('Pagu')
  }
  else if (pelaksanaan == '') {
    swallWarningMessage('Waktu Pelaksanaan')
  }
  else if(pemilihan==''){
    swallWarningMessage('Waktu Pemilihan')
  }
  else if (pdn == '') {
    swallWarningMessage('PDN')
  }
  else {
    let data = new FormData()
    data.append("name", selectSubkegiatan)
    data.append("paket", paket)
    data.append("pagu", parseInt(pagu))
    data.append("tipe", header_title)
    data.append("jadwal", pemilihan)
    data.append("pdn", parseInt(pdn))

    data.append("ket", "ket")
    data.append("tender", "default")
    data.append("pelaksanaan", pelaksanaan)

    data.append("tender", "default")
    data.append("pemilihan", pemilihan)
    data.append("idpagu", id_global)

    data.append("userupdate", decoded.First_name)
    data.append("usercreate", decoded.First_name)

    fetch(api_param, {
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
      getApiTenderCepat(id_global)
      getApiTenderLangsung(id_global)
      getApiPlangsung(id_global)
      getApiDikecualikan(id_global)
      getApiTenderPurchsing(id_global)
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

}

const deletePagu = (id) => {

  fetch(api + "api/pagus/" + id, {
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


  fetch(api + "/" + id, {
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
    getApiAnggaran(id_global)
    getApiTenderCepat(id_global)
    getApiPlangsung(id_global)
    getApiTenderLangsung(id_global)
    getApiTenderPurchsing(id_global)
    getApiTenderSwakelola(id_global)
    getApiTotal(id_global)
    /* detailAnggaran(id_global)
    detailLangsung(id_global)
    detailPenunjukanLangsug(id_global)
    detailPurchasing(id_global)
    detailPengecualian(id_global)
    detailSwakelola(id_global)
    refreshTotal()
    */
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
  aggridtable(id)
  aggridTenderCepat(id)
  aggridTenderLangsung(id)
  aggridTenderPlangsung(id)
  aggridTenderPurchasing(id)
  aggridTenderDikecualikan(id)
  aggridTenderSwakelola(id)
  getApiTotal(id)
  detaiDownload(id)
  //detailAnggaran(id)
  //detailTender(id)
  //detailLangsung(id)
  //detailPenunjukanLangsug(id)
  //detailPurchasing(id)
  //detailPengecualian(id)
  //detailSwakelola(id)
  detailTotalTenderDetail(id)
  detailTotalTenderDetailCepatSeleksi(id)
  detailTotalTenderDetailReport(id)
  detailTotalTenderDetailReportJumlah(id)
  detailTotalTenderDetailReportJumlahPagu(id)
  //detailTotalTenderDetailReportSeleksi(id)
  detailTotalTenderDetailReportSeleksiJumlah(id)
  detailTotalTenderDetailReportSeleksiRupiah(id)
  loadLink(id)
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
      //console.log("coba data",responseData);
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
          //document.getElementById("anggaran").innerHTML = trHTML;
        }
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
      // console.log("this data",objects)
      if (objects.data.data === null) {
        console.log('data kosong')
      }
      else {
        let i = 0;
        console.log("this data", objects)
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
  //console.log(api_param_anggaran)
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
          //detailAnggaran(id_global)
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
  if(selectSubkegiatan=='Kegiatan SKPD'){
    swallWarningMessage('Kegiatan SKPD')
  }
  else if(pagu==''){
    swallWarningMessage('Pagu')
  }
  else if(paket==''){
    swallWarningMessage('Paket')
  }
  else if(pdn==''){
    swallWarningMessage('PDN')
  }
  else {
    let data = new FormData()
    data.append("name", selectSubkegiatan)
    data.append("paket", paket)
    data.append("pagu", parseInt(pagu))
    data.append("tipe", tipe)
    data.append("jadwal", pelaksanaan)
    data.append("pdn", parseInt(pdn))
  
    data.append("ket", keterangan)
    data.append("tender", "default")
    data.append("pelaksanaan", pelaksanaan)
  
    data.append("tender", "default")
    data.append("pemilihan", pemilihan)
    data.append("idpagu", idpagu)
    
    data.append("userupdate", decoded.First_name)
    //data.append("usercreate", decoded)
  
    fetch(api + "api/langsung/" + id, {
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
      getApiTenderLangsung(id_global)
      getApiPlangsung(id_global)
      getApiTenderPurchsing(id_global)
      getApiDikecualikan(id_global)
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
          //'<input id="pemilihan" type="hidden" value=' + posts['pemilihan'] + '>' +
          //'<input id="paket" type="hidden" value=' + posts['paket'] + '>' + loadSelectTender
          '<input id="ket" type="hidden" value=' + posts['ket'] + '>' +
          '<select id="dropdown-list" style="width:15em"  onfocus="loadDataKegiatanEdit(\'' + posts['name'] + '\')" class="swal2-input"><option value="DEFAULT">Sub Kegiatan SKPD</option></select>' +
          '<input id="paket" style="width:15em" class="swal2-input" placeholder="Sub Kegiatan" value="' + posts['paket'] + '">' +
          '<input id="pagu" style="width:15em" class="swal2-input" placeholder="Jumlah" value="' + posts['pagu'] + '">' +
          '<input type="text" style="width:15em" onfocus="(this.type=`date`)" placeholder="Waktu Pelaksanaan" class="swal2-input" id="pelaksanaan" name="trip-start"  min="2022-11-10" max="2025-12-31"  value="' + posts['pelaksanaan'] + '">' +
          '<input type="text" style="width:15em" onfocus="(this.type=`date`)" placeholder="Waktu Pemilihan" class="swal2-input" id="pemilihan" name="trip-start"  min="2022-11-10" max="2025-12-31"  value="' + posts['pemilihan'] + '">' +
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
  if (selectSubkegiatan == 'Kegiatan SKPD' || selectSubkegiatan == '') {
    swallWarningMessage('Kegiatan SKPD')
  }
  else if (paket == '') {
    swallWarningMessage('Nama Paket')
  }
  else if (pagu == '') {
    swallWarningMessage('Pagu')
  }
  else if (tenderlo == '') {
    swallWarningMessage('Jenis Tender')
  }
  else if (pdn == '') {
    swallWarningMessage('PDN')
  }
  else if (pelaksanaan == '') {
    swallWarningMessage('Waktu Pelaksanaan')
  }
  else if (pemilihan == '') {
    swallWarningMessage('Waktu Pemilihan')
  }
  
  else {
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
    data.append("userupdate", decoded.First_name)


    fetch(api + "api/langsung/" + id, {
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
      getApiTenderCepat(id_global)
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
          //detailAnggaran(id_global)
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

  if (selectSubkegiatan == 'Kegiatan SKPD') {
    swallWarningMessage('Kegiatan SKPD')
  }
  else if (pagu == '') {
    swallWarningMessage('Name Pagu')
  }
  else if (keterangan == '') {
    swallWarningMessage('Keterangan')
  }
  else if (pdn == '') {
    swallWarningMessage('PDN')
  }
  else {
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

    data.append("userupdate", decoded.First_name)
    //data.append("usercreate", decoded)
    // xhttp.open("PUT", api + "api/langsung/" + id);
    fetch(api + "api/langsung/" + id, {
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
      getApiTenderSwakelola(id_global)
      //detailSwakelola(id_global)
      //refreshTotal()
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

}


const editAnggaran = () => {


  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const paguopd = document.getElementById("pagu").value;
  if (name == '') {
    swallWarningMessage('Sub Kegiatan')
  }
  else if (paguopd == '') {
    swallWarningMessage('Pagu')
  }
  else {
    let data = new FormData()

    data.append("name", name)
    data.append("paket", "000")
    data.append("pagu", parseInt(paguopd))
    data.append("jadwal", "12-12-2022")
    data.append("pdn", parseInt(20))
    data.append("idpagu", id_global)
    data.append("userupdate", decoded.First_name)
    //data.append("usercreate", decoded)

    fetch(api_url_anggaran + "/" + id, {
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
      getApiAnggaran(id_global)
      getApiTotal(id_global)
      //aggridtable(id_global)
      //detailAnggaran(id_global)
    }).catch(err => {
      console.log(err)
      swallWarningMessage(err)
    })


  }
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

  fetch(api_url + "/" + id, {
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
      //detailAnggaran(id_global)
      //detailTender(id_global)
      //refreshTotal()

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

function showUserCreteLink() {
  Swal.fire({
    title: 'Ceata Link',
    icon: 'success',
    showDenyButton: true,
    confirmButtonText: 'Save',
    denyButtonText: `Don't save`,
    html:
      '<input id="id" type="hidden">' +
      '<input id="name" class="swal2-input" placeholder="Nama File">' +
      '<input id="link" class="swal2-input" placeholder="Link Download">',
    focusConfirm: false,
    preConfirm: () => {
      linkCreate()
    }
  })
}

const linkCreate = () => {
  const name = document.getElementById("name").value;
  const link = document.getElementById("link").value;
  let data = new FormData()
  data.append("name", name)
  data.append("link", link)
  data.append("idpagu", id_global)
  fetch(api + 'api/link', {
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
    loadLink()
    //loadTable(1, "")
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


const loadLink = (id) => {

  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api + 'api/link');

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
      console.log(objects)
      if (objects.data.data == null) {
        console.log('Data Not Found')
      }
      else {

        for (let object of objects.data.data) {
          let id_obj = object['id']
          i++
          trHTML += '<tr>';
          trHTML += '<td>' + i + '</td>';
          trHTML += '<td>' + object['name'] + '</td>';
          trHTML += '<td>' + '<a style="color:red" href="' + object['link'] + '" target="_blank">' + 'Download File' + '</a>' + '</td>';
          trHTML += '<td class="actionbutton"><a href="javascript:void(0)" onclick="showLinkEditBox(\'' + id_obj + '\')"> <i class="bx bx-pencil bx-sm bx-tada-hover"></i></a>';
          trHTML += '<a href="javascript:void(0)" onclick="deletLink(\'' + id_obj + '\')"><i style="color:red;" class="bx bx-x bx-sm bx-tada-hover"></i></a></td>';

          trHTML += "</tr>";
        }
      }


      document.getElementById("filidownloadlink").innerHTML = trHTML;

    }

  };
}

function deletLink(id) {

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
      linkDelete(id)

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

const linkDelete = (id) => {

  fetch(api + "api/link/" + id, {
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
    loadLink(id)
  }).catch(err => {
    console.log(err)

  })

}


const showLinkEditBox = (id) => {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", api + 'api/link/' + id);
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
          '<input id="idpagu" type="hidden" value=' + posts['idpagu'] + '>' +
          '<input id="name"  class="swal2-input" placeholder="Name File" value="' + posts['name'] + '">' +
          '<input id="linkdata"  class="swal2-input" placeholder="Link Url" value="' + posts['link'] + '">',
        focusConfirm: false,
        preConfirm: () => {
          linkEdit()
          //paguEdit()
        }
      })


    }
  };
}

const linkEdit = () => {
  console.log("edited")
  const id = document.getElementById("id").value;
  const name = document.getElementById("name").value;
  const link = document.getElementById("linkdata").value;
  const idpagu = document.getElementById("idpagu").value;
  let data = new FormData()
  data.append("name", name)
  data.append("link", link)
  data.append("idpagu", idpagu)

  fetch(api + "api/link/" + id, {
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
    loadLink()
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




const logout = () => {
  localStorage.clear();
  window.location.href = './login.html'
}


