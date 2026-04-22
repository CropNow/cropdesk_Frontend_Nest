const fs = require('fs');
const path = 'c:\\Users\\Admin\\Desktop\\CropNow\\cropnow_combined_project\\src\\pages\\Dashboard2.tsx';
let lines = fs.readFileSync(path, 'utf8').split('\n');

// We want to remove lines 819 and 820 if they are exactly as we saw
// lines are 0-indexed, so line 819 is index 818
if (lines[818] && lines[818].includes(');')) {
    lines.splice(818, 2); 
    fs.writeFileSync(path, lines.join('\n'), 'utf8');
    console.log('Successfully cleaned up duplicate brackets');
} else {
    // Search for the duplicate pattern if line numbers changed
    const content = lines.join('\n');
    const pattern = /}\s*\);\s*}/;
    const fixed = content.replace(pattern, '}');
    fs.writeFileSync(path, fixed, 'utf8');
    console.log('Successfully applied fallback pattern fix');
}
