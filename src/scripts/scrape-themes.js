// scripts/scrape-themes.js
import fetch from "node-fetch";
import cheerio from "cheerio";
import fs from "fs";

const BASE = "https://stash.reaper.fm";
const START_URL = `${BASE}/tag/Themes`;

async function scrapePage(url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  let items = [];

  $(".stash-search-result").each((_, el) => {
    const root = $(el);

    const linkEl = root.find(".stash-search-filename a");
    const name = linkEl.text().trim();
    const relative = linkEl.attr("href");
    const url = BASE + relative;
    const id = relative.split("/").pop();

    const img = root.find("img").attr("src");
    const image = img?.startsWith("http") ? img : BASE + img;

    const rating = parseFloat(root.find(".rating").text().trim()) || 0;

    const date = root.find(".date").text().trim() || null;

    const sizeTxt = root.find(".size").text().trim();
    const size = sizeTxt.replace("Size:", "").trim();

    const viewsTxt = root.find(".views").text().trim();
    const views = parseInt(viewsTxt.replace(/\D/g, ""), 10) || 0;

    const commentsTxt = root.find(".comments").text().trim();
    const comments = parseInt(commentsTxt.replace(/\D/g, ""), 10) || 0;

    const country = root.find("img.flag").attr("title") || null;

    items.push({
      id,
      name,
      url,
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

  // paginación real: busca links que contengan ?page=
  const nextPageRel = $('a[href*="?page="]').filter((_, el) => {
    return $(el).text().trim().toLowerCase().includes("next");
  }).attr("href");

  const nextPage = nextPageRel ? BASE + nextPageRel : null;

  return { items, nextPage };
}

// Obtiene botón real de descarga
async function resolveDownloadUrl(item) {
  try {
    const res = await fetch(item.url);
    const html = await res.text();
    const $ = cheerio.load(html);

    const dl = $("a.stash-download-button").attr("href");
    if (dl) {
      item.downloadUrl = dl.startsWith("http") ? dl : BASE + dl;
    }
  } catch {
    // en caso de error, no rompe todo
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
    all = all.concat(items);
    url = nextPage;
  }

  console.log("Resolving download URLs...");

  // paralelizar para que sea rápido y no rompa el job
  const resolved = await Promise.all(all.map(item => resolveDownloadUrl(item)));

  fs.writeFileSync("raw.json", JSON.stringify(resolved, null, 2));

  console.log("raw.json generated");
}

main();
