import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Items } from "../src/core/items";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(dirname, "../doc/items.json");

fs.writeFileSync(outputPath, JSON.stringify(Items), "utf-8");
console.log(`Exported items to ${outputPath}`);
