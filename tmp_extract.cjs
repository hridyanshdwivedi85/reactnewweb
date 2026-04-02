const fs = require('fs');
const html = fs.readFileSync('C:/Users/HP/OneDrive/Desktop/HRD/Hridyansh-portfolio-main/index.html', 'utf8');

const extract = (id) => {
    let startIndex = html.indexOf('id="' + id + '"');
    if (startIndex === -1) return '';
    
    let divStart = html.lastIndexOf('<div', startIndex);
    
    let count = 0;
    let i = divStart;
    let endIdx = -1;
    while(i < html.length) {
        if (html.substring(i, i+4) === '<div') {
            count++;
            i += 4;
        } else if (html.substring(i, i+6) === '</div>') {
            count--;
            if (count === 0) {
                endIdx = i;
                break;
            }
            i += 6;
        } else {
            i++;
        }
    }
    
    if (endIdx !== -1) {
        const firstClose = html.indexOf('>', divStart) + 1;
        return html.substring(firstClose, endIdx);
    }
    return '';
}

const modules = [
    'mod-neural',
    'mod-brew',
    'mod-compiler',
    'mod-portfolio',
    'mod-music',
    'mod-entropy'
];

let output = 'export const LABS_CONTENT = {\n';
for (const mod of modules) {
    const raw = extract(mod);
    output += `  '${mod}': \`${raw.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`,\n`;
}
output += '};\n';

fs.writeFileSync('C:/Users/HP/OneDrive/Desktop/HRD/Hridyansh-portfolio-main/portfolio-react/src/pages/LabsContent.js', output);
console.log('Done!');
