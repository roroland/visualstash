// scripts/scrape-themes.js
import fetch from "node-fetch";
import { load } from "cheerio";
import fs from "fs";

const BASE = "https://stash.reaper.fm";
const START_URL = `${BASE}/tag/Themes`;

async function scrapePage(url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = load(html);

  let items = [];

  $(".stash-search-result").each((_, el) => {
    const root = $(el);

    const link = root.find(".stash-search-filename a");
    const name = link.text().trim();
    const href = link.attr("href");
    const fullUrl = BASE + href;
    const id = href.split("/").pop();

    const img = root.find("img").attr("src");
    const image = img?.startsWith("http") ? img : BASE + img;

    const rating = parseFloat(root.find(".rating").text().trim()) || 0;

    const date = root.find(".date").text().trim() || null;

    const size = root.find(".size").text().trim().replace("Size:", "").trim();

    const viewsTxt = root.find(".views").text().trim();
    const views = parseInt(viewsTxt.replace(/\D/g, "")) || 0;

    const commentsTxt = root.find(".comments").text().trim();
    const comments = parseInt(commentsTxt.replace(/\D/g, "")) || 0;

    const country = root.find("img.flag").attr("title") || null;

    items.push({
      id,
      name,
      url: fullUrl,
      image,
      downloadUrl: null,
      rating,
      date,
      size,
      views,
      comments,
      country
    });
  });

  // paginación real
  const nextRel = $('a[href*="?page="]')
    .filter((_, el) => $(el).text().toLowerCase().includes("next"))
    .attr("href");

  return {
    items,
    nextPage: nextRel ? BASE + nextRel : null
  };
}

async function resolveDownloadUrl(item) {
  try {
    const res = await fetch(item.url);
    const html = await res.text();
    const $ = load(html);

    const link = $("a.stash-download-button").attr("href");
    if (link) {
      item.downloadUrl = link.startsWith("http") ? link : BASE + link;
    }
  } catch {
    // si falla, no rompe el flujo
  }

  return item;
}

async function main() {
  console.log("Scraping Themes...");

  let url = START_URL;
  let all = [];

  while (url) {
    console.log("Scraping:", url);
    const { items, nextPage } = await scrapePage(url);
    all.push(...items);
    url = nextPage;
  }

  console.log("Resolving download URLs...");

  const resolved = await Promise.all(all.map(resolveDownloadUrl));

  fs.writeFileSync("raw.json", JSON.stringify(resolved, null, 2));
  console.log("raw.json generated");
}

main();
