import { importMusic } from "./import-music.js";
import { updateAlbumCovers } from "./updateAlbumCovers.js";
import { prisma } from "../src/lib/prisma.js";

//run import locally from a script
async function main() {
  try {
    const result = await importMusic();
    await updateAlbumCovers();
    if (result.failed > 0) {
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Music import failed:", error);
  process.exitCode = 1;
});
