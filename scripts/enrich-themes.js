// scripts/enrich-themes.js
import fs from "fs";

function getExtension(url) {
  if (!url) return null;
  const lower = url.toLowerCase();
  const exts = [
    "reaperthemezip",
    "reapertheme",
    "reaperconfigzip",
    "zip",
    "rar",
    "7z",
    "png",
    "jpg"
  ];
  for (const ext of exts) {
    if (lower.endsWith("." + ext)) {
      return ext;
    }
  }
  return null;
}

function inferNameTags(name = "") {
  const n = name.toLowerCase();
  const tags = [];
  if (n.includes("default 5")) tags.push("default5");
  if (n.includes("default 7")) tags.push("default7");
  if (n.includes("dark")) tags.push("dark");
  if (n.includes("light")) tags.push("light");
  if (n.includes("classic")) tags.push("classic");
  if (n.includes("theme")) tags.push("theme");
  if (n.includes("reaper")) tags.push("reaper");
  return tags;
}

function inferCountry(item) {
  // Si estás extrayendo country en scraper, mantené la etiqueta
  if (item.country) {
    return [item.country.toLowerCase()];
  }
  return [];
}

function cleanTags(tags) {
  return [...new Set(tags.filter(Boolean))];
}

function main() {
  const raw = JSON.parse(fs.readFileSync("raw.json", "utf-8"));

  const enriched = raw.map(item => {
    const ext = getExtension(item.downloadUrl);
    const extTags = ext ? [ext] : [];

    const nameTags = inferNameTags(item.name);

    const countryTags = inferCountry(item);

    const tags = cleanTags(["Themes", ...extTags, ...nameTags, ...countryTags]);

    return {
      ...item,
      tags
    };
  });

  fs.writeFileSync("src/assets/data/themes.json", JSON.stringify(enriched, null, 2));
  console.log("themes.json generated (“enriched” con tags).");
}

main();
