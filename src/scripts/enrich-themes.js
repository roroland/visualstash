// scripts/enrich-themes.js
import fs from "fs";

function getExtension(url) {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.endsWith(".reaperthemezip")) return "reaperthemezip";
  if (lower.endsWith(".reapertheme")) return "reapertheme";
  if (lower.endsWith(".reaperconfigzip")) return "reaperconfigzip";
  if (lower.endsWith(".zip")) return "zip";
  if (lower.endsWith(".rar")) return "rar";
  if (lower.endsWith(".7z")) return "7z";
  if (lower.endsWith(".png")) return "png";
  if (lower.endsWith(".jpg")) return "jpg";
  return null;
}

function inferNameTags(name) {
  const n = name.toLowerCase();
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

function inferExtTags(item) {
  const ext = getExtension(item.downloadUrl);
  return ext ? [ext] : [];
}

function clean(tags) {
  return [...new Set(tags.filter(Boolean))];
}

function main() {
  const raw = JSON.parse(fs.readFileSync("raw.json", "utf8"));

  const enriched = raw.map(item => {
    const tags = [
      "Themes",
      ...inferExtTags(item),
      ...inferNameTags(item.name)
    ];

    return {
      ...item,
      tags: clean(tags)
    };
  });

  fs.writeFileSync("src/assets/data/themes.json", JSON.stringify(enriched, null, 2));
  console.log("themes.json generated");
}

main();
