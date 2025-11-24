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

  const items = [];

  $("div.file").each((_, el) => {
    const root = $(el);

    const link = root.find("div.title a").first();
    const name = link.text().trim();
    const href = link.attr("href");
    const fullUrl = href ? BASE + href : null;
    const id = href ? href.split("/")[2] : null; // href: "/theme/3248/..."

    const imgEl = root.find("div.thumb a img").first();
    const imgSrc = imgEl.attr("src");
    const image = imgSrc
      ? (imgSrc.startsWith("http") ? imgSrc : BASE + imgSrc)
      : null;

    const date = root.find("div.date").text().trim() || null;

    const sizeSpan = root.find("div.size span").text().trim();
    const size = sizeSpan || null;

    const accesses = root.find("div.accesses");
    const viewsTxt = accesses.first().text().trim();
    const views = parseInt(viewsTxt.replace(/\D/g, ""), 10) || 0;

    const commentsTxt = accesses
      .filter((_, cEl) => load(cEl).text().includes("Comment"))
      .text()
      .trim();
    const comments = parseInt(commentsTxt.replace(/\D/g, ""), 10) || 0;

    // País desde la imagen de bandera si existe
    const countryImg = root.find("img[src*='/img/flags/']").attr("src");
    const country = countryImg
      ? countryImg.split("/").pop().split(".")[0].toUpperCase()
      : null;

    items.push({
      id,
      name,
      url: fullUrl,
      image,
      downloadUrl: null,
      rating: 0,
      date,
      size,
      views,
      comments,
      country,
    });
  });

  const nextLink = $('a').filter((_, a) =>
    load(a).text().toLowerCase().includes("next")
  ).attr("href");
  const nextPage = nextLink ? BASE + nextLink : null;

  return { items, nextPage };
}

async function resolveDownloadUrl(item) {
  if (!item.url) return item;

  try {
    const res = await fetch(item.url);
    const html = await res.text();
    const $ = load(html);

    const dl = $("a[href*='/download/'], a[href*='/theme/']").filter((_, a) =>
      load(a).text().toLowerCase().includes("download")
    ).attr("href");

    if (dl) {
      item.downloadUrl = dl.startsWith("http") ? dl : BASE + dl;
    }
  } catch (err) {
    console.warn("Error resolving download for", item.url, err);
  }

  return item;
}

async function main() {
  console.log("Scraping Themes…");

  let url = START_URL;
  const all = [];

  while (url) {
    console.log("Scraping página:", url);
    const { items, nextPage } = await scrapePage(url);
    all.push(...items);
    url = nextPage;
  }

  console.log(`Encontrados ${all.length} items, resolviendo URLs de descarga…`);

  const resolved = await Promise.all(all.map(resolveDownloadUrl));

  fs.writeFileSync("raw.json", JSON.stringify(resolved, null, 2));
  console.log("raw.json guardado con datos.");
}

main();
