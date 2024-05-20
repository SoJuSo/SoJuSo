const Parser = require("rss-parser");
const fs = require("fs");

const RSS_URL = "https://shqpdltm.tistory.com/rss";

(async () => {
  const parser = new Parser({
    customHeaders: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "application/rss+xml, application/xml; q=0.9, */*; q=0.8",
    },
  });

  try {
    const feed = await parser.parseURL(RSS_URL);
    const latestPosts = feed.items.slice(0, 5);

    let content = `# 최신 블로그 포스트\n\n`;
    latestPosts.forEach((post, index) => {
      content += `${index + 1}. [${post.title}](${post.link})\n`;
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
