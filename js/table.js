
//Build Tabulator

let Query

//define row context menu contents
var rowMenu = [
    {
        label:"<i class='fas fa-user'></i> Null",
        action:function(e, row){
            // column.move("id", true)
            // column.move("id", true)
            // console.log('%c%s', 'color: #00e600', cell.column.n);
            // table.moveColumn("Client", "Static", true)
        }
    },
    {
        label:"<i class='fas fa-check-square'></i> Select Row",
        action:function(e, row){
            // console.log(row.getPosition(true))
            row.select()
        }
    },
    {
        separator:true,
    },
    {
        label:"Admin Functions",
        menu:[
            {
                label:"<i class='fas fa-trash'></i> Delete Row",
                action:function(e, row){
                    row.delete()
                }
            },
            {
                label:"<i class='fas fa-ban'></i> Disabled Option",
                disabled:true,
            },
        ]
    }
]

//define column header menu as column visibility toggle
var headerMenu = function(){
    var menu = []
    var columns = this.getColumns()

    for(let column of columns){
    // console.log('column', column.getDefinition().title)

        //create checkbox element using font awesome icons
        let icon = document.createElement("i")
        icon.classList.add("fas")
        icon.classList.add(column.isVisible() ? "fa-check-square" : "fa-square")

        //build label
        let label = document.createElement("span")
        let title = document.createElement("span")

        title.textContent = " " + column.getDefinition().title

        label.appendChild(icon)
        label.appendChild(title)

        //create menu item
        menu.push({
            label:label,
            action:function(e){
                //prevent menu closing
                e.stopPropagation()

                //toggle current column visibility
                column.toggle()
                table.redraw()

                //change menu item icon
                if(column.isVisible()){
                    icon.classList.remove("fa-square")
                    icon.classList.add("fa-check-square")
                }else{
                    icon.classList.remove("fa-check-square")
                    icon.classList.add("fa-square")
                }
            }
        })
    }

    return menu
}

//Create Date Editor
var dateEditor = function(cell, onRendered, success, cancel){
    //cell - the cell component for the editable cell
    //onRendered - function to call when the editor has been rendered
    //success - function to call to pass the successfuly updated value to Tabulator
    //cancel - function to call to abort the edit and return to a normal cell

    //create and style input
    var cellValue = moment(cell.getValue(), "YYYY-MM-DD HH:ii").format("YYYY-MM-DD"),
    input = document.createElement("input")

    input.setAttribute("type", "date")

    input.style.padding = "4px"
    input.style.width = "100%"
    input.style.boxSizing = "border-box"

    input.value = cellValue

    onRendered(function(){
        input.focus()
        input.style.height = "100%"
    })

    function onChange(){
        if(input.value != cellValue){
            success(moment(input.value, "YYYY-MM-DD HH:ii").format("YYYY-MM-DD"))
        }else{
            cancel()
        }
    }

    //submit new value on blur or change
    input.addEventListener("blur", onChange)

    //submit new value on enter
    input.addEventListener("keydown", function(e){
        if(e.keyCode == 13){
            onChange()
        }

        if(e.keyCode == 27){
            cancel()
        }
    })

    return input
}

var hideIcon = function(cell, formatterParams, onRendered){ 
    return "<i class='far fa-plus-square'></i>"
}

//Define variables for input elements
var fieldEl = document.getElementById("filter-field");
var typeEl = document.getElementById("filter-type");
var valueEl = document.getElementById("filter-value");

//Custom filter example
function customFilter(data) {
    return data.car && data.rating < 3;
}

//Trigger setFilter function with correct parameters
function updateFilter() {
    var filterVal = fieldEl.options[fieldEl.selectedIndex].value;
    var typeVal = typeEl.options[typeEl.selectedIndex].value;

    var filter = filterVal == "function" ? customFilter : filterVal;

    if (filterVal == "function") {
        typeEl.disabled = true;
        valueEl.disabled = true;
    } else {
        typeEl.disabled = false;
        valueEl.disabled = false;
    }

    if (filterVal) {
        table.setFilter(filter, typeVal, valueEl.value);
    }
}

//Update filters on value change
document.getElementById("filter-field").addEventListener("change", updateFilter);
document.getElementById("filter-type").addEventListener("change", updateFilter);
document.getElementById("filter-value").addEventListener("keyup", updateFilter);

//Clear filters on "Clear Filters" button click
document.getElementById("filter-clear").addEventListener("click", function() {
    fieldEl.value = "";
    typeEl.value = "=";
    valueEl.value = "";

    table.clearFilter();
});

var table = new Tabulator("#example-table", {

    // height: 'calc(100vh - 193px)',
    height: 700,
    layout:"fitDataTable",
    // responsiveLayout:"collapse",
    movableColumns:true,
    movableRows:false,
    selectable:true,
    selectableRangeMode:"click",
    rowContextMenu: rowMenu,
    // groupBy:"Status",
    // groupStartOpen:false,
    history:true,
    pagination:"local",
    ajaxURL: './Tabulator-Data.json',
    // ajaxURL:`http://localhost:3000/api?find=${Query}`,
    // ajaxFiltering:false,
    // ajaxSorting:false,
    // ajaxParams:{find:`{ "${queryKey}": ${queryVal} }`}, // fail - number is not string
    // ajaxConfig:"POST",
    // ajaxParams:{token:"ABC123"}, //set any standard parameters to pass with the request
    // paginationInitialPage:8, //optional parameter to set the initial page to load  
    // paginationDataSent:{
    //     "size": "limit"
    // } ,
    printAsHtml:true, //enable html table printing
    printStyled:true, //copy Tabulator styling to HTML table
    printRowRange:"selected", //change default selector to selected - "Active" is default for filtered
    printConfig:{
        columnHeaders:true,
        columnGroups:true,
        rowGroups:true,
        columnCalcs:true, 
        formatCells:true,
    },
    printHeader:"<h1>Example Table Header<h1>", // set header content on printed table
    printFooter:"<h2>Example Table Footer<h2>",

    downloadRowRange:"selected", //change default selector to selected - "Active" is default for filtered
    downloadConfig:{
        columnHeaders:false, //do not include column headers in downloaded table
        columnGroups:false, //do not include column groups in column headers for downloaded table
        rowGroups:false, //do not include row groups in downloaded table
        columnCalcs:false, //do not include column calcs in downloaded table
    },

    paginationSize:10,
    paginationSizeSelector:[5, 10, 25, 50, 100, 1000],
    paginationAddRow:"table", //add rows relative to the table
    persistenceID:"DS5Table",
    persistence:{
        sort: true, //persist column sorting
        // filter: true, //persist filter sorting
        // group: true, //persist row grouping
        page: true, //persist page
        columns: true, //persist columns
    },
    columnHeaderVertAlign:"bottom", //align header contents to bottom of cell
    columns:[
        {//create column group
            title:"Static",
            frozen:true,
            headerMenu:headerMenu, //add a menu to this column header
            columns:[
                {formatter:hideIcon, hozAlign:"center", title:"Info", headerVertical:'flip', headerSort:false, resizable:false, print:false, download:false, cellClick:function(e, row, formatterParams){
                    const id = row.getData().id
                    row.getElement().classList.toggle("table-dark")
                    const el = document.querySelector(".subTable" + id + "")
                    el.classList.toggle('hide')
                    if (!el.classList.contains('hide')) {
                        row.getElement().innerHTML = "<i class='far fa-minus-square'></i>"
                    } else {
                        row.getElement().innerHTML = "<i class='far fa-plus-square'></i>"
                    }
                }},
                {formatter:hideIcon, hozAlign:"center", title:"File", headerVertical:'flip', headerSort:false, resizable:false, print:false, download:false, cellClick:function(e, row, formatterParams){
                    const id = row.getData().id
                    row.getElement().classList.toggle("table-dark")
                    const el = document.querySelector(".subTables" + id + "")
                    el.classList.toggle('hide')
                    if (!el.classList.contains('hide')) {
                        row.getElement().innerHTML = "<i class='far fa-minus-square'></i>"
                    } else {
                        row.getElement().innerHTML = "<i class='far fa-plus-square'></i>"
                    }
                }},
                {formatter:hideIcon, hozAlign:"center", title:"Form", headerVertical:'flip', headerSort:false, resizable:false, print:false, download:false, cellClick:function(e, row, formatterParams){
                    const id = row.getData().id
                    row.getElement().classList.toggle("table-dark")
                    const el = document.querySelector(".subTabled" + id + "")
                    el.classList.toggle('hide')
                    if (!el.classList.contains('hide')) {
                        row.getElement().innerHTML = "<i class='far fa-minus-square'></i>"
                    } else {
                        row.getElement().innerHTML = "<i class='far fa-plus-square'></i>"
                    }
                }},                
                {title:"ID", field:"id", sorter:"number", minWidth:68, print:true, download:true, validator:"unique", resizable:true, 
                    cellClick:function(e, cell){ alert("cell clicked - " + cell.getValue())}, headerContext:function(e, column){
                        e.preventDefault()
                        console.log('%c%s', 'color: #00a3cc', column.getDefinition().title + ' had a right-click');
                        // cell.getColumn().getDefinition().title
                        // column.move("id", true)
                    },
                },
            ],
        },
        {//create column group
            title:"Status",
            headerMenu:headerMenu, //add a menu to this column header
            columns:[
                {title:"Created On", field:"AccountCreated", sorter:"date", headerSortTristate:true, width:130, visible:true, formatter:"datetime", formatterParams:{
                    inputFormat:"YYYY-MM-DD HH:ii",
                    outputFormat:"DD/MM/YYYY",
                    invalidPlaceholder:"(invalid date)"
                }},
                {title:"Edited On", field:"LastUpdated", sorter:"date", headerSortTristate:true, width:130, visible:true, editor:dateEditor, formatter:"datetime", formatterParams:{
                    inputFormat:"YYYY-MM-DD HH:ii",
                    outputFormat:"DD/MM/YYYY",
                    invalidPlaceholder:"(invalid date)"
                }, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"Status", field:"Status", width:120, visible:true, editor:"select", headerSortTristate:true, 
                    editorParams:{
                        listItemFormatter:function(value, title){ //prefix all titles with the word "Mr"
                            return "=>" + title
                        },
                        values:["Choose...", "Active", "Inactive", "Pending", "Archived", "For Deletion"], //create list of values from all values contained in this column
                        defaultValue:"Choose...", //set the value that should be selected by default if the cells value is undefined
                        elementAttributes:{
                            maxlength:"12", //set the maximum character length of the input element to 10 characters
                        },
                        verticalNavigation:"hybrid", //navigate to new row when at the top or bottom of the selection list
                        multiselect:false, //allow multiple entries to be selected
                    }, 
                    editable:false, cellDblClick:function(e, cell){cell.edit(true)}
                },
            ],
        },
        {//create column group
            title:"Client", 
            headerMenu:headerMenu, //add a menu to this column header
            columns:[
                {title:"Company", field:"Company", width:150, visible:true, editor:true, headerSortTristate:true, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"Prefix", field:"Prefix", width:100, visible:true, editor:"select", headerSortTristate:true, editorParams:{
                    values:["Choose...", "Mr", "Mrs", "Miss", "Ms", "Prof", "Dr", "Sir", "Lady", "Pastor"],
                    defaultValue:"Choose..."
                }, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"First Name", field:"FirstName", editor:"input", width:150, visible:true, headerSortTristate:true, validator:"required", editorParams:{
                    search:true,
                    elementAttributes:{
                        maxlength:"10", //set the maximum character length of the input element to 10 characters
                    }
                }, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"Last Name", field:"LastName", width:150, visible:true, editor:true, headerSortTristate:true, validator:["minLength:3", "maxLength:10", "string"], editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
            ],
        },
        {//create column group
            title:"Address",
            headerMenu:headerMenu, //add a menu to this column header
            columns:[
                {title:"No.", field:"HouseNo", sorter:"number", width:80, visible:true, editor:true, headerSortTristate:true, validator:"integer", editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"Street", field:"Street", width:120, visible:true, editor:true, headerSortTristate:true, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"City", field:"City", width:120, visible:true, editor:true, headerSortTristate:true, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"County", field:"County", width:120, visible:true, editor:true, headerSortTristate:true, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"Postcode", field:"PostCode", width:120, visible:true, editor:true, headerSortTristate:true, validator:"required", editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"Country", field:"Country", width:150, visible:true, editor:true, headerSortTristate:true, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
            ],
        },
        {//create column group
            title:"Meetings",
            headerMenu:headerMenu, //add a menu to this column header
            columns:[
                {title:"Last Meeting", field:"LastMeeting", sorter:"date", headerSortTristate:true, width:150, visible:true, editor:dateEditor, 
                formatter:"datetime", formatterParams:{
                    inputFormat:"YYYY-MM-DD HH:ii",
                    outputFormat:"DD/MM/YYYY",
                    invalidPlaceholder:"(invalid date)"
                }, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"Next Meeting", field:"NextMeeting", sorter:"date", headerSortTristate:true, width:150, visible:true, editor:dateEditor, formatter:"datetime", formatterParams:{
                    inputFormat:"YYYY-MM-DD HH:ii",
                    outputFormat:"DD/MM/YYYY",
                    invalidPlaceholder:"(invalid date)"
                }, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
            ],
        },
        {//create column group
            title:"Contact Information",
            headerMenu:headerMenu, //add a menu to this column header
            columns:[
                {title:"Business Line", field:"BusinessLine", width:170, visible:true, editor:true, headerSort:false, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"Home Phone", field:"HomePhone", width:150, visible:true, editor:true, headerSort:false, editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"Mobile Phone", field:"MobilePhone", width:150, visible:true, editor:true, headerSort:false, validator:"required", editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"Email", field:"Email", width:200, visible:true, headerSort:false, editor:"input", validator:["required", "regex:(?!.*[^a-z\\d\\n]{2})(^[^\\W_][\\w.-]{2,})(@[\\w.-]{2,})(\\.[a-z]{2,}$)"], editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"WebSite", field:"WebSite", width:200, visible:true, headerSort:false, editor:"input", validator:["required", "regex:((((f|ht){1}tp(s?):\\/\\/)|(www\\.))[a-zA-Z0-9\\-\\.]+(\\.[a-zA-Z]{2,6}(\\/\\S*)?$))"], editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"FaceBook", field:"Facebook", width:200, visible:true, headerSort:false, editor:"input", validator:["required", "regex:((((f|ht){1}tp(s?):\\/\\/)|(www\\.))[a-zA-Z0-9\\-\\.]+(\\.[a-zA-Z]{2,6}(\\/\\S*)?$))"], editable:false, cellDblClick:function(e, cell){cell.edit(true)}},
                {title:"Comments", field:"Comments", minWidth:500, print:true, download:true, visible:false},
            ],
        },        
    ],
    rowFormatter:function(row){
        //create and style holder elements
        var holder3El = document.createElement("div")
        var holder2El = document.createElement("div")
        var holderEl = document.createElement("div")
        var table3El = document.createElement("div")
        var table2El = document.createElement("div")
        var tableEl = document.createElement("div")

        const id = row.getData().id
        holder3El.setAttribute('class', "subTabled" + id + " hide")
        holder2El.setAttribute('class', "subTables" + id + " hide")
        holderEl.setAttribute('class', "subTable" + id + " hide")

        holder3El.appendChild(table3El)
        holder2El.appendChild(table2El)
        holderEl.appendChild(tableEl)

        row.getElement().appendChild(holderEl)
        row.getElement().appendChild(holder2El)        
        row.getElement().appendChild(holder3El)        

        var subTable = new Tabulator(tableEl, {
            // layout:"fitColumns",
            layout:"fitDataStretch",
            headerVisible:true,
            history:true,
            persistenceID:"DS5subTable",
            persistence:{
                columns: true, //persist columns
            },        
            data:row.getData().Info,
            columns:[
                {title:"Comments", field:"Comments", formatter:"textarea", width:400, headerSort:false, editor:"textarea", editorParams:{
                    verticalNavigation:"editor", //navigate cursor around text area without leaving the cell
                }, editable:false, cellDblClick:function(e, cell){cell.edit(true)}, 
                    cellEdited:function(cell) {row.update({'Comments':cell.getRow().getData().Comments})},
                },
                {title:"Charts", field:"Charts", width:300, print:true, headerSort:false, formatter:"image"},
            ]           
        })

        var subTable2 = new Tabulator(table2El, {
            // layout:"fitColumns",
            layout:"fitDataStretch",
            headerVisible:true,
            data:row.getData().Files,
            columns:[
                {title:"Documents", field:"Documents", 
                    width:440, headerSort:false, editable:false, print:true, cellDblClick:function(e, cell){cell.edit(true)}, 
                    formatter:"link", 
                    formatterParams:{
                        urlPrefix:"../images/" + id + "/",
                        download:true,
                    }
                }
            ]
        })

        var subTable3 = new Tabulator(table3El, {
            headerVisible:false, //hide header
            data:row.getData().Info,
            rowFormatter:function(row){ 

                var element = row.getElement(),
                data = row.getData(),
                rowDiv, formTemplate;

                //clear current row data
                while(element.firstChild) element.removeChild(element.firstChild);

                formTemplate = 
                `<div class="main-block">
                    <h1>Client Rating Form</h1>
                    <form action="/">
                        <div class="info">
                            <div class="info-item">
                                <label class="icon" for="name"><i class="fas fa-user"></i></label>
                                <input class="rating" type="text" name="name" id="name" placeholder="Name" required />
                            </div>
                            <div class="info-item">
                                <label class="icon" for="age"><i class="fas fa-calendar"></i></i></label>
                                <input class="rating" type="text" name="age" id="age" placeholder="Age" required />
                            </div>
                            <div class="info-item">
                                <label class="icon" for="email"><i class="fas fa-envelope"></i></label>
                                <input class="rating" type="text" name="email" id="email" placeholder="Email" required />
                            </div>
                            <div class="info-item">
                                <label class="icon" for="phone"><i class="fas fa-phone"></i></label>
                                <input class="rating" type="text" name="phone" id="phone" placeholder="Phone" required />
                            </div>
                        </div>
                        <div class="grade-type">
                            <h3>Client Rating</h3>
                            <div>
                                <input type="radio" value="none" id="radioOne" name="grade" checked />
                                <label for="radioOne" class="radio">Excellent</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="radio" value="none" id="radioTwo" name="grade" />
                                <label for="radioTwo" class="radio">Very Good</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="radio" value="none" id="radioThree" name="grade" />
                                <label for="radioThree" class="radio">Good</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="radio" value="none" id="radioFour" name="grade" />
                                <label for="radioFour" class="radio">Bad</label>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <input type="radio" value="none" id="radioFive" name="grade" />
                                <label for="radioFive" class="radio">Very Bad</label>
                            </div>
                        </div>
                        <div>
                            <h3>Please Comment on Your Rating</h3>
                            <textarea rows="4"></textarea>
                        </div>
                        <button class="wide" type="submit" href="/">Submit</button>
                    </form>
                </div`                

                rowDiv = document.createElement("div")
                rowDiv.innerHTML = formTemplate;
                element.append(rowDiv);                
            }
        })
        
    },   
    dataLoaded:function(data){
        data.forEach(function(row){
            table.updateRow(row.id, {'Comments':row.Info[0].Comments}) 
        })
    },    
    rowSelectionChanged:function(data, rows){
        //update selected row counter on selection change
        document.getElementById("select-stats").innerHTML = " [ Rows Selected : " + data.length + " ]"
    }
})

//undo button
document.getElementById("history-undo").addEventListener("click", function(){
    // var editedCells = table.getEditedCells()
  table.undo()
//   table.subTable.undo()
})

//redo button
document.getElementById("history-redo").addEventListener("click", function(){
   table.redo()
//    table.subTable.redo()
})

// Reset Local Storage
document.getElementById("resetColumns").addEventListener("click", function(){
    window.localStorage.removeItem("tabulator-DS5Table-columns")
    window.localStorage.removeItem("tabulator-DS5subTable-columns")
})

// Reset Local Storage
document.getElementById("resetSort").addEventListener("click", function(){
    window.localStorage.removeItem("tabulator-DS5Table-sort")
})

// Reset Local Storage
document.getElementById("resetFilter").addEventListener("click", function(){
    window.localStorage.removeItem("tabulator-DS5Table-filter")
    window.localStorage.removeItem("tabulator-DS5subTable-filter")
})

// Reset Local Storage
document.getElementById("resetPage").addEventListener("click", function(){
    window.localStorage.removeItem("tabulator-DS5Table-page")
})

// Reset Local Storage
document.getElementById("resetFull").addEventListener("click", function(){
    window.localStorage.clear() //clear all localstorage
})

//select row on "select all" button click
document.getElementById("select-page").addEventListener("click", function(){
    table.selectRow("active")
})

//select row on "select Visible" button click
document.getElementById("select-visible").addEventListener("click", function(){
    table.selectRow("visible")
})

//deselect row on "deselect all" button click
document.getElementById("deselect-all").addEventListener("click", function(){
    table.deselectRow()
})

//trigger download of data.csv file
document.getElementById("load-json").addEventListener("click", function(){
    table.setDataFromLocalFile(".json")
})

//trigger download of data.csv file
document.getElementById("download-csv").addEventListener("click", function(){
    table.download("csv", "data.csv")
})

//trigger download of data.json file
document.getElementById("download-json").addEventListener("click", function(){
    table.download("json", "data.json")
})

//trigger download of data.xlsx file
document.getElementById("download-xlsx").addEventListener("click", function(){
    table.download("xlsx", "data.xlsx", {sheetName:"My Data"})
})

//trigger download of data.pdf file
document.getElementById("download-pdf").addEventListener("click", function(){
    table.download("pdf", "data.pdf", {
        orientation:"portrait", //set page orientation to portrait
        title:"Example Report", //add title to report
    })
})

//trigger download of data.html file
document.getElementById("download-html").addEventListener("click", function(){
    table.download("html", "data.html", {style:true})
})

//print button
document.getElementById("print-table").addEventListener("click", function(){
    table.print(false, true)

})

// -------------------------------------------------------------------------------------------------------------------------

