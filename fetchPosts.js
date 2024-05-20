const Parser = require('rss-parser');
const fs = require('fs');

const RSS_URL = 'https://shqpdltm.tistory.com/rss';

(async () => {
  const parser = new Parser();
  const feed = await parser.parseURL(RSS_URL);
  const latestPosts = feed.items.slice(0, 5);

  let content = `# 최신 블로그 포스트\n\n`;
  latestPosts.forEach((post, index) => {
    content += `${index + 1}. [${post.title}](${post.link})\n`;
  });

  const readmeContent = fs.readFileSync('README.md', 'utf8');
  const updatedReadmeContent = readmeContent.replace(
    /<!-- LATEST_POSTS -->[\s\S]*<!-- LATEST_POSTS_END -->/,
    `<!-- LATEST_POSTS -->\n${content}\n<!-- LATEST_POSTS_END -->`
  );

  fs.writeFileSync('README.md', updatedReadmeContent);
})();
