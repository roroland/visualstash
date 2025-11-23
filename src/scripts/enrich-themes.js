// scripts/enrich-themes.js
import fs from "fs";

function getExtension(url) {
  if (!url) return null;
  const lower = url.toLowerCase();

  return [
    "reaperthemezip",
    "reapertheme",
    "reaperconfigzip",
    "zip",
    "rar",
    "7z",
    "png",
    "jpg"
  ].find(ext => lower.endsWith("." + ext)) || null;
}

function inferNameTags(name) {
  const n = (name || "").toLowerCase();
  let tags = [];

  if (n.includes("default 5")) tags.push("default5");
  if (n.includes("default 7")) tags.push("default7");
  if (n.includes("dark")) tags.push("dark");
  if (n.includes("light")) tags.push("light");
  if (n.includes("classic")) tags.push("classic");
  if (n.includes("theme")) tags.push("theme");
  if (n.includes("reaper")) tags.push("reaper");

  return tags;
}

function main() {
  const raw = JSON.parse(fs.readFileSync("raw.json", "utf8"));

  const enriched = raw.map(item => {
    const ext = getExtension(item.downloadUrl);
    const extTags = ext ? [ext] : [];

    const nameTags = inferNameTags(item.name);

    return {
      ...item,
      tags: ["Themes", ...extTags, ...nameTags]
    };
  });

  fs.writeFileSync("src/assets/data/themes.json", JSON.stringify(enriched, null, 2));
  console.log("themes.json generated");
}

main();
