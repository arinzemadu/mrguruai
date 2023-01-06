

function changeSelect(){
const selectElement = document.querySelector('#ai-type');
  
selectElement.addEventListener('change', () => {
  updatePlaceholder();
});

}



function updatePlaceholder(){
const selectElement = document.querySelector('#ai-type');
const textareaElement = document.querySelector('#prompt');
  textareaElement.setAttribute('placeholder', 'Enter a description');

  const img_desc = "Please enter description of the image you would like to create";
  
  const selectedOption = selectElement.value;
  if (selectedOption === 'study_notes') {
    textareaElement.setAttribute('placeholder', 'Convert Notes to Study Notes to provide you with memory prompts\n\n What are 5 key points I should know when studying Ancient Rome?');
  } else if (selectedOption === 'notes_to_summary') {
    textareaElement.setAttribute('placeholder', 'Convert my short hand into a first-hand account of the meeting:\n\nTom: Profits up 50%\nJane: New servers are online\nKjel: Need more time to fix software\nJane: Happy to help\nParkman: Beta testing almost done"');
  } else if (selectedOption === 'key_words') {
    textareaElement.setAttribute('placeholder', 'Highlight keywords from text');
  } else if (selectedOption === 'images') {
    textareaElement.setAttribute('placeholder', 'Create image from words');
  } else if (selectedOption === 'audio_generate') {
    textareaElement.setAttribute('placeholder', 'Generate audio from text and download file in .mp3');
  }else if (selectedOption === 'restaurant_review') {
    textareaElement.setAttribute('placeholder', '\n\nName: The Blue Wharf\nLobster great, noisy, service polite, prices good');
  }else if (selectedOption === 'advert_from_desc') {
    textareaElement.setAttribute('placeholder', 'Write a creative ad for the following product to run on Facebook aimed at parents:\n\nProduct: Learning Room is a virtual environment to help students from kindergarten to high school excel in school.');
  }else if (selectedOption === 'essay_outline') {
    textareaElement.setAttribute('placeholder', 'Create an outline for an essay about Nikola Tesla and his contributions to technology?');
  }else if (selectedOption === 'third_to_first_person') {
    textareaElement.setAttribute('placeholder', 'Convert this from first-person to third person (gender male):\n\nI decided to make a movie about Kevin Bacon');
  }else if (selectedOption === 'modify_image') {
    textareaElement.setAttribute('placeholder', img_desc);
  }else if (selectedOption === 'images-mood-01') {
    textareaElement.setAttribute('placeholder', 'Enter a description for a sunset themed image');
  }else if (selectedOption === 'images-mood-02') {
    textareaElement.setAttribute('placeholder',  'Enter a description for a intersteller themed image');
  }else if (selectedOption === 'images-mood-03') {
    textareaElement.setAttribute('placeholder',  'Enter a description for a abstract themed image');
  }else if (selectedOption === 'images-mood-04') {
    textareaElement.setAttribute('placeholder', 'Enter a description for a abstract bold themed image');
  }else if (selectedOption === 'images-mood-05') {
    textareaElement.setAttribute('placeholder', 'Enter a description for a abstract paper themed image');
  }else if (selectedOption === 'images-mood-06') {
    textareaElement.setAttribute('placeholder', 'Enter a description for a city themed image');
  }



}

function copyToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();
   alert("Text copied to clipboard");
}

function copyElementToClipboard(elementId) {
  var element = document.getElementById(elementId);
  var text = element.innerText;  // or element.innerHTML to copy HTML content
  copyToClipboard(text);
}

function characterCount(){
const textarea = document.getElementById('prompt');
const countDiv = document.getElementById('count');

textarea.addEventListener('input', () => {
  const count = textarea.value.length;
  countDiv.textContent = count+'/1000';
});
}




function updateOption() {
   // Get the select element and the images
   var select = document.getElementById("ai-type");
   var images = document.querySelectorAll("img");
   var cardBodies = document.querySelectorAll(".card-body");

   // Bind a click event handler to each image
   images.forEach(function(image) {
      image.addEventListener("click", function() {
         // Get the value of the "data-option" attribute of the clicked image
         var optionValue = this.getAttribute("data-option");
         // Set the value of the select element to the option value
         select.value = optionValue;

         // Remove the "selected" class from all images and card bodies
         images.forEach(function(img) {
            img.classList.remove("selected");
         });
         cardBodies.forEach(function(cardBody) {
            cardBody.classList.remove("selected");
         });
         // Add the "selected" class to the clicked image and card body
         this.classList.add("selected");
         this.parentNode.classList.add("selected");
         updatePlaceholder();
      });
   });
}




   






characterCount();
changeSelect();
updateOption();
