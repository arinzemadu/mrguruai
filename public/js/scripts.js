


getProjects().then(function(result) {
    var card_markup = '';
   result.forEach(obj => { 
        Object.entries(obj).forEach(([key, value]) => {
if(key == 'title'){
    var title = value;
     card_markup += '<div class="col-md-4 mb-5"><div class="card h-100 "><div class="card-body"><h2 class="card-title projects-title">'+title+'</h2>';               
}
if(key == 'field_card_image' ){
    var field_card_image = value;
    card_markup +=  '<img width="120" class="img-fluid rounded mx-auto d-block image project-image" src="https://dev-juicywalnutapi.pantheonsite.io/'+field_card_image+'" />';
}
if(key == 'body'){
    var body = value;
    card_markup += '<p class="card-text commaSeparated projects-body"> '+body+'</p></div></div></div>';                
}
        });
 var element = document.getElementsByClassName('body-row')[0];
        //this is where the title image and body will be set
element.innerHTML  = card_markup;
    });

});




      var swiper = new Swiper(".mySwiper", {
        speed: 600,
        parallax: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });


async function getProjects() {
    const url = '/api/projects';

    try {
        const res = await fetch(url);
        const data = await res.json();

        console.log(data);

        return data;

    } catch (error) {
        console.log(error);
    }
}


// getBlogs().then(function(result) {
//           var card_markup = '';
//      result.forEach(obj => { 
//         Object.entries(obj).forEach(([key, value]) => {
// //todo add body title and image 
// if(key == 'title'){
//     var title = value;
//      card_markup += '<div class="row gx-12 gx-lg-12 blog"><div class="col-md-12 mb-12"><div class="card h-100 "><div class="card-body"><h2 class="card-title projects-title">'+title+'</h2>';               
// }

// if(key == 'field_card_image' ){
//     var field_card_image = value;
//     card_markup +=  '<img width="120" class="img-fluid rounded mx-auto d-block image project-image" src="https://dev-juicywalnutapi.pantheonsite.io/'+field_card_image+'" />';
// }
// if(key == 'body'){
//     var body = value;
//     card_markup += '<p class="card-text commaSeparated projects-body"> '+body+'</p></div></div></div></div>';
                
// }
//         });

//  var element = document.getElementsByClassName('main-row')[0];
//  console.log(element);
//         //this is where the title image and body will be set
// element.innerHTML  = card_markup;
//     });
// });



// async function getBlogs() {
//     const url = '/api/blog';
//     try {
//         const res = await fetch(url);
//         const data = await res.json();

//         return data;

//     } catch (error) {
//         console.log(error);
//     }
// }









