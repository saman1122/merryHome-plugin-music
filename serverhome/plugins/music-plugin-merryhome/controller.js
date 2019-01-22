const request = require('sync-request');

class MusicController {
    
    constructor(io){
            this.io = io;
    }
    
    postAction(req, res){
        switch(req.params.actionId){
            case "whosing":
		var requestUrl="https://itunes.apple.com/search?term=";
                requestUrl += req.body.searchValue;
                console.log(requestUrl);
                var itunesReq = request('GET', requestUrl,{cache:'file'});
                var response = JSON.parse(itunesReq.getBody('utf8'));
                var textResponse= parseDataResponse(response);
		console.log(textResponse);
                if(!textResponse){
                    res.end(JSON.stringify({resultText: "je n'ai pas d'informations"}));
                }else{
                    res.end(JSON.stringify({resultText: textResponse[0].artistName}));
                }
                break;
	    case "whatalbum":
		var requestUrl="https://itunes.apple.com/search?term=";
                requestUrl += req.body.searchValue;
                console.log(requestUrl);
                var itunesReq = request('GET', requestUrl,{cache:'file'});
                var response = JSON.parse(itunesReq.getBody('utf8'));
                var textResponse= parseDataResponse(response);
		var map = {};
		console.log(textResponse);
                if(!textResponse){
                    res.end(JSON.stringify({resultText: "je n'ai pas d'informations"}));
                }else{
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
		var requestUrl="https://itunes.apple.com/search?term=";
                requestUrl += req.body.searchValue;
                console.log(requestUrl);
                var itunesReq = request('GET', requestUrl,{cache:'file'});
                var response = JSON.parse(itunesReq.getBody('utf8'));
                var textResponse= parseDataResponse(response);
		console.log(textResponse);
                if(!textResponse){
                    res.end(JSON.stringify({resultText: "je n'ai pas d'informations"}));
                }else{
                    res.end(JSON.stringify({resultText: "Ok, je vous lance: " + textResponse[0].trackName,
                                            resultAudio: textResponse[0].previewUrl}));

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
					"previewUrl": response.results[track].previewUrl
				});
			}
		}
	}
	return results;
}

module.exports = MusicController;
