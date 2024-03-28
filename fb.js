const { facebook } = require('fbvideodl');

// ? facebook(url, lq = true||false)
// ? url: string
// ? lq: boolean (true for low quality) (optional)

facebook('https://www.facebook.com/watch/?v=492925098979817',true)
    .then(videoUrl => console.log(videoUrl))
    .catch(error => console.error(error));

    facebook('https://www.facebook.com/watch/?v=492925098979817',false)
    .then(videoUrl => console.log(videoUrl))
    .catch(error => console.error(error));