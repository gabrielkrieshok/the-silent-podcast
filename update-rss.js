// Import required Node.js modules
const fs = require('fs');
const path = require('path');
const xmlparser = require('fast-xml-parser');
const xmlbuilder = require('xmlbuilder');

// Path to the RSS file (dirname is the directory of the current file)
const rssFilePath = path.join(__dirname, 'podcast.xml');

// Function to format a date object into a string (e.g., "July 14, 2024")
function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Function to generate the RSS items for the past 30 days
function generateItems() {
  const items = []; // Ensure items is initialized as an array
  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Set to beginning of the day

  // Loop through the past 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    // Skip if the date is in the future
    if (date > today) continue;

    // Format the date for various uses
    const formattedDate = formatDate(date);
    const pubDate = date.toUTCString();
    const datePath = date.toISOString().split('T')[0];

    // Generate the object for a single item (episode)
    items.push({
      title: `The Silent Podcast — ${formattedDate}`,
      'itunes:title': `The Silent Podcast — ${formattedDate}`,
      'itunes:subtitle': '10 minutes of stillness in your day.',
      'itunes:author': 'Gabriel Krieshok',
      'itunes:summary': `10 minutes of stillness for ${formattedDate}.`,
      description: `10 minutes of stillness for ${formattedDate}.`,
      link: `https://thesilentpodcast.com/${datePath}.html`,
      'itunes:image': {
        '@href': 'https://thesilentpodcast.com/images/logo.jpg'
      },
      enclosure: {
        '@url': 'https://thesilentpodcast.s3.amazonaws.com/the-silent-podcast-episode-track.mp3',
        '@type': 'audio/mp3'
      },
      pubDate: pubDate,
      'itunes:duration': '10:00',
      'itunes:explicit': 'no',
      guid: `https://thesilentpodcast.com/${datePath}.html`
    });
  }
  return items;
}

// Read and parse the existing RSS file
const rssContent = fs.readFileSync(rssFilePath, 'utf8');
const parser = new xmlparser.XMLParser();
const rss = parser.parse(rssContent);

// Update the channel items with newly generated items
rss.rss.channel.item = generateItems();

// Convert the updated object back to XML
const builder = new xmlbuilder.create('rss');
const xmlString = builder.element(rss.rss).end({ pretty: true });

// Write the updated RSS content back to the file
fs.writeFileSync(rssFilePath, xmlString, 'utf8');
