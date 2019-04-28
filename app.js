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


// Set button to click.
var menu_button = document.getElementById( 'menu-toggle' )

// Click the button.
menu_button.onclick = function() {
	
  // Toggle class "opened". Set also aria-expanded to true or false.
  if ( -1 !== menu_button.className.indexOf( 'opened' ) ) {
    menu_button.className = menu_button.className.replace( ' opened', '' )
    menu_button.setAttribute( 'aria-expanded', 'false' )
  } else {
    menu_button.className += ' opened'
    menu_button.setAttribute( 'aria-expanded', 'true' )
   }
   document.getElementById('nav-menu').classList.toggle('active');
    
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
