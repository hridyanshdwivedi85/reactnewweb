const fs = require('fs');

// 1. Process index.html to LabsPage.jsx
const html = fs.readFileSync('../index.html', 'utf-8');
const lines = html.split('\n');

let startIndex = lines.findIndex(l => l.includes('<!-- MODULE 1: NEURAL CORE -->'));
let endIndex = lines.findIndex(l => l.includes('<!-- MODULE 6: NETWORK (LinkedIn & Terminal) -->'));

if (startIndex !== -1 && endIndex !== -1) {
    let labsHtml = lines.slice(startIndex, endIndex).join('\n');
    
    // We use innerHTML, so we escape backticks and dollar signs to safely inject it as a string literal.
    labsHtml = labsHtml.replace(/`/g, '\\`').replace(/\$/g, '\\$');

    const finalComponent = `import React, { useEffect } from 'react';
import '../labs.css';

export default function LabsPage() {
    useEffect(() => {
        // Load GSAP
        if (!window.gsap) {
            const gsapScript = document.createElement('script');
            gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
            document.head.appendChild(gsapScript);
        }

        const script = document.createElement('script');
        script.src = '/labs_legacy.js';
        script.onload = () => {
            if (window.initLabs) window.initLabs();
        };
        document.body.appendChild(script);

        return () => {
            if (script.parentNode) script.parentNode.removeChild(script);
        };
    }, []);

    const rawHTML = \`${labsHtml}\`;

    return (
        <div className="labs-container w-full min-h-screen bg-[var(--bg-dark)] text-white pt-[100px] pb-32 overflow-x-hidden">
            <div className="flex flex-col gap-32" dangerouslySetInnerHTML={{ __html: rawHTML }} />
        </div>
    );
}`;

    fs.writeFileSync('src/pages/LabsPage.jsx', finalComponent);
    console.log('LabsPage.jsx written');
} else {
    console.log("Could not find start/end comments block.");
}

// 2. Modify labs_legacy.js
let appJs = fs.readFileSync('public/labs_legacy.js', 'utf-8');

// replace DOMContentLoaded with window.initLabs
appJs = appJs.replace("document.addEventListener('DOMContentLoaded', () => {", "window.initLabs = function() {");

// Handle audio unlock logic since we skip the overlay in our React app
appJs = appJs.replace(/const unlockOverlay = document\.getElementById\('audio-unlock'\);/g, `const unlockOverlay = document.getElementById('audio-unlock');
if(!unlockOverlay) { 
    window.AudioEngine = AudioEngine; 
    if(window.AudioEngine && !window.AudioEngine.unlocked) { 
        window.AudioEngine.init(); 
    } 
}`);

appJs = appJs.replace(/unlockOverlay\.addEventListener/g, 'if(unlockOverlay) unlockOverlay.addEventListener');

// Make the nav elements logic safe
appJs = appJs.replace(/this\.tabNavItems = Array\.from\(this\.navItems\)\.filter/g, 'this.tabNavItems = (this.navItems ? Array.from(this.navItems) : []).filter');
appJs = appJs.replace(/this\.navItems\.forEach/g, 'if(this.navItems) this.navItems.forEach');

// AppController init might cause issues if navigation items are missing, disable it for Labs
appJs = appJs.replace(/AppController\.init\(\);/g, '// AppController.init() disabled for LabsPage');
appJs = appJs.replace(/BGEngine\.init\(\);/g, '// BGEngine.init() disabled for LabsPage');

// Also remove switchTab calls that run by default if hash is missing
appJs = appJs.replace(/const hash = window\.location\.hash\.substring\(1\);/g, 'const hash = "";');

fs.writeFileSync('public/labs_legacy.js', appJs);
console.log('labs_legacy.js modified');
