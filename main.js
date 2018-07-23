/**
 * initialize constants
 */
const isColumnLevelFilter = true; // pass false if you do not want filtering.
const isColumnlevelSort = true; // pass false if you do not want sorting.
const pagiNation = true; // pass false if you do not want pagination.
const pageSize = 10;
let currentPage = 1;

/**
 * Can provide column level customization from this variable. 
 * In future we can add : if someone want or not want column level filtering, column level sorting, Someone want column to visible or not. 
 */
const defineTableColumns = [
    {
        fieldName: 'firstName', // key in Actual API response, want to make sure data in table display in same order in which user wants.
        displayName: 'First Name', // giving user's ability to how they want to display column of the header
        type: 'string',  // type of the values which will going to come. [number, string, date, boolean] [ will be used while sorting the column. ]
        width: '', // width for the column, we can keep * for default otherwise we keep what user have entered here. 
        sort: 'asc' // [sort asc , desc]
    },
    {   
        fieldName: 'lastName',
        displayName: 'Last Name',
        type: 'string',
        width: '',
        sort: 'asc'
    },
    {   
        fieldName: 'age',
        displayName: 'Age',
        type: 'number',
        width: '',
        sort: 'asc'
    },
    {
        fieldName: 'eyeColor',
        displayName: 'Eye Color',
        type: 'string',
        width: '',
        sort: 'asc'
    },
    {
        fieldName: 'isActive',
        displayName: 'Status',
        type: 'boolean',
        width: '',
        sort: 'asc'
    },
    {
        fieldName: 'gender',
        displayName: 'Gender',
        type: 'string',
        width: '',
        sort: 'asc'
    },
    {
        fieldName: 'company',
        displayName: 'Company',
        type: 'string',
        width: '',
        sort: 'asc'
    },
    {
        fieldName: 'email',
        displayName: 'Email',
        type: 'string',
        width: '',
        sort: 'asc'
    },
    {
        fieldName: 'phone',
        displayName: 'Mobile No.',
        type: 'number',
        width: '',
        sort: 'asc'
    },
    {
        fieldName: 'address',
        displayName: 'Address',
        type: 'object',
        width: '',
        sort: 'asc'
    },
    {
        fieldName: 'LastLogin',
        displayName: 'LastLogin',
        type: 'date',
        width: '',
        sort: 'asc'
    }
];


document.addEventListener('DOMContentLoaded',function(event){
    /**
     * initialize variales.
     */
    let xmlhttp;

    //browser support
    if (window.XMLHttpRequest) {
        // support for new browsers
        xmlhttp = new XMLHttpRequest();
     } else {
        // support for old IE browsers
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    fetchTableRows(xmlhttp);
    ListenForGlobalFilters();
});

/**
 * Fetch Table data
 */
fetchTableRows = (xmlhttp) => {
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            self.tableRows = JSON.parse(this.response);
            initYourTable(JSON.parse(this.response), isColumnLevelFilter, isColumnlevelSort, pagiNation, pageSize, defineTableColumns);
        }
    };
    xmlhttp.open("GET", "data.json", true);
    xmlhttp.send();
}

/**
 * 
 * @description: Will create a Table, render data in View and attach necessary listners for the events.
 * @param: tableData : array of objects - data tables.
 * @param: isColumnLevelFilter: if user wants filter at column level
 * @param: isColumnlevelSort: if user wants sorting at column level
 * @param: pagiNation: if user wants pagination.
 * @param: pageSize: size of the pages
 * @param: Definition of columns.
 * @returns: will return nothing. but function will create a template and bind that tempalte in View in end. 
 */

initYourTable = (tableData, isColumnLevelFilter, isColumnlevelSort, pagiNation, pageSize, defineTableColumns) => {
    
    if(tableData && tableData.length > 0) {
        const table = document.querySelector("#app_table");
        let templateString = `<thead class="thead-dark"><tr>`;
        
        for(let i=0; i<defineTableColumns.length; i++ ) {
            templateString+= `${isColumnlevelSort ? 
                `<th onclick="columnLevelSorting(event,${i})" class="sort-enabled">${defineTableColumns[i].displayName} <span class="sort-arrow sort-ascending-col-${i}">&#8896;</span><span class="sort-arrow sort-descending-col-${i}">&#8897;</span></th>` 
            : `<th>${defineTableColumns[i].displayName}</th>`}`;
        }
        templateString+= `</tr>`;

        /**
         * Add Filters on columns.
         */
        if(isColumnLevelFilter) {
            templateString+= `<tr>`
            for(let i=0; i<defineTableColumns.length; i++ ) {
                templateString+= `<th><input onKeyUp="columnLevelFiltering(event,${i})" type="text" id=column_${i+1} /></th>`;
            }
            templateString+= `</tr>`;
        }
        templateString+= `</thead>`; // done with the head of table.

        /**
         * pagiNation.
         */

        if(pagiNation) {
            
            /**
             * slice data based on the pageSize and render those data
             */
            let currentTableData = tableData.slice(0,pageSize);
            templateString+= `<tbody>`;
            templateString+= renderDataInTable(currentTableData);
            templateString+= `</tbody>`;
            /**
             * create a pagination box. 
             */
            const pagiNationNavElem = document.querySelector("#pagination-nav");
            const totalPages = Math.ceil(tableData.length / pageSize);
            let paginationBarTemplate = `<ul class="pagination justify-content-center">
            <li class="page-item disabled">
                <a class="page-link" href="" tabindex="-1">Previous</a>
            </li>`;

            /**
             * maximum no. allowed is until 5
             */
            for(let i=1; i<=totalPages;i++) {
                if(i<=5) {
                    paginationBarTemplate+= `${i === 1 ? 
                        `<li class="page-item active"><a class="page-link" href="">${i}</a></li>` 
                    : `<li class="page-item"><a class="page-link" href="">${i}</a></li>`}`;
                }
            }

            paginationBarTemplate+= `<li class="page-item">
                <a class="page-link" href="#">Next</a>
            </li>
            </ul>`;
            pagiNationNavElem.innerHTML = paginationBarTemplate;
            createEventListners(totalPages);

        } else {
            templateString+= `<tbody>`;
            templateString+= renderDataInTable(tableData);
            templateString+= `</tbody>`;
        }

        table.innerHTML = templateString;
    }

};

/**
 * @param : data - array of objects     
 */
renderDataInTable = (data) => {

    let tbodyTemplateString = ``;
    let typeofValue = '';

    //loop over all the rows.
    for(let i=0; i<data.length; i++ ) {
        tbodyTemplateString+= `<tr>`;
        for(let j=0; j<defineTableColumns.length; j++) {
            if(data[i].hasOwnProperty(defineTableColumns[j].fieldName)) { // if property exists. 
                typeofValue = typeof(data[i][defineTableColumns[j].fieldName]);
                tbodyTemplateString+= `${typeofValue === 'object' ? `<td class="show-more" onclick="showMoreDetails(event,${data[i].userID})">Show more</td>` :
                `<td>${data[i][defineTableColumns[j].fieldName]}</td>`}`;
            }
        }
        tbodyTemplateString+= `</tr>`;
    }
    return tbodyTemplateString;
}

/**
 * function to create Event Listners for pagination items.
 * @param : totalPages : total No of pages based on pageSize.
 */
createEventListners = (totalPages) => {
    /**
     * Function to perform Pagination.
     */

    let pageLinks = document.querySelectorAll(".page-item");
    const tableBody = document.querySelector("#app_table").getElementsByTagName("tbody");
    let currentTableData = [];
    let templateForBody = '';

    for(let i=0; i<pageLinks.length; i++) {
        pageLinks[i].addEventListener('click', (event) => { 
            
            event.preventDefault(); // prevent from reloading the page.
            
            // if undefined then return.
            if(event.target.text === undefined || event.target.text === null) {
                return;
            }
            
            // handle case of previous.
            if(event.target.text === 'Previous' && currentPage !== 1) {
                // move backward.
                currentTableData = [];
                currentTableData = self.tableRows.slice(Number((currentPage-2)*pageSize),Number((currentPage-2)*pageSize + pageSize -1));
                pageLinks[currentPage].classList.remove("active");
                currentPage = Number(currentPage) - 1;
                pageLinks[pageLinks.length -1].classList.remove("disabled");
            }
            
            // handle case of next
            if(event.target.text === 'Next' && currentPage !== totalPages) {
                // move forward
                currentTableData = [];
                currentTableData = self.tableRows.slice(Number(currentPage*pageSize),Number(currentPage*pageSize + pageSize -1));
                pageLinks[currentPage].classList.remove("active");
                pageLinks[0].classList.remove("disabled");
                currentPage = Number(currentPage) + 1;
            }

            if(event.target.text !== 'Previous' && event.target.text !== 'Next') {
                currentTableData = [];
                currentTableData = self.tableRows.slice(Number((event.target.text - 1)*pageSize),Number((event.target.text - 1)*pageSize + pageSize));
                pageLinks[currentPage].classList.remove("active");
                currentPage = Number(event.target.text);
                pageLinks[0].classList.remove("disabled");
                pageLinks[pageLinks.length -1].classList.remove("disabled");
            }

            if (currentPage === 1) {
                pageLinks[0].classList.add("disabled");
            }

            if (currentPage === totalPages) {
                pageLinks[pageLinks.length -1].classList.add("disabled");
            }

            pageLinks[currentPage].classList.add("active");
            templateForBody+= renderDataInTable(currentTableData);
            tableBody[0].innerHTML = templateForBody;
            templateForBody = ''
        });
    }

}

/**
 * Function to sort column
 * @param: event
 * @param: columnNumber - for which column sorting is require to be peformed.
 */

columnLevelSorting = (event,columnNumber) => {
    /**
     * get necessary reference.
     */
    let currentDisplayedData = [];
    const tableBody = document.querySelector("#app_table").getElementsByTagName("tbody");
    const sortDataType = defineTableColumns[columnNumber].type;
    const sortType = defineTableColumns[columnNumber].sort;
    const arrowSpan = document.querySelectorAll(".sort-arrow");
    const uparrowSpan = document.querySelector(".sort-ascending-col-"+columnNumber);
    const downarrowSpan = document.querySelector(".sort-descending-col-"+columnNumber);
    if(pagiNation) {
       currentDisplayedData = self.tableRows.slice(Number((currentPage - 1)*pageSize),Number((currentPage - 1)*pageSize + pageSize));
    } else {
        currentDisplayedData = self.tableRows.slice(0);
    }
    
    // remove arrows
    for(let i=0;i< arrowSpan.length; i++) {
        arrowSpan[i].setAttribute('style','display:none !important');
    }

    // decide sorttype
    if(sortType === 'asc') {
        
        // decide type of the data for column.
        switch(sortDataType) {
            /**
             * For string - convert each data entery to to lowercase and then do comparison.
             */
            case 'string':
                currentDisplayedData.sort(function(a,b) {
                    let x = a[defineTableColumns[columnNumber].fieldName].toLowerCase();
                    let y = b[defineTableColumns[columnNumber].fieldName].toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                break;
            /**
             * For number - convert each data entery to to number and then do comparison.
             */
            case 'number':
                currentDisplayedData.sort(function(a,b) {
                    let x = Number(a[defineTableColumns[columnNumber].fieldName]);
                    let y = Number(b[defineTableColumns[columnNumber].fieldName]);
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                break;
            /**
             * For date - convert each data entery to to date and then do comparison.
             */
            case 'date':
                currentDisplayedData.sort(function(a,b) {
                    let x = new Date(a[defineTableColumns[columnNumber].fieldName]);
                    let y = new Date(b[defineTableColumns[columnNumber].fieldName]);
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                break;
            /**
             * For Boolean - convert each data entery to to string and then do comparison.
             */
            case 'boolean':
                currentDisplayedData.sort(function(a,b) {
                    let x = a[defineTableColumns[columnNumber].fieldName].toString().toLowerCase();
                    let y = b[defineTableColumns[columnNumber].fieldName].toString().toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                break;
            default:
        }
        // set sort value to be opposite.
        defineTableColumns[columnNumber].sort = 'desc';
        //set style
        uparrowSpan.setAttribute('style', 'display : inline !important');
        downarrowSpan.setAttribute('style', 'display : none !important');   
    } else {
        // decide type of the data for column.
        switch(sortDataType) {
            /**
             * For string - convert each data entery to to lowercase and then do comparison.
             */
            case 'string':
                currentDisplayedData.sort(function(a,b) {
                    let x = a[defineTableColumns[columnNumber].fieldName].toLowerCase();
                    let y = b[defineTableColumns[columnNumber].fieldName].toLowerCase();
                    return x > y ? -1 : x < y ? 1 : 0;
                });
                break;
            /**
             * For number - convert each data entery to to number and then do comparison.
             */
            case 'number':
                currentDisplayedData.sort(function(a,b) {
                    let x = Number(a[defineTableColumns[columnNumber].fieldName]);
                    let y = Number(b[defineTableColumns[columnNumber].fieldName]);
                    return x > y ? -1 : x < y ? 1 : 0;
                });
                break;
            /**
             * For date - convert each data entery to to date and then do comparison.
             */
            case 'date':
                currentDisplayedData.sort(function(a,b) {
                    let x = new Date(a[defineTableColumns[columnNumber].fieldName]);
                    let y = new Date(b[defineTableColumns[columnNumber].fieldName]);
                    return x > y ? -1 : x < y ? 1 : 0;
                });
                break;
            /**
             * For Boolean - convert each data entery to to string and then do comparison.
             */
            case 'boolean':
                currentDisplayedData.sort(function(a,b) {
                    let x = a[defineTableColumns[columnNumber].fieldName].toString().toLowerCase();
                    let y = b[defineTableColumns[columnNumber].fieldName].toString().toLowerCase();
                    return x > y ? -1 : x < y ? 1 : 0;
                });
                break;
            default:
        }
        // set sort value to be opposite.
        defineTableColumns[columnNumber].sort = 'asc';
        //set style
        downarrowSpan.setAttribute('style', 'display : inline !important');
        uparrowSpan.setAttribute('style', 'display : none !important');
    }
    tableBody[0].innerHTML = renderDataInTable(currentDisplayedData);
}

/**
 * Function to filter Rows based on the input entered in search box
 * @param: event : keyUP event.
 * @return: will set display property to show and hide the row
 */


ListenForGlobalFilters= (event) => {
    
    document.querySelector("#searchRows").addEventListener('keyup',(event)=>{
        const table = document.querySelector("#app_table");
        const searchBoxValue = document.querySelector("#searchRows").value.toUpperCase();
        const tableRows = table.getElementsByTagName("tr");
        let tableColumns,singleColumn,i,j;
        for (i = 0; i < tableRows.length; i++) {
            tableColumns = tableRows[i].getElementsByTagName("td");
            for(j=0; j < tableColumns.length; j++) {
                singleColumn = tableColumns[j];
                if (singleColumn) {
                    if (singleColumn.innerHTML.toUpperCase().indexOf(searchBoxValue) > -1) {
                        tableRows[i].style.display = "table-row";
                        break;
                    } else {
                        tableRows[i].style.display = "none";
                    }
                } 
            }
                  
        }
    });
}

/**
 * Function to support column level filtering for each column.
 * @param: event : keyUP event.
 * @param: columnNumber: number of the column
 * @return: will set display property to show and hide the column from table.
 */

columnLevelFiltering = (event, columNumber) => {
    
    // not require to run when tab is pressed.
    if (event.key === 'Tab') {
        return;
    }
    const table = document.querySelector("#app_table");
    const searchBoxValue = table.querySelector("#column_"+(columNumber+1)).value.toUpperCase();
    const tr = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    let td,i;
    for (i = 0; i < tr.length; i++) {  
        if(tr) {
            td = tr[i].getElementsByTagName("td")[columNumber];
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(searchBoxValue) > -1) {
                    tr[i].style.display = "table-row";
                } else { 
                    tr[i].style.display = "none";
                }
            }
        }          
    }
}

/**
 * @param: object contains the extra data that we want to show in pop-up
 */

showMoreDetails = (e,userID) => {
    let correctRow = self.tableRows.find(x => x.userID === userID);
    const modal = document.querySelector(".modal");
    const modalBody = document.querySelector(".modal-body");
   
    letmodalTemplateString = `<table class="table-striped table-bordered table-hover table-modal"><thead><tr>`;
    
    for(let key in correctRow.address) {
        if(correctRow.address.hasOwnProperty(key)) {
            letmodalTemplateString += `<th>${key}</th>`;
        }
    }

    letmodalTemplateString += '</tr></thead>';

    letmodalTemplateString += '<tbody><tr>';
    
    for(let key in correctRow.address) {
        if(correctRow.address.hasOwnProperty(key)) {
            letmodalTemplateString += `<td>${correctRow.address[key]}</td>`;
        }
    }

    letmodalTemplateString += '</tr></tbody></table>';

    modalBody.innerHTML = letmodalTemplateString;
    modal.setAttribute('style','display: block !important');  
};

/**
 * Function to close the modal pop-up
 */
closeModal = () => {
    const modal = document.querySelector(".modal");
    modal.setAttribute('style','display: none !important');
}