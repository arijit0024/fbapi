

function extractVideoId(link) {
    let match = link.match(
        /(?:facebook|fb).*\/(?:videos|reel|watch)(?:\/?)(?:\?v=)?(\d+)/i
    );
    return match && match.length >= 2 ? match[1] : null;
}

function encodeRequestBody(requestBody) {
    let encodedParams = [];
    for (let key in requestBody) {
        if (requestBody.hasOwnProperty(key)) {
            let value = requestBody[key];
            let encodedValue =
                encodeURIComponent(key) + "=" + encodeURIComponent(value);
            encodedParams.push(encodedValue);
        }
    }
    return encodedParams.join("&");
}

function facebook(link, lq = false) {
    let videoId = extractVideoId(link);
    if (!videoId) {
        // Output as an error
        return JSON.stringify({
            error: "Invalid URL!",
        });
    }

    let requestBody = {
        doc_id: "5279476072161634",
        variables: JSON.stringify({
            UFI2CommentsProvider_commentsKey: "CometTahoeSidePaneQuery",
            caller: "CHANNEL_VIEW_FROM_PAGE_TIMELINE",
            displayCommentsContextEnableComment: null,
            displayCommentsContextIsAdPreview: null,
            displayCommentsContextIsAggregatedShare: null,
            displayCommentsContextIsStorySet: null,
            displayCommentsFeedbackContext: null,
            feedbackSource: 41,
            feedLocation: "TAHOE",
            focusCommentID: null,
            privacySelectorRenderLocation: "COMET_STREAM",
            renderLocation: "video_channel",
            scale: 1,
            streamChainingSection: false,
            useDefaultActor: false,
            videoChainingContext: null,
            videoID: videoId,
        }),
        server_timestamps: true,
    };

    return fetch("https://www.facebook.com/api/graphql/", {
        method: "POST",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0",
            "Sec-Fetch-Site": "same-origin", // ! Nessessary
        },
        body: encodeRequestBody(requestBody),
    })
        .then((response) => response.text())
        .then((text) => {
            let json = JSON.parse(text.split("\n")[0]);
            if (!json || !json.data) {
                return JSON.stringify({
                    error: "Invalid response from the server!",
                });
            }
            if (json.data.video == null) {
                return JSON.stringify({
                    error: "Video not found or private video!",
                });
            }


            if (!json.data.video.playable_url_quality_hd || lq === true) {
                // Create the JSON object
            const cleanJsonData = {
                sd: json.data.video.playable_url + "&sd_quality"
            };

            // Save the JSON data in a variable
            const jsonDataVariable = JSON.stringify(cleanJsonData);


            return jsonDataVariable;

                //return json.data.video.playable_url + "&sd_quality"; // ? Add indicator for low quality
            }


            // Assuming json.data.video has the required properties
            const thumbnailUri = json.data.video.preferred_thumbnail.image.uri;
            const playableUrl = json.data.video.playable_url;

            // Create the JSON object
            const cleanJsonData = {
                thumbnail: thumbnailUri,
                hd: playableUrl,
                sd: playableUrl + "&sd_quality"
            };

            // Save the JSON data in a variable
            const jsonDataVariable = JSON.stringify(cleanJsonData);


            return jsonDataVariable;



        });
}


facebook('https://www.facebook.com/100044444525893/videos/198065679059374?__so__=permalink',)
    .then(videoUrl => console.log(videoUrl))
    .catch(error => console.error(error));