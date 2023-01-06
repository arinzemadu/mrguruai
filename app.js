const express = require('express'); //Import the express dependency
const app = express();
// const pdfParse = require('pdf-parse');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
require('dotenv').config();
// app.use(express.urlencode());          //Instantiate an express app, the main work horse of this server
const port = process.env.PORT; //Save the port number where your server will be listening
const axios = require('axios');
const Web3 = require('web3');
const Parser = require('rss-parser')
const parser = new Parser({
    headers: {
        'User-Agent': 'Chrome'
    }
});
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const {
    Storage
} = require('@google-cloud/storage');

// Import other required libraries
const fs = require('fs');
const util = require('util');
// Creates a client
const client = new textToSpeech.TextToSpeechClient();
const storage = new Storage();
const request = require('request');

const airdropalert = 'https://airdropalert.com/rssfeed/active';
const coindesk = 'https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=json';
const cointelegraph = 'https://cointelegraph.com/editors_pick_rss';
const bucketName = process.env.BUCKET;

async function aiTextconvert(txt, type) {
    const {
        Configuration,
        OpenAIApi
    } = require("openai");
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    if (type == 'notes_to_summary') {
        //notesTosummary
        const ai_command = "Convert my short hand into a first-hand account of the meeting in a professional style:";
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ai_command + '' + txt,
            temperature: 0,
            max_tokens: 64,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        return response;
    }
    if (type == 'study_notes') {
        //studyNotes
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: txt,
            temperature: 0.3,
            max_tokens: 150,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        return response;
    }
    if (type == 'key_words') {
        //keyWords
        const ai_command = "Extract keywords from this text:";
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ai_command + '' + txt,
            temperature: 0.5,
            max_tokens: 60,
            top_p: 1.0,
            frequency_penalty: 0.8,
            presence_penalty: 0.0,
        });
        return response;
    }
    if (type == 'restaurant_review') {
        const ai_command = "Write a restaurant review based on these notes:";
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: ai_command + '' + txt,
            temperature: 0.5,
            max_tokens: 64,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        return response;
    }

    if (type == 'advert_from_desc') {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Write a creative ad for the following product to run on Facebook, Ebay and Instagram:" + txt,
            temperature: 0.5,
            max_tokens: 100,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        return response;
    }

    if (type == 'essay_outline') {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Create an outline for an essay about:" + txt,
            temperature: 0.3,
            max_tokens: 150,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        return response;
    }
    if (type == 'third_to_first_person') {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Convert this from first-person to third person:",
            temperature: 0,
            max_tokens: 60,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        });
        return response;
    }


}

function imageStyle(type, txt) {
    switch (type) {
        case "images-mood-01":
            txt += ":Then combine with the following: Paint a sunrise over a calm ocean. The sky should be a gradient of blue, white, and orange, with sun peeking over the horizon. The water can be blue, with gentle waves lapping at the shore. In the foreground, there should be a lone tree, its branches reaching out towards the water. The overall mood should be peaceful and serene. This should be a masterpeice and a work of art";
            break;
        case "images-mood-02":
            txt += ":Then combine with the following: Paint bright stars, such as blue supergiants, red giants, and white dwarfs. a single image of the Milkyway maybe another random galaxy. This should be a beautiful with the occasional lense flare ";
            break;
        case "images-mood-03":
            txt += ":Then combine with the following: Use vibrant colors and expressive brushstrokes to capture the beauty and dynamism of the natural world. Pay attention to light and color to convey emotion and atmosphere. Focus on impressions rather than realism. Create a luminous, vibrant painting in the style of Monet";
            break;
        case "images-mood-04":
            txt += ":Then combine with the following: Begin by selecting a subject matter that will allow for the use of both Van Gogh's expressive brushwork and Art Deco elements. This could be a landscape, a still life, or a portrait, depending on the desired effect.Use thick, textured brushstrokes and vibrant, bold colors to create expressive patterns and shapes in the painting, drawing inspiration from monet.Incorporate elements of Art Deco design into the composition, such as geometric shapes and lines, zigzags, chevrons, and other decorative elements.Use metallic accents and bright, vibrant colors to create a sense of glamour and sophistication in the painting. bold and exciting ";
            break;
        case "images-mood-05":
            txt += ":Then combine with the following: Use vibrant colors on torn pieces of paper. Pay attention to light and color to convey emotion and atmosphere. Focus on realism rather than impressions. Create a luminous, quiet painting in the style of hockney ";
            break;
        case "images-mood-06":
            txt += ":Then combine with the following: Create a cityscape with tall buildings, iconic landmarks, river or body of water, parks, and people. Capture unique character and atmosphere, create cohesive cityscape conveying essence of city ";
            break;
        case "images":
            break;
        default:
            txt = "Invalid type";
    }
    return txt;
}

async function imageMod() {
    const {
        Configuration,
        OpenAIApi
    } = require("openai");
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
            const response = await openai.createImageVariation(
            fs.createReadStream('/assets/images/ai_generate/mr_airdropmr_airdrop1672927452.png'),
            1,
            "1024x1024"
        );

        image_url = response.data.data[0].url;
        return image_url;
}


async function imageGeneration(txt, type) {
    const {
        Configuration,
        OpenAIApi
    } = require("openai");
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    txt = imageStyle(type, txt);
    const response = await openai.createImage({
        prompt: txt,
        n: 1,
        size: "1024x1024",
    });
    image_url = response.data.data[0].url;

    return image_url;
}

app.post('/ai-image-edit', (req, res) => {
    const data = imageMod().then(function(result) {
        res.send({
            content: result
        });
    });
});

app.post('/ai-image-convert', (req, res) => {
    const data = imageGeneration(req.body.txt, req.body.ai_type).then(function(result) {
        res.send({
            content: result,
            type: req.body.ai_type
        });
    });
});

app.post('/ai-text-convert', (req, res) => {
    aiTextconvert(req.body.txt, req.body.ai_type).then(function(result) {
        const body = req.body.txt;
        const result_body = result.data.choices[0].text;
        if (body.length > 1000) {
            result_body = 'too many characters max 1000 characters';
        }

        res.send({
            content: result_body,
            type: req.body.ai_type
        });
    });
});


app.post('/ai-image-download', (req, res) => {
    var timestamp = getTimestampInSeconds();
    gcloudSaveImage(req.body.link, 'mr_airdrop' + timestamp + '.png').then(function() {
        res.send({
            content: req.body.link
        });
        //'https://storage.googleapis.com/psyched-thunder-364913.appspot.com//ai_img_uploads/mr_airdrop'+timestamp+'.png'
        //__dirname+'/public/assets/images/ai_generate/mr_airdrop'+timestamp+'.png',
        // req.body.link
    });
});


async function gcloudSaveImage(imageUrl, fileName, res) {
    // console.log(imageUrl);
    // Send a request to the server and save the response to a local file
    request(imageUrl).pipe(fs.createWriteStream(__dirname + '/public/assets/images/ai_generate/mr_airdrop' + fileName)).on('close', async () => {
        console.log(fileName);
        // Save the image to Google Cloud Storage
        const [file] = await storage.bucket(bucketName).upload(__dirname + '/public/assets/images/ai_generate/mr_airdrop' + fileName, {
            // Set the destination path and file name for the image in Google Cloud Storage
            destination: `/ai_img_uploads/${fileName}`,
            // Set the content type of the image
            contentType: 'image/png',
        });

    });
}

async function cloudSaveAudio(imageUrl, fileName) {
    // console.log(imageUrl);
    // Send a request to the server and save the response to a local file
    request(imageUrl).pipe(fs.createWriteStream(__dirname + '/public/assets/images/ai_generate/mr_airdrop' + fileName)).on('close', async () => {
        console.log(fileName);
        // Save the image to Google Cloud Storage
        const [file] = await storage.bucket(bucketName).upload(__dirname + '/public/assets/images/ai_generate/mr_airdrop' + fileName, {
            // Set the destination path and file name for the image in Google Cloud Storage
            destination: `/ai_img_uploads/${fileName}`,
            // Set the content type of the image
            contentType: 'binary/mp3',
        });

    });
}



function getTimestampInSeconds() {
    return Math.floor(Date.now() / 1000)
}

async function quickStart(text) {
    // Construct the request
    if (text.length) {
        const request = {
            input: {
                text: text
            },
            // Select the language and SSML voice gender (optional)
            voice: {
                languageCode: 'en-US',
                ssmlGender: 'male'
            },
            // select the type of audio encoding
            audioConfig: {
                audioEncoding: 'MP3'
            },
        };
        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);
        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        console.log(response);
        var random_munber = Math.floor(Math.random() * (50 - 1 + 1)) + 1;
        var timestamp = getTimestampInSeconds();
        await writeFile(__dirname + '/public/assets/audio/voice/' + random_munber + '-' + timestamp + 'voice.mp3', response.audioContent, 'binary');
        var output_results = '/assets/audio/voice/' + random_munber + '-' + timestamp + 'voice.mp3';
        //  cloudSaveAudio('http://localhost:3000/assets/audio/voice/' + random_munber + '-' + timestamp + 'voice.mp3', 'mr_airdrop'+timestamp+'.mp3').then(function () {});
    }
    if (text.length > 1000) {
        output_results = 'Too many Characters max 1000';
    }

    return output_results;
}

app.post('/audio-generate', (req, res) => {
    quickStart(req.body.txt).then(function(result) {
        res.send({
            link: result
        });
    });
});

app.get('/api/coindesk', (req, res) => {
    let response = null;
    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('https://www.coindesk.com/arc/outboundfeeds/rss/?outputType=json')
        } catch (ex) {
            response = null;
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;
            res.send(json.rss.channel.item);
            resolve(json);
        }
    })
});

app.get('/api/cmcairdrops', async (req, res) => {
    let response = null;
    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/airdrops?limit=5', {
                headers: {
                    'X-CMC_PRO_API_KEY': process.env.CMC,
                },
            })
        } catch (ex) {
            response = null;
            reject(ex);
        }
        if (response) {
            const json = response.data;
            res.send(json);
            resolve(json);
        }
    })
});


app.get('/api/projects', async (req, res) => {

    let response = null;
    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('https://dev-juicywalnutapi.pantheonsite.io/projects?_format=json', )
        } catch (ex) {
            response = null;
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;
            res.send(json);
            resolve(json);
        }
    })
});


app.get('/api/blog', async (req, res) => {
    let response = null;
    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('https://dev-juicywalnutapi.pantheonsite.io/blog?_format=json', )
        } catch (ex) {
            response = null;
            // error
            //console.log(ex);
            reject(ex);
        }
        if (response) {
            // success
            const json = response.data;

            res.send(json);
            resolve(json);
        }
    })
});



app.set('trust proxy', true);
app.enable('trust proxy')
app.use(function(request, response, next) {

    if (process.env.NODE_ENV != 'development' && !request.secure) {
        return response.redirect("https://" + request.headers.host + request.url);
    }

    next();
})
app.use(express.static('public'));
app.use(express.static('public', {
    extensions: ['html']
}));
app.use(express.static('public/html-includes', {
    extensions: ['html']
}));
app.use(express.static('public/css', {
    extensions: ['css']
}));
app.use(express.static('public/js', {
    extensions: ['js']
}));
app.use(express.static('public/assets/pdf_uploads', {
    extensions: ['pdf']
}));
app.use(express.static('public/assets/images/ai_generate', {
    extensions: ['png']
}));


//Idiomatic expression in express to route and respond to a client request
app.get('/aitoolkit_text', (req, res) => { //get requests to the root ("/") will route here
    res.sendFile('public/ai_toolkit_text.html', {
        root: __dirname
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

//Idiomatic expression in express to route and respond to a client request
app.get('/aitoolkit_images', (req, res) => { //get requests to the root ("/") will route here
    res.sendFile('public/ai_toolkit_image.html', {
        root: __dirname
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

//Idiomatic expression in express to route and respond to a client request
app.get('/about', (req, res) => { //get requests to the root ("/") will route here
    res.sendFile('public/about.html', {
        root: __dirname
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});
//Idiomatic expression in express to route and respond to a client request
app.get('/airdrops', (req, res) => { //get requests to the root ("/") will route here
    res.sendFile('public/airdrops.html', {
        root: __dirname
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.get('/news', (req, res) => { //get requests to the root ("/") will route here
    res.sendFile('public/news.html', {
        root: __dirname
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});

app.get('/html-includes/menu-items.html', (req, res) => { //get requests to the root ("/") will route here
    res.sendFile('public/html-includes/menu-items.html', {
        root: __dirname
    }); //server responds by sending the index.html file to the client's browser
    //the .sendFile method needs the absolute path to the file, see: https://expressjs.com/en/4x/api.html#res.sendFile 
});


app.get('/api/airdropalert', async (req, res) => {
    await fetchRssFeed(airdropalert)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                message: 'No news found'
            })
        })
});

async function fetchRssFeed(feedUrl) {
    let feed = await parser.parseURL(feedUrl);

    return feed.items.map(item => {
        return {
            title: item.title,
            link: item.link,
            date: item.pubDate,
            author: item.author
        }
    });
}

app.get('/api/cointelegraph', async (req, res) => {
    await fetchRssFeedcointelegraph(cointelegraph)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).json({
                status: 'error',
                message: 'No news found'
            })
        })
});

async function fetchRssFeedcointelegraph(feedUrl) {
    let feed = await parser.parseURL(feedUrl);

    return feed.items.map(item => {
        return {
            title: item.title,
            link: item.link,
            description: item.description,
            date: item.pubDate
        }
    });
}

app.listen(port, () => { //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`);
});