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

// Function to generate the new RSS item
function generateNewItem() {
  const today = new Date();
  const formattedDate = formatDate(today);
  const pubDate = today.toUTCString();
  const datePath = today.toISOString().split('T')[0];

  return `
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

// Insert the new item into the RSS feed
const updatedRssContent = rssContent.replace('</channel>', `${generateNewItem()}</channel>`);

// Write the updated RSS content back to the file
fs.writeFileSync(rssFilePath, updatedRssContent, 'utf8');
