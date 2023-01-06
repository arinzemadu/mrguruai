
async function getNewsData(source){
if(source == 'ct'){
 var url = 'api/cointelegraph';
}
if(source == 'cd'){
var url = '/api/coindesk';
}
 try {
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

getNewsData('cd').then(function(result) {
    var i = 0;
    var news = '';
    result.forEach(function() {
        if (i <= 10) {
            news += '<div class ="news-content"><img height="100" src="' + result[i]['#'][0]['media:content']['@url'] + '"/><a href="' + result[0].link[0] + '">' + result[i].title['$'] + '</a><p>' + result[0].description.$ + '</br>' + result[i]['atom:updated'] + '</p></div>';
        }
        i++;
    });
    var element = document.getElementsByClassName('news-cd')[0];
    element.innerHTML = news;
});

getNewsData('ct').then(function(result) {
    var i = 0;
    var news = '';
    console.log(result);
    result.forEach(function() {
        if (i <= 10) {
            news += '<div><img height="50" src="https://cointelegraph.com/assets/img/CT_Logo_YG_tag.png"/><a href="' + result[i].link + '">' + result[i].title + '</a></div>';
        }
        i++;
    });
    var element = document.getElementsByClassName('news-ct')[0];
    element.innerHTML = news;
});