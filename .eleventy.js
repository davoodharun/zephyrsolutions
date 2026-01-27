const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  // Copy static assets
  // Copy CSS directory to root of output
  eleventyConfig.addPassthroughCopy({
    "public/css": "css",
    "public/images": "images",
    "public/js": "js"
  });

  // Add pages collection from content/pages/
  eleventyConfig.addCollection("pages", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/pages/*.md");
  });

  // Add portfolio collection from content/portfolio/
  eleventyConfig.addCollection("portfolio", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/portfolio/*.md")
      .filter(item => !item.data.draft);
  });

  // Add services collection from content/services/
  eleventyConfig.addCollection("services", function(collectionApi) {
    return collectionApi.getFilteredByGlob("content/services/*.md")
      .filter(item => !item.data.draft);
  });

  // Load global settings
  eleventyConfig.addGlobalData("globalSettings", function() {
    const fs = require("fs");
    const path = require("path");
    const settingsPath = path.join(__dirname, "content/global/settings.json");
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    }
    return {};
  });

  // Image optimization shortcode
  eleventyConfig.addAsyncShortcode("image", async function(src, alt, widths = [400, 800, 1200]) {
    if (!src) return "";
    
    let metadata = await Image(src, {
      widths: widths,
      formats: ["webp", "jpeg"],
      outputDir: "_site/images/",
      urlPath: "/images/",
    });

    let imageAttributes = {
      alt: alt || "",
      loading: "lazy",
      decoding: "async",
    };

    // Generate srcset
    let srcset = "";
    let sizes = "(max-width: 800px) 100vw, (max-width: 1200px) 50vw, 33vw";
    
    for (let format in metadata) {
      srcset = metadata[format].map(entry => `${entry.url} ${entry.width}w`).join(", ");
      break; // Use first format (webp)
    }

    return Image.generateHTML(metadata, imageAttributes, {
      whitespaceMode: "inline"
    });
  });

  // Add custom date filter for Nunjucks
  eleventyConfig.addFilter("date", function(date, format) {
    const d = date ? new Date(date) : new Date();
    if (format === "YYYY") {
      return d.getFullYear().toString();
    }
    return d.toLocaleDateString();
  });

  // Add limit filter for arrays
  eleventyConfig.addFilter("limit", function(array, limit) {
    if (!array || !Array.isArray(array)) {
      return [];
    }
    return array.slice(0, limit || array.length);
  });

  // Return configuration object
  return {
    dir: {
      input: ".",  // Process from root to include both src/ and content/
      output: "_site",
      includes: "src/_includes",
      data: "src/_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: "/"
  };
};
