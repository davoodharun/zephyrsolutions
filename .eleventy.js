const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  // Get pathPrefix from environment variable (for GitHub Pages) or default to "/"
  // Normalize to ensure it's always a URL path starting with "/"
  let pathPrefix = process.env.PATH_PREFIX || "/";
  // If it looks like a Windows path, extract just the repository name
  if (pathPrefix.includes(":") || pathPrefix.includes("\\")) {
    // Extract repository name from path (e.g., "C:/path/to/zephyrsolutions/" -> "/zephyrsolutions/")
    const match = pathPrefix.match(/([^\/\\]+)[\/\\]*$/);
    pathPrefix = match ? `/${match[1]}/` : "/";
  }
  // Ensure it starts with / and ends with /
  if (!pathPrefix.startsWith("/")) {
    pathPrefix = `/${pathPrefix}`;
  }
  if (pathPrefix !== "/" && !pathPrefix.endsWith("/")) {
    pathPrefix = `${pathPrefix}/`;
  }
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

  // Add basePath as global data (use the normalized pathPrefix)
  eleventyConfig.addGlobalData("basePath", pathPrefix);

  // Image optimization shortcode
  eleventyConfig.addAsyncShortcode("image", async function(src, alt, widths = [400, 800, 1200]) {
    if (!src) return "";
    
    // Get pathPrefix from environment or default to "/"
    const pathPrefix = process.env.PATH_PREFIX || "/";
    
    let metadata = await Image(src, {
      widths: widths,
      formats: ["webp", "jpeg"],
      outputDir: "_site/images/",
      urlPath: `${pathPrefix}images/`,
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

  // Add mailto filter to generate pre-populated email links
  eleventyConfig.addFilter("mailto", function(email, subject, body) {
    if (!email) return "";
    let mailtoLink = `mailto:${email}`;
    const params = [];
    if (subject) {
      params.push(`subject=${encodeURIComponent(subject)}`);
    }
    if (body) {
      params.push(`body=${encodeURIComponent(body)}`);
    }
    if (params.length > 0) {
      mailtoLink += `?${params.join("&")}`;
    }
    return mailtoLink;
  });

  // Add pathPrefix filter to prefix URLs with the base path
  eleventyConfig.addFilter("base", function(url) {
    if (!url) return "";
    // Don't modify external URLs or mailto links
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//") || url.startsWith("mailto:")) {
      // Convert protocol-relative URLs to HTTPS
      if (url.startsWith("//")) {
        return "https:" + url;
      }
      // Convert HTTP to HTTPS for external URLs
      if (url.startsWith("http://")) {
        return url.replace("http://", "https://");
      }
      return url;
    }
    // Handle anchor links - prefix with basePath if not root
    if (url.startsWith("#")) {
      return pathPrefix === "/" ? url : `${pathPrefix}${url}`;
    }
    // If pathPrefix is "/", return the URL as-is (with leading slash)
    if (pathPrefix === "/") {
      return url.startsWith("/") ? url : `/${url}`;
    }
    // Otherwise, ensure URL doesn't start with / and combine with pathPrefix
    const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
    return `${pathPrefix}${cleanUrl}`;
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
    pathPrefix: pathPrefix
  };
};
