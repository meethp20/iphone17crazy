const fs = require("fs");
const path = require("path");

const sourcePath =
  "C:/Users/meeth/.gemini/antigravity/brain/839353bf-c2d3-4924-8728-c127f7c471e0/iphone_frame_placeholder_1768759372939.png";
const targetDir = path.join(__dirname, "../public/frames");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log(`Copying frames to ${targetDir}...`);

try {
  const frameCount = 120;
  // Read source
  const data = fs.readFileSync(sourcePath);

  for (let i = 0; i < frameCount; i++) {
    const fileName = `frame_${i}_delay-0.04s.webp`; // Renaming to .webp as requested, though content is PNG
    const destPath = path.join(targetDir, fileName);
    fs.writeFileSync(destPath, data);
  }
  console.log("Successfully created 120 dummy frames.");
} catch (err) {
  console.error("Error creating frames:", err);
}
