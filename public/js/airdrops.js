async function getAirdropAlert() {
    const url = '/api/airdropalert';

    try {
        const res = await fetch(url);
        const data = await res.json();

        return data.slice(0, 5);

    } catch (error) {
        console.log(error);
    }
}



async function getAirdropsCmc() {
    const url = '/api/cmcairdrops';

    try {
        const res = await fetch(url);
        const data = await res.json();

        return data.data;

    } catch (error) {
        console.log(error);
    }
}





getAirdropAlert().then(function(result) {

    var element = document.getElementsByClassName('airdropalert')[0];
    i = 0;
    
    while (i < 5) {
        element.innerHTML += '<h4>' + result[i]['title'] + '</h4><ul><li><a href="' + result[i]['link'] + '">' + result[i]['link'] + '</a></li><li> Start Date:' + result[i]['date'] + '</li><li>' + result[i]['author'] + '</li></ul>';
        i++;
    }
});



getAirdropsCmc().then(function(result) {

    var element = document.getElementsByClassName('airdropcmc')[0];
    i = 0;

    while (i < 5) {
        element.innerHTML += '<h4>' + result[i].project_name + '</h4><ul><li><a href="' + result[i].link + '">' + result[i].link + '</a></li><li>End Date: ' + result[i].end_date + '</li><li>' + result[i].status + '</li></ul>';
        i++;
    }
});