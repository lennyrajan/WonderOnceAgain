const fetch = require('node-fetch');

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = "UC9BQ_0nHNwEkW7YXdBcqljg";

const getVideos = async () => {
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=12`);
  const data = await res.json();
  return data.items.filter(item => item.id.kind === "youtube#video");
};

exports.handler = async function(event, context) {
  try {
    const videos = await getVideos();
    return {
      statusCode: 200,
      body: JSON.stringify(videos)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
