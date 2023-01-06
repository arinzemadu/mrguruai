$(document).ready(function(){
hideElement('copybutton');
hideElement('convert-btn');
$('#convert-btn').click(function() {

let string1 = document.getElementById('ai-response').innerHTML;
let string2 = "<img class";

if (string1.includes(string2)) {
  var element = document.getElementById('file-path-convert');
   element.innerHTML = '<p>You cant convert image to audio </p>';
} else {

 var element_path = document.getElementById('file-path-convert');
 element_path.innerHTML = 'Converting to Audio please wait....';

        $.ajax({
        url: '/audio-generate',
        type: 'POST',
        data: {
            txt: document.getElementById('ai-response').innerHTML,
        },
        success: function(msg) {
          console.log(msg);
        if(msg.link == 'Too many Characters max 1000'){
           element_path.innerHTML = '<p">'+msg.link+'</p>';
        }else{
            element_path.innerHTML = '<a href="'+msg.link+'">Download MP3</a>';
        }
        },
        error: function (xhr, status, error) {
      // error handling code
          element_path.innerHTML = error+'<p> Please try again .....</p>'+status;
    }             
    });
      }
});
});

var form = document.querySelector("form");
form.addEventListener("submit", function(event) {
  // Prevent the form from reloading the page
  event.preventDefault();
  // Get the form data
  var prompt = document.getElementById("prompt").value;
  var select = document.getElementById("ai-type");
  var selectedValue = select.selectedOptions[0].value;
  // Sanitize the user input to prevent injection attacks
  prompt = prompt.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  selectedValue = selectedValue.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  let string1 = selectedValue;
  let string2 = "image";

if (string1.includes(string2)) {
makeRequestimages(prompt, selectedValue);
  
} else {
makeRequesttext(prompt, selectedValue);
}
});


async function makeRequestimages(prompt, selectedValue) {
  var element = document.getElementById('ai-response');
  element.innerHTML = '<p>Generating image please wait .....</p>';
  var url = '/ai-image-convert';
  if (selectedValue == 'modify_image') {
    url = '/ai-image-edit';
  }

  $.ajax({
    url: url,
    type: 'POST',
    data: {
      txt: prompt,
      ai_type: selectedValue
    },
    success: function (msg) {
      element.innerHTML = '<img class="col-md-12 mb-12 card-img" src="'+msg.content+'"/>';
      sendImageUrl();
    },
    error: function (xhr, status, error) {
      // error handling code
      element.innerHTML = error+'<p>Please try again .....</p>'+status;
    }
  });
}

async function addImagetopage(filename) {
  // Make a GET request to the URL of the image
      // Create an a element
      var a = document.createElement("a");
      a.href = filename;
      a.target = '_blank'
      a.innerHTML = "download image";
      var elements = document.querySelectorAll(".image-path-convert");
      // Append the a element to each element
      elements.forEach(function(element) {
        element.appendChild(a);
      });
 
}

async function sendImageUrl() {
  // Send the request
const imgElement = document.querySelector('img.col-md-12.mb-12.card-img');
const src = imgElement.getAttribute('src');

$.ajax({
  url: '/ai-image-download',
  type: 'POST',
  data: {
    link: src
  },
  success: function (msg) {
addImagetopage(msg.content);
  },
  error: function (xhr, status, error) {
    // error handling code
  }
});

}


async function makeRequesttext(prompt, selectedValue) {
  // Send the request
var element = document.getElementById('ai-response');
element.innerHTML = '<p>Generating text please wait .....</p>';
$.ajax({
  url: '/ai-text-convert',
  type: 'POST',
  data: {
    txt: prompt,
    ai_type: selectedValue
  },
  success: function (msg) {
    showElement('copybutton');
    showElement('convert-btn');
    if (msg.type == 'audio-generate') {
      element.innerHTML = '<a href="'+msg.content+'">Download MP3</a>';
    } else {
      element.innerHTML = msg.content;
    }
  },
  error: function (xhr, status, error) {
    // error handling code
    element.innerHTML = error+'<p>Please try again .....</p>'+status;
  }
});

}


function showElement(elementId) {
  var element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'block';
  }
}


function hideElement(elementId) {
  var element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}





