var db_version = 1
var align_right = document.getElementById('user-switch').checked

document.getElementById('message-input').focus()

if ("serviceWorker" in navigator){
  navigator.serviceWorker.register("serviceworker.js")
    .then(function(registration){
      console.log("Service Worker registered with schope:", registration.scope)
    }).catch(function(err){
      console.log("Service Worker registration failed:", err)
    })
}

function texts_modal(){
  document.getElementById('modal_1_heading').innerHTML = "Intro Texts"
  document.getElementById('modal_1_content').style.display = "block"
  document.getElementById('modal_2_content').style.display = "none"
  getTexts(function(texts){
    var div = document.getElementById("text_list")
    div.innerHTML = ""
    if (texts.length > 0) {
      for (var text of texts){
        var innerhtml = `
          <div>
            <h2 id="title_${text.id}">${text.title}</h2>
            <p id="text_${text.id}">${text.text}</p>
          </div>
          <div>
            <button type="button" class="button-new" onclick="use_text(${text.id})"> Use </button>
            <button type="button" class="button-default" onclick="edit_text_modal(${text.id})"> Edit </button>
            <button type="button" class="button-delete" onclick="delete_text(${text.id})"> Delete </button>
          </div>
        `
        
        var innerdiv = document.createElement('div')
        innerdiv.id = "div_"+text.id
        innerdiv.innerHTML = innerhtml
        div.appendChild(innerdiv)
        div.appendChild(document.createElement('hr'))
      }
      window.ARIAmodal.resetFocusableElements('modal_1', 'modal_1_content')
    } else {
      div.appendChild(document.createTextNode("No Intro texts yet."))
    }
  })
  document.getElementById('modal_2_content').style.display = "none"
  close_menu()
}

function edit_text_modal(id){
  document.getElementById('modal_2_content').style.display = "block"
  document.getElementById('modal_1_content').style.display = "none"
  if (id) {
    document.getElementById('modal_1_heading').innerHTML = "Edit Intro Text"
    document.getElementById('inputId').value = id
    document.getElementById('inputText').value = document.getElementById('text_' + id).innerHTML
    document.getElementById('inputTitle').value = document.getElementById('title_' + id).innerHTML
  }
  else {
    document.getElementById('modal_1_heading').innerHTML = "New Intro Text"
  }
  
  window.ARIAmodal.resetFocusableElements('modal_1', 'modal_2_content')
}

function use_text(id){
  text = document.getElementById('text_' + id).innerHTML
  title = document.getElementById('title_' + id).innerHTML
  titleElem = document.createElement('h3')
  titleElem.innerHTML = title
  var display = document.getElementById('display')
  var message_div = document.createElement('div')
  message_div.appendChild(titleElem)
  message_div.appendChild(document.createTextNode(text))
  var auto_switch = document.getElementById('auto-switch').checked
  
  
  if(align_right){
    message_div.setAttribute('class', "display-message right")
    
  }else{
    message_div.setAttribute('class', "display-message")
    
  }
  if (auto_switch) {
    switch_user(!align_right)
  }
  display.appendChild(message_div)
  var size = document.getElementById('text-size').value
  change_size(size)
  
  window.ARIAmodal.closeModal()
}

function delete_text(id) {
  deleteFromObjectStore('texts', id)
  var div = document.getElementById('div_' + id)
  var hr = div.nextElementSibling
  div.style.display = 'none'
  hr.style.display = 'none'
}

function add_text(){
  var id = document.getElementById('inputId')
  var title = document.getElementById('inputTitle')
  var text = document.getElementById('inputText')
  if (title.value || text.value){
    if (id.value) {
      updateInObjectStore("texts", parseInt(id.value), {'title': title.value, 'text': text.value})
    }     
    else {
      addToObjectStore("texts", {'title': title.value, 'text': text.value})
    }
  }
  id.value = ""
  title.value = ""
  text.value = ""
  texts_modal()
}

// Set button to click.
var menu_button = document.getElementById( 'menu-toggle' )

// Click the button.
menu_button.onclick = toggle_menu

function toggle_menu() {
  // Toggle class "opened". Set also aria-expanded to true or false.
  if ( -1 !== menu_button.className.indexOf( 'opened' ) ) {
    close_menu()
  } else {
    open_menu()
  }
  
    
}

function open_menu() {
  menu_button.className += ' opened'
  menu_button.setAttribute( 'aria-expanded', 'true' )
  document.getElementById('nav-menu').classList.add('active')
}

function close_menu() {
  menu_button.className = menu_button.className.replace( ' opened', '' )
  menu_button.setAttribute( 'aria-expanded', 'false' )
  document.getElementById('nav-menu').classList.remove('active')
}
 
function share_chat(){
  toggle_menu()
  var currentDate = new Date()

  var date = currentDate.getDate()
  var month = currentDate.getMonth() //Be careful! January is 0 not 1
  var year = currentDate.getFullYear()

  var dateString = date + "-" +(month + 1) + "-" + year
  
  var messages = document.getElementsByClassName("display-message")
  var text = ""
  for (var message of messages){
    if (message.className.indexOf("right") === -1){
      text += "- " + message.innerText + "\n"
    } else {
      text += "* " + message.innerText + "\n"
    }
  }
  if (navigator.share) {
    navigator.share({
      title: 'Help Chat from ' + dateString,
      text: text,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error))
  } else {
    console.log(text)
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', "Helpchat_" + dateString + ".txt");

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
  
}



function change_size(value){
  if (value == 0) {
    value = 0.5
  }
  var messages = document.getElementsByClassName("display-message")
  for (var message of messages){
    message.style['font-size'] = value + "rem"
  }
  document.getElementById('message-input').scrollIntoView(false)
}

// change from dom to variable
function user_changed(checked){
  align_right = checked
  document.getElementById('message-input').focus()
}

// change of variable and dom
function switch_user(right){
  align_right = right
  document.getElementById('user-switch').checked = align_right
} 

function auto_switch_user(checked){
  if (checked) {
    var messages = document.getElementsByClassName("display-message")
    if (messages){
      var last_message = messages[messages.length - 1]
      var last_left = last_message.className.indexOf("right") === -1
      switch_user(last_left)
    }
  } else {
    switch_user(!align_right)
  }   
  document.getElementById('message-input').focus()  
}
  
function send(){
  var display = document.getElementById('display');
  var textarea = document.getElementById('message-input')
  var message_text = textarea.innerText
  var message_div = document.createElement('div')
  message_div.appendChild(document.createTextNode(message_text))
  textarea.innerHTML = ""
  var auto_switch = document.getElementById('auto-switch').checked
  
  
  if(align_right){
    message_div.setAttribute('class', "display-message right")
    
  }else{
    message_div.setAttribute('class', "display-message")
    
  }
  if (auto_switch) {
    switch_user(!align_right)
  }
  display.appendChild(message_div)
  var size = document.getElementById('text-size').value
  change_size(size)
  textarea.value = ""
  textarea.focus()
}
