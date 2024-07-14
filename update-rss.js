const fs = require('fs');
const path = require('path');

// Path to your RSS file
const rssFilePath = path.join(__dirname, 'podcast.xml');

// Read the existing RSS file
const rssContent = fs.readFileSync(rssFilePath, 'utf8');

// Function to format the date
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Function to generate the RSS items for the past 30 days
function generateItems() {
  let items = '';
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = formatDate(date);
    const pubDate = date.toUTCString();
    const datePath = date.toISOString().split('T')[0];
    items += `
    <item>
      <title>The Silent Podcast — ${formattedDate}</title>
      <itunes:title>The Silent Podcast — ${formattedDate}</itunes:title>
      <itunes:subtitle>10 minutes of stillness in your day.</itunes:subtitle>
      <itunes:author>Gabriel Krieshok</itunes:author>
      <itunes:summary>10 minutes of stillness for ${formattedDate}.</itunes:summary>
      <description>10 minutes of stillness for ${formattedDate}.</description>
      <link>https://thesilentpodcast.com/${datePath}.html</link>
      <itunes:image href="https://thesilentpodcast.com/images/logo.jpg" />
      <enclosure url="https://thesilentpodcast.s3.amazonaws.com/the-silent-podcast-episode-track.mp3" type="audio/mp3"/>
      <pubDate>${pubDate}</pubDate>
      <itunes:duration>10:00</itunes:duration>
      <itunes:explicit>no</itunes:explicit>
      <guid>https://thesilentpodcast.com/${datePath}.html</guid>
    </item>`;
  }
  return items;
}

// Insert the generated items into the RSS feed
const updatedRssContent = rssContent.replace('${generateItems()}', generateItems());

// Write the updated RSS content back to the file
fs.writeFileSync(rssFilePath, updatedRssContent, 'utf8');
