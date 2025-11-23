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

    const name = root.find(".stash-search-filename a").text().trim();
    const url = BASE + root.find(".stash-search-filename a").attr("href");
    const id = url.split("/").pop();

    const image = root.find("img").attr("src");
    const imgAbsolute = image?.startsWith("http") ? image : BASE + image;

    const rating = root.find(".rating").text().trim() || null;
    const date = root.find(".date").text().trim() || null;
    const size = root.find(".size").text().trim() || null;
    const views = root.find(".views").text().trim() || null;
    const comments = root.find(".comments").text().trim() || null;
    const country = root.find("img.flag").attr("title") || null;

    items.push({
      id,
      name,
      url,
      image: imgAbsolute || null,
      downloadUrl: null,  // se completa luego
      rating,
      date,
      size,
      views,
      comments,
      country
    });
  });

  // detecta paginación
  const nextLink = $(".pagination a.next").attr("href");
  const nextPage = nextLink ? BASE + nextLink : null;

  return { items, nextPage };
}

// Para obtener la URL real de descarga (si existe página interna)
async function resolveDownloadUrl(item) {
  const res = await fetch(item.url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const dl = $("a.stash-download-button").attr("href");
  if (!dl) return item;

  item.downloadUrl = dl.startsWith("http") ? dl : BASE + dl;
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

  // resolver downloadUrl una por una
  for (let i = 0; i < all.length; i++) {
    all[i] = await resolveDownloadUrl(all[i]);
    console.log(`Resolved ${i+1}/${all.length}`);
  }

  fs.writeFileSync("raw.json", JSON.stringify(all, null, 2));
  console.log("raw.json generated");
}

main();
