const request = require('sync-request');

class MusicController {
    
    constructor(io){
            this.io = io;
    }
    
    postAction(req, res){
		var requestUrl="https://itunes.apple.com/search?term=";
		const searchValue = req.body.searchValue;
        const searchValue2 = req.body.searchValue2;
        const searchValue3 = req.body.searchValue3;
        if(searchValue !== undefined){requestUrl += searchValue;}
        if(searchValue2 !== undefined){requestUrl += searchValue2;}
        if(searchValue3 !== undefined){requestUrl += searchValue3;}
        var itunesReq = request('GET', encodeURI(requestUrl),{cache:'file'});
        var response = JSON.parse(itunesReq.getBody('utf8'));
        var textResponse= parseDataResponse(response);

        switch(req.params.actionId){
            case "whosing":
                if(textResponse.length === 0){
                    res.end(JSON.stringify({resultText: "Désolé, je ne trouve pas ce que vous demandez"}));
                }else{
                    res.end(JSON.stringify({resultText: textResponse[0].artistName}));
                }
                break;
	        case "whatalbum":
                if(textResponse.length === 0){
                    res.end(JSON.stringify({resultText: "Désolé, je ne trouve pas ce que vous demandez"}));
                }else{
                    var map = {};
                    for(var indice in textResponse){
			            map[textResponse[indice].collectionName]=indice;
	        	    }
                    let resultstr = '';
                    for (var i in map) {
                        resultstr += i + " , ";
                    }
                    res.end(JSON.stringify({resultText: resultstr}));
                }
                break;

            case "play":
                if(textResponse.length === 0){
                    res.end(JSON.stringify({resultText: "Désolé, je ne trouve pas ce que vous demandez"}));
                }else{
                    res.end(JSON.stringify({resultText: "Ok, je vous lance: " + textResponse[0].trackName + " de " + textResponse[0].artistName,
                                            resultAudio: textResponse[0].previewUrl,
                                            resultImage: textResponse[0].artworkUrl100}));
                }
                break;

            default:
                res.end(JSON.stringify({}));
                break;
            
        }
    }
}

function parseDataResponse(response){
	let results = [];
	if(response){
		if(response.resultCount > 0){
			for(var track in response.results){
				results.push({
					"artistName": response.results[track].artistName,
					"trackName": response.results[track].trackName,
					"collectionName": response.results[track].collectionName,
					"previewUrl": response.results[track].previewUrl,
					"artworkUrl100": response.results[track].artworkUrl100
				});
			}
		}
	}
	return results;
}

module.exports = MusicController;
