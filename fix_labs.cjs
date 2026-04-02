const fs = require('fs');
const content = fs.readFileSync('dist/labs_legacy.js', 'utf8');

const idx = content.lastIndexOf("OriginPrompt.init();");
if (idx === -1) {
    console.error("Could not find OriginPrompt.init();");
    process.exit(1);
}

const base = content.slice(0, idx);

const injected = `
    // Expose BGEngine globally so LabsPage.jsx can call setTheme
    window.BGEngine = BGEngine;
    window.EntropyEngine = EntropyEngine;

    // Init BGEngine only if canvas exists
    if (document.getElementById('bg-canvas')) {
        BGEngine.canvas = document.getElementById('bg-canvas');
        BGEngine.init();
    }
    
    try { OriginPrompt.init(); } catch(e) {}
    try { NeuralCore.init(); } catch(e) {}
    try { MixologyEngine.init(); } catch(e) {}
    try { CompilerArena.init(); } catch(e) {}
    try { SocialCard.init(); } catch(e) {}
    try { MusicPlayer.init(); } catch(e) {}
    try { EntropyEngine.init(); } catch(e) {}

    // Expose individual module re-init functions for React lifecycle
    window.initNeuralCore = () => { try { NeuralCore.init(); } catch(e) {} };
    window.initBrewLab = () => { try { MixologyEngine.init(); } catch(e) {} };
    window.initCompiler = () => { try { CompilerArena.init(); } catch(e) {} };
    window.initMusic = () => { try { MusicPlayer.init(); } catch(e) {} };
    window.initEntropy = () => { 
        try { 
            if (window.EntropyEngine) { 
                EntropyEngine.sequenceStarted = true; 
                EntropyEngine.runSequence(); 
            } 
        } catch(e) {} 
    };
};
`;

let finalStr = base + injected;

// Add safety checks to NeuralCore.init
finalStr = finalStr.replace(
    "const btnPower = document.getElementById('ai-btn-power');",
    "const btnPower = document.getElementById('ai-btn-power');\n            if(!btnPower) return;"
);

// Add safety checks to MixologyEngine.init
finalStr = finalStr.replace(
    "const btnWhiskey = document.getElementById('btn-whiskey');",
    "const btnWhiskey = document.getElementById('btn-whiskey');\n            if(!btnWhiskey) return;"
);

// Fix UI DOM IDs for MixologyEngine
finalStr = finalStr.replace("liquid: document.getElementById('mix-liquid')", "liquid: document.getElementById('the-liquid')");
finalStr = finalStr.replace("glass: document.getElementById('mix-glass')", "glass: document.getElementById('the-glass')");
finalStr = finalStr.replace("stream: document.getElementById('mix-stream')", "stream: document.getElementById('pour-stream')");
finalStr = finalStr.replace("stem: document.getElementById('mix-stem')", "stem: document.getElementById('wine-stem')");

fs.writeFileSync('public/labs_legacy.js', finalStr);
console.log("Success! File fixed cleanly.");
