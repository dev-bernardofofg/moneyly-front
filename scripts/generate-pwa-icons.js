const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const sizes = [192, 512];

async function generateIcons() {
  const inputPath = path.join(__dirname, "../public/logo-moneyly.png");
  const outputDir = path.join(__dirname, "../public");

  try {
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

      await sharp(inputPath)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated icon-${size}x${size}.png`);
    }

    console.log("🎉 All PWA icons generated successfully!");
  } catch (error) {
    console.error("❌ Error generating icons:", error);
  }
}

generateIcons();
