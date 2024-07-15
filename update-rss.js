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
  today.setHours(10, 0, 0, 0);  // Set to beginning of the day

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
        '@_href': 'https://thesilentpodcast.com/images/logo.jpg'
      },
      enclosure: {
        '@_url': 'https://thesilentpodcast.s3.amazonaws.com/the-silent-podcast-episode-track.mp3',
        '@_type': 'audio/mp3'
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
const parser = new xmlparser.XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseAttributeValue: true
});
const rss = parser.parse(rssContent);

// Update the channel items with newly generated items
rss.rss.channel.item = generateItems();
if (!Array.isArray(rss.rss.channel.item)) {
  rss.rss.channel.item = [rss.rss.channel.item];
}

// Create a new XML document with the correct structure and namespaces
const xml = xmlbuilder.create('rss', { version: '1.0', encoding: 'UTF-8' })
  .att('xmlns:itunes', 'http://www.itunes.com/dtds/podcast-1.0.dtd')
  .att('xmlns:atom', 'http://www.w3.org/2005/Atom')
  .att('version', '2.0');

// Function to recursively build the XML structure
function buildXml(parent, obj) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (key === 'atom:link' && parent.name === 'channel') {
        // Special handling for atom:link to prevent duplication
        if (!Array.isArray(obj[key])) {
          obj[key] = [obj[key]];
        }
        obj[key].forEach(link => {
          parent.ele('atom:link', {
            href: link['@_href'],
            rel: link['@_rel'],
            type: link['@_type']
          });
        });
      } else if (key.startsWith('@_')) {
        // It's an attribute
        parent.att(key.slice(2), obj[key]);
      } else if (Array.isArray(obj[key])) {
        // It's an array of elements
        obj[key].forEach(item => {
          const child = parent.ele(key);
          buildXml(child, item);
        });
      } else if (typeof obj[key] === 'object') {
        // It's a nested element
        const child = parent.ele(key);
        buildXml(child, obj[key]);
      } else {
        // It's a simple element
        parent.ele(key, obj[key]);
      }
    }
  }
}

// Build the rest of the XML structure
buildXml(xml, rss.rss);

// Convert the XML to a string
const xmlString = xml.end({ pretty: true, indent: '  ', newline: '\n' });

// Write the updated RSS content back to the file
fs.writeFileSync(rssFilePath, xmlString, 'utf8');
