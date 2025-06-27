// netlify/functions/fetchVideos.js

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_USERNAME = "kidsstoriesandmagicalmoments";

  const getChannelId = async () => {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${CHANNEL_USERNAME}&key=${API_KEY}`);
    const data = await res.json();
    return data.items?.[0]?.id;
  };

  const getVideos = async (channelId) => {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=12`);
    const data = await res.json();
    return data.items.filter(item => item.id.kind === "youtube#video");
  };

  try {
    const channelId = await getChannelId();
    if (!channelId) throw new Error("Channel ID not found");

    const videos = await getVideos(channelId);
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
