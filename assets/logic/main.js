const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];
const quill = new Quill('#txt-area', {
    theme: 'snow',
    modules: {
        toolbar: false
    }

});


// start up fns 
// save_item_added()
// load_notebook_items()

let load_all_notes = []
const view_note_area = document.getElementById('txt-area')
const all_notes = document.getElementById('all_notes')
const current_opened = document.getElementById('filename')
let file_on_edit = ""
let keyword_search = document.getElementById('search-input')
const search_return = document.getElementById('recent_opened')
let notes_found = [];
const go_search = document.getElementById('go-search')
const right_click_menu = document.getElementById('right-click-tools')
const side_menu = document.getElementById('side-menu')
const deleted_items = document.getElementById("deleted_items")

// loading and filling by IISF
load_all_from_local()
filling_after_loading_from_local()
// looping through local storage and collect all save note by name binding them to array ==> load_all_notes 
function load_all_from_local() {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) == 'null' || localStorage.key(i) == "NULL") continue
        load_all_notes[i] = localStorage.key(i)
    }
    // console.log(load_all_notes)

}
// open specific note by name 
function open_specific_note(note) {
    if (go_search.style.display == 'block') go_search.style.display = 'none'
    current_opened.innerHTML = "";
    current_opened.innerText += `File Name : 📁 ${note}`;
    file_on_edit = note;
    let note_data = localStorage.getItem(note);
    view_note_area.innerHTML = JSON.parse(note_data);
}

// filling the all notes item with all notes 
function filling_after_loading_from_local() {
    all_notes.innerHTML = ""
    let container_for_notes = ""

    for (let o = 0; o < load_all_notes.length; o++) {
        let note_name = localStorage.key(o);
        // let note_name = load_all_notes[o]
        if (note_name == null) continue
        if (note_name.startsWith("del")) {
            deleted_items.innerHTML = ""
            for (let i = 0; i < localStorage.length; i++) {
                if (localStorage.key(i).startsWith("del")) {
                    // deleted ones 

                    deleted_items.innerHTML += `<li onclick="open_specific_note('${localStorage.key(i)}')" class="ps-2"> 🛑${localStorage.key(i)} </li>`
                }
            }
        }
        else
            container_for_notes += `<li onclick="open_specific_note('${note_name}')" class="ps-2"> ✅ ${note_name.split(/\s+/).slice(0, 3).join(' ')} </li>`

    }
    all_notes.innerHTML = container_for_notes;
}

// save new note to local storage and ask customer for name to save it 
function save_current_note() {
    let pick_name = prompt("enter a name for the note : ")
    if (!(pick_name == "") && !(pick_name == null) && !(pick_name == undefined)) {
        localStorage.setItem(pick_name, JSON.stringify(view_note_area.innerHTML))

        ply_new_sound()
        clear_after_action()
        load_all_from_local()
        filling_after_loading_from_local()
    }

}

// clear text area after save 
function clear_after_action() {
    quill.setText("");
    quill.focus()
}

// delete note 
function del_note() {
    let answer_del = prompt(`You are Sure ${current_opened} is going to Trash forever y or n`)
    if (answer_del == 'y' || answer_del == "Y" || answer_del == "yes" || answer_del == "YES") {
        localStorage.setItem(`del-${file_on_edit}`, JSON.stringify(view_note_area.innerHTML))
        localStorage.removeItem(file_on_edit)

        ply_del_sound()
        clear_after_action()
        load_all_from_local()
        filling_after_loading_from_local()

    } else {

    }
}

// sounds 
function ply_del_sound() {
    let trash = new Audio("assets/resources/sounds/trash.mp3")
    trash.play()
}

function ply_new_sound() {
    let new_records = new Audio("assets/resources/sounds/new.mp3")
    new_records.play()
}
// search function 
keyword_search.addEventListener("keyup", search_by_name)
function search_by_name() {
    let searching_for = keyword_search.value
    notes_found = load_all_notes.filter((element) => {
        return element.toLowerCase().startsWith(searching_for.toLowerCase())
    })
    // console.log(notes_found)
    show_search_result()
}

function show_search_result() {
    search_return.innerHTML = ""
    for (let index = 0; index < notes_found.length; index++) {
        search_return.innerHTML += `<li onclick="open_specific_note('${notes_found[index]}')"> ${notes_found[index]} </li>`

    }
}

//go for search 
function show_search_panel() {
    // check if there is file opened or not 
    if (file_on_edit == "") {
        if (go_search.style.display == 'block') {
            go_search.style.display = 'none'
        } else {
            go_search.style.display = 'block'
            document.getElementById("search-input").focus()
            go_search.style.top = '10%'
            go_search.style.left = '30%'
            go_search.style.zIndex = '1'
            // go_search.style.height = '5%'


            go_search.style.transform = 'transalate(-50%,0)'
        }
    } else {
        console.log(file_on_edit)
        if (go_search.style.display == 'block') {
            go_search.style.display = 'none'
        } else {
            go_search.style.display = 'block'
            document.getElementById("search-input").focus()
            go_search.style.top = '10%'
            go_search.style.left = '30%'
            go_search.style.zIndex = '1'
            // go_search.style.height = '5%'


            go_search.style.transform = 'transalate(-50%,0)'


        }

        function searchNote() {
            let note = document.getElementById("txt-area").value; // get note text
            let query = document.getElementById("search-input").value;

            if (note.includes(query)) {
                alert("Found!");
            } else {
                alert("Not found.");
            }
        }
        searchNote()
    }


}



// search through current note 

//show edit tools bar 
const toolbar = document.getElementById("custom-toolbar");

function applyFormat(format, value = true) {
    const range = quill.getSelection();
    if (range && range.length > 0) {
        quill.format(format, value);
    }
}

function insertLink() {
    const range = quill.getSelection();
    if (range && range.length > 0) {
        const url = prompt("Enter URL:");
        if (url) quill.format('link', url);
    }
}

function clearFormat() {
    const range = quill.getSelection();
    if (range && range.length > 0) {
        quill.removeFormat(range.index, range.length);
    }
}


quill.on('selection-change', function (range) {
    if (range && range.length > 0) {
        const bounds = quill.getBounds(range);
        toolbar.style.top = (bounds.top + window.scrollY + 100) + "px";
        toolbar.style.left = (bounds.right + bounds.width / 2 + window.scrollX + 100) + "px";
        toolbar.style.display = "flex";
    } else {
        toolbar.style.display = "none";
    }
});

// Hide if clicked outside
document.addEventListener("mousedown", (e) => {
    if (!toolbar.contains(e.target)) {
        toolbar.style.display = "none";
    }
});

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Start dragging on mousedown
toolbar.addEventListener('mousedown', function (e) {
    isDragging = true;
    // Calculate cursor offset relative to toolbar top-left
    offsetX = e.clientX - toolbar.getBoundingClientRect().left;
    offsetY = e.clientY - toolbar.getBoundingClientRect().top;
    toolbar.style.transition = 'none'; // disable smooth transition while dragging
});

// Dragging
document.addEventListener('mousemove', function (e) {
    if (isDragging) {
        toolbar.style.left = (e.clientX - offsetX) + "px";
        toolbar.style.top = (e.clientY - offsetY) + "px";
    }
});

// Stop dragging
document.addEventListener('mouseup', function (e) {
    if (isDragging) {
        isDragging = false;
        toolbar.style.transition = ''; // re-enable transition if needed
    }
});
// view menu when right click 
view_note_area.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    if (right_click_menu.style.display == 'block') { right_click_menu.style.display = 'none' }
    else {
        right_click_menu.style.display = 'block'
    }
})

// create new 

function create_new() {
    location.reload()

    // file_on_edit = null;      // reset tracking
    // quill.setContents([]);        // clear editor
    // quill.focus();                // focus editor
    // document.getElementById('txt-area').style.display = 'block';
    // view_note_area.innerHTML = localStorage.setItem('new',JSON.stringify("Enter New Content"))
}

// showing side menu
const aside = document.getElementById('aside')
function toggle_aside() {
    const current = aside.style.transform;
    // let edit_area = document.getElementById('edit-area').style.width


    if (current === 'translateX(0%)') {
        aside.style.transform = 'translateX(-99%)';
        view_note_area.style.marginLeft = '-220px'
    } else {
        aside.style.transform = 'translateX(0%)';

        view_note_area.style.marginLeft = '0'


    }
}


//add notebook
const notebook_main = document.getElementById('notebook-main')
const custome_menu = document.getElementById('custom-menu')
const new_item_inside_notebook_main = document.getElementById("inside_notebook")
const archive_main = document.getElementById("archive_main")
notebook_main.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    console.log("notebook main")
    custome_menu.classList.remove('d-none')
    custome_menu.style.top = `${e.pageY}px`
    custome_menu.style.left = `${e.pageX}px`
    custome_menu.classList.add('d-block')

})

archive_main.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    console.log("notebook main")
    custome_menu.classList.remove('d-none')
    custome_menu.style.top = `${e.pageY}px`
    custome_menu.style.left = `${e.pageX}px`
    custome_menu.classList.add('d-block')

})





function load_new_added_addevent() {
    load_notebook_items()
    const all_new_items_main_notebook = document.querySelectorAll('#inside_notebook li');
    all_new_items_main_notebook.forEach(element => {
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            custome_menu.classList.remove('d-none')
            custome_menu.style.top = `${e.pageY}px`
            custome_menu.style.left = `${e.pageX}px`
            custome_menu.classList.add('d-block')
        })
    })
}


function right_menu() {
    (e) => {

        // e.preventDefault();
        alert(element)

        custome_menu.style.top = `${e.pageY}px`;
        custome_menu.style.left = `${e.pageX}px`;
        custome_menu.classList.remove('d-none');
    };
}



document.addEventListener("click", () => {
    custome_menu.classList.remove('d-block')
    custome_menu.classList.add('d-none')

})

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        custome_menu.classList.remove("d-block");
        custome_menu.classList.add("d-none");
    }
});

// logic for context menu for notebook 

function add_new(label, label_type) {
    let notebook_main_add = document.getElementById('inside_notebook')
    switch (label_type) {
        case "notebook":
            console.log("hay ", label, label_type)
            notebook_main_add.innerHTML += `<li class="ps-2"> ➡📒 ${label}</li>`
            save_item_added()
            load_notebook_items()
            break;
        case "label":
            console.log("hay label", label, label_type)
            notebook_main_add.innerHTML += `<li class="ps-2"> ➡🏷 ${label}</li>`
            save_item_added()
            load_notebook_items()
            break;
        case "note":
            console.log("hay note", label, label_type)
            notebook_main_add.innerHTML += `<li class="ps-2" onclick="open_specific_note('${label}')"> ➡📝 ${label}</li>`
            save_item_added()
            load_notebook_items()
            break

    }
}

// save added items to main side bar 


function save_item_added() {
    console.log(new_item_inside_notebook_main.innerHTML)
    localStorage.setItem("notebook_item", new_item_inside_notebook_main.innerHTML)
}

// load notebook_item
function load_notebook_items() {
    let saved = localStorage.getItem("notebook_item")
    if (saved) {
        new_item_inside_notebook_main.innerHTML = saved
    } else {
        ""
    }


}

load_notebook_items()
load_new_added_addevent()


// new menu 
// const contextMenu = document.querySelector("#custom-menu"),
// shareMenu = contextMenu.querySelector(".share-menu");

// window.addEventListener("contextmenu", e => {
//     e.preventDefault();
//     let x = e.offsetX, y = e.offsetY,
//     winWidth = window.innerWidth,
//     winHeight = window.innerHeight,
//     cmWidth = contextMenu.offsetWidth,
//     cmHeight = contextMenu.offsetHeight;

//     if(x > (winWidth - cmWidth - shareMenu.offsetWidth)) {
//         shareMenu.style.left = "-200px";
//     } else {
//         shareMenu.style.left = "";
//         shareMenu.style.right = "-200px";
//     }

//     x = x > winWidth - cmWidth ? winWidth - cmWidth - 5 : x;
//     y = y > winHeight - cmHeight ? winHeight - cmHeight - 5 : y;

//     contextMenu.style.left = `${x}px`;
//     contextMenu.style.top = `${y}px`;
//     contextMenu.style.visibility = "visible";
// });

// document.addEventListener("click", () => contextMenu.style.visibility = "hidden");

// show aside
function show_aside() {
    const aside_menu = document.getElementById("aside")
    if (aside_menu.classList.contains('d-block')) {
        aside_menu.classList.remove('d-block')
        aside_menu.style.width ='25%'
        aside_menu.style.height= '100vh'
        aside_menu.classList.add('d-none')
    }else{
         aside_menu.classList.remove('d-none')
        aside_menu.classList.add('d-block')
    }
}