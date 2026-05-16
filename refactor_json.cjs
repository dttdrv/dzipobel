const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'content', 'literature');
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.json')) {
    const filePath = path.join(dir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    if (content.examFocus) {
      const focus = content.examFocus;
      
      let additions = [];
      if (focus.titleMeaning) {
        additions.push(focus.titleMeaning);
      }
      if (focus.genreRationale) {
        additions.push(focus.genreRationale);
      }
      
      if (additions.length > 0) {
        content.aboutWork += '\n\n' + additions.join(' ');
      }
      
      delete content.examFocus;
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
      console.log(`Refactored ${file}`);
    }
  }
}
