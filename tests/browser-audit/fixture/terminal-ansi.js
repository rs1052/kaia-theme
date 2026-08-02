const colors = [31, 32, 33, 34, 35, 36, 37, 90, 91, 92, 93, 94, 95, 96, 97];
for (const color of colors)
  console.log(`\u001b[${color}mANSI ${color}\u001b[0m`);
console.log("\u001b[1mBold\u001b[0m and \u001b[7mreverse video\u001b[0m");
