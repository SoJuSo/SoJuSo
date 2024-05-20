const axios = require("axios");
const xml2js = require("xml2js");
const fs = require("fs");

const RSS_URL = "https://shqpdltm.tistory.com/rss";

(async () => {
  try {
    const response = await axios.get(RSS_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/rss+xml, application/xml; q=0.9, */*; q=0.8",
      },
    });

    const data = response.data;
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(data);
    const items = result.rss.channel[0].item;
    const latestPosts = items.slice(0, 5);

    let content = `\n\n`;
    latestPosts.forEach((post, index) => {
      content += `${index + 1}. [${post.title[0]}](${post.link[0]})\n`;
    });

    const readmeContent = fs.readFileSync("README.md", "utf8");
    const updatedReadmeContent = readmeContent.replace(
      /<!-- LATEST_POSTS -->[\s\S]*<!-- LATEST_POSTS_END -->/,
      `<!-- LATEST_POSTS -->\n${content}\n<!-- LATEST_POSTS_END -->`
    );

    if (updatedReadmeContent !== readmeContent) {
      console.log("Updating README.md with new content.");
      fs.writeFileSync("README.md", updatedReadmeContent);
    } else {
      console.log("No updates to README.md needed.");
    }
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
  }
})();
