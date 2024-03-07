const http = require('http');

const server = http.createServer((req, res) => {
  // Check if the request method is GET
  if (req.method === 'GET' && req.url === '/getTimeStories') {
    // Set the response header with a status code of 200 and content type of application/json
    res.writeHead(200, { 'Content-Type': 'application/json' });

    // Make a GET request to the specified URL
    fetch('https://time.com')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(htmlContent => {
        // Extract the latest stories from the specified element using regular expressions
        const latestStories = [];
        const regex = /<li class="latest-stories__item">(.*?)<\/li>/gs;
        const matches = htmlContent.match(regex);
        if (matches) {
          matches.forEach(match => {
            const headlineMatch = match.match(/<h3 class="latest-stories__item-headline">(.*?)<\/h3>/);
            const linkMatch = match.match(/<a href="(.*?)">/);

            if (headlineMatch && linkMatch) {
              const headline = headlineMatch[1].trim();
              let link = linkMatch[1];
              link = "https://time.com" + link;
              latestStories.push({
                headline,
                link
              });
            }
          });

          // Output the result as JSON
          res.end(JSON.stringify(latestStories));
        } else {
          // console.error('No matches found in HTML content');
          res.end("No matches found in HTML content");
        }
      })
  }
});

// Listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});