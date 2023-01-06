
async function getBlog() {
    const url = '/api/blog';

    try {
        const res = await fetch(url);
        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
    }
}

getBlog().then(function(result) { 
 var i = 0;
 var news = '';

console.log(result);

result.item.forEach(function() {
        if(i <= 10){
    console.log(result.item[i].title['$']);
    news += '<div><img height="100" src="'+result.item[i]['#'][0]['media:content']['@url']+'"/><a href="'+result.item[0].link[0]+'">'+result.item[i].title['$']+'</a><p>'+result.item[0].description.$+'</br>'+result.item[i]['atom:updated']+'</p></div>';
    }
    i++;
               var element = document.getElementsByClassName('blog')[0];
                element.innerHTML = news;
})
});
