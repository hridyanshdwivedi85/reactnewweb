export const LABS_CONTENT = {
  'mod-neural': `
    <div class="w-full max-w-3xl mx-auto flex flex-col gap-3 md:gap-4 my-auto py-8 md:py-12 md:pr-32 lg:pr-48 px-4">        
        <div class="hw-panel p-3 md:p-4 flex gap-3 md:gap-4 justify-center shrink-0 flex-wrap">
            <button id="ai-btn-power" aria-label="Turn on Neural Core" class="hw-btn sound-click w-20 md:w-24 h-24 md:h-28 rounded-xl flex flex-col items-center justify-between py-3 md:py-4 cursor-pointer group"><i class="fas fa-power-off text-gray-600 text-lg md:text-xl group-hover:text-white transition"></i><div class="text-[8px] md:text-[9px] font-bold text-gray-500 tracking-widest">POWER</div><div class="hw-led" id="ai-led-power"></div></button>
            <button id="ai-btn-ingest" class="hw-btn sound-click w-20 md:w-24 h-24 md:h-28 rounded-xl flex flex-col items-center justify-between py-3 md:py-4 cursor-pointer opacity-50 pointer-events-none"><i class="fas fa-database text-gray-600 text-lg md:text-xl"></i><div class="text-[8px] md:text-[9px] font-bold text-gray-500 tracking-widest">INGEST</div><div class="hw-led" id="ai-led-ingest"></div></button>
            <button id="ai-btn-train" class="hw-btn sound-click w-20 md:w-24 h-24 md:h-28 rounded-xl flex flex-col items-center justify-between py-3 md:py-4 cursor-pointer opacity-50 pointer-events-none"><i class="fas fa-microchip text-gray-600 text-lg md:text-xl"></i><div class="text-[8px] md:text-[9px] font-bold text-gray-500 tracking-widest">TRAIN</div><div class="hw-led" id="ai-led-train"></div></button>
        </div>

        <div class="grid grid-cols-12 gap-4 md:gap-5 shrink-0">
            <!-- Reduced screen height to h-40 -->
            <div class="col-span-8 hw-panel p-1 hw-screen rounded-xl h-40 flex flex-col">
                <div class="scanline"></div>
                <div class="p-3 border-b border-[#222] flex justify-between items-center relative z-20">
                    <div class="flex items-center gap-3"><div class="w-2 h-2 rounded-full bg-red-900" id="sys-status-dot"></div><span class="heading-font text-white font-bold tracking-widest text-xs uppercase">Neural_GLS</span></div>
                    <span class="code-font text-[9px] text-gray-600" id="ai-status-text">SYSTEM OFFLINE</span>
                </div>
                <div class="flex-grow p-3 code-font text-[10px] text-[#d97706] opacity-0 overflow-hidden relative z-20" id="ai-terminal"><div class="w-2 h-3 bg-[#d97706] animate-pulse inline-block"></div></div>
            </div>

            <!-- Reduced gauge screen height to h-40 -->
            <div class="col-span-4 hw-panel p-1 hw-screen rounded-xl h-40 flex items-center justify-center relative">
                <div class="scanline"></div><div class="code-font text-[8px] absolute top-3 left-3 text-gray-600">PID.SYS</div>
                <div class="relative w-28 h-28 opacity-10 transition-opacity duration-1000" id="ai-gauge">
                    <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="#111" stroke-width="2"/><circle id="gauge-fill" cx="50" cy="50" r="45" fill="none" stroke="#d97706" stroke-width="4" stroke-dasharray="283" stroke-dashoffset="283" class="transition-all duration-300"/></svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center z-20"><span class="code-font text-2xl text-white font-bold" id="gauge-text">0</span><span class="text-[7px] text-gray-500 uppercase mt-1">Epochs</span></div>
                </div>
            </div>
        </div>

        <!-- Reduced orb container height to h-40 -->
        <div class="hw-panel p-6 flex justify-center items-center h-40 relative overflow-hidden shrink-0">
            <div class="absolute top-0 w-32 h-12 bg-gradient-to-b from-[#111] to-transparent rounded-b-3xl border-b border-[#333]"></div>
            <div class="w-3 h-3 bg-black rounded-full absolute top-10 border border-[#333] z-10"></div>
            <div class="mt-12 w-14 h-14 rounded-full bg-black border-2 border-[#222] shadow-[inset_0_0_20px_#000] flex items-center justify-center transition-all duration-500 relative" id="ai-orb">
                <div class="absolute inset-0 rounded-full bg-[var(--brand-orange)] opacity-0 blur-md transition-opacity duration-500" id="ai-orb-glow"></div>
                <i class="fas fa-brain text-[#333] text-xl transition-colors duration-500 z-10" id="ai-orb-icon"></i>
            </div>
            <div id="data-drops" class="absolute inset-0 pointer-events-none z-0"></div>
        </div>
    </div>
`,
  'mod-brew': `
    <div class="w-full max-w-5xl mx-auto h-full flex flex-col justify-start md:justify-center items-center relative pt-4 md:pt-0 pb-10 px-2 md:px-0">
        
        <!-- MAIN MACHINE SHELL -->
        <div id="mixology-panel" class="relative w-full max-w-[900px] flex flex-col gap-0 rounded-[24px] border border-white/10 bg-[#0a0a0c] shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden z-10">
            
            <!-- TOP BRANDING & STATUS (The "Brain") -->
            <div class="bg-gradient-to-r from-[#111115] to-[#0d0d12] p-5 md:p-6 border-b border-white/5 flex justify-between items-center z-20 shadow-md">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]">
                            <img src="assets/images/jack-daniels-mark.svg" alt="Jack Daniel's modern monogram logo" class="w-8 h-8 object-contain opacity-95">
                        </div>
                        <div>
                            <div class="heading-font text-2xl md:text-3xl font-extrabold tracking-tighter text-white">JACK DANIEL'S<span class="text-[var(--brand-orange)] font-light italic"> LAB</span></div>
                        <div class="code-font text-[8px] md:text-[9px] text-gray-500 tracking-[0.3em] mt-1">PRO-MIXOLOGY ENGINE v3.2</div>
                        </div>
                    </div>
                <div class="text-right hidden md:block">
                    <div class="flex items-center justify-end gap-2 mb-1 bg-black/50 px-3 py-1.5 rounded-full border border-white/5">
                        <div class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div>
                        <span class="code-font text-[10px] text-green-400 font-bold tracking-widest" id="mix-status-text">SYSTEM READY</span>
                    </div>
                    <div class="code-font text-[8px] text-gray-600 tracking-widest mt-2">FLUID DYNAMICS: NOMINAL</div>
                </div>
            </div>

            <!-- MACHINE INTERFACE (Custom Flexbox Layout) -->
            <div class="machine-layout bg-[#0a0a0c]">
                
                <!-- LEFT CONTROLS -->
                <div class="machine-controls-left bg-[#0d0d12]">
                    <div class="mb-6">
                        <div class="code-font text-[9px] text-gray-500 tracking-widest mb-3">1. SPIRIT SELECTION</div>
                        <div class="flex flex-col gap-2">
                            <button id="btn-whiskey" class="neo-btn active sound-click"><i class="fas fa-glass-whiskey"></i> WHISKEY</button>
                            <button id="btn-wine" class="neo-btn sound-click"><i class="fas fa-wine-glass-alt"></i> RED WINE</button>
                            <button id="btn-vodka" class="neo-btn sound-click"><i class="fas fa-glass-martini-alt"></i> VODKA</button>
                        </div>
                    </div>
                    
                    <div class="h-[1px] w-full bg-white/5 mb-6"></div>

                    <div>
                        <div class="code-font text-[9px] text-gray-500 tracking-widest mb-3">2. MODIFIERS</div>
                        <button id="btn-ice" class="neo-btn w-full justify-center sound-click mb-5 border-cyan-500/30 hover:border-cyan-400 hover:text-cyan-300">
                            <i class="fas fa-icicles text-cyan-400"></i> DISPENSE ICE
                        </button>
                        
                        <div class="code-font text-[9px] text-gray-400 flex justify-between mb-2">
                            <span>H2O DILUTION</span> <span id="val-water" class="text-blue-400 font-bold">0ml</span>
                        </div>
                        <input type="range" id="slider-water" min="0" max="100" value="0" class="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    </div>
                </div>

                <!-- CENTER STAGE (The Glass & Pourer) -->
                <div class="machine-stage">
                    
                    <!-- HUD Overlays -->
                    <div class="absolute top-4 left-4 z-30">
                        <div class="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 w-24 shadow-xl">
                            <div class="code-font text-[8px] text-gray-500 mb-1">TOTAL VOL</div>
                            <div class="code-font text-2xl text-white font-bold" id="readout-vol">0<span class="text-[10px] text-gray-500 ml-1">ml</span></div>
                        </div>
                    </div>
                    <div class="absolute top-4 right-4 z-30 text-right">
                        <div class="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 w-24 shadow-xl">
                            <div class="code-font text-[8px] text-gray-500 mb-1">EST. ABV</div>
                            <div class="code-font text-2xl text-[var(--brand-orange)] font-bold" id="readout-abv">0.0<span class="text-[10px] text-orange-700 ml-1">%</span></div>
                        </div>
                    </div>
                    <div class="absolute top-[7.6rem] right-4 z-30 text-right">
                        <div class="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-3 w-24 shadow-xl">
                            <div class="code-font text-[8px] text-gray-500 mb-1">GLASS TEMP</div>
                            <div class="code-font text-xl text-cyan-300 font-bold" id="readout-temp">18<span class="text-[10px] text-cyan-700 ml-1">°C</span></div>
                        </div>
                    </div>

                    <!-- Dispenser Nozzle -->
                    <div class="absolute top-0 w-20 h-10 bg-gradient-to-b from-[#222] to-[#111] border-b-2 border-[#333] rounded-b-2xl z-30 flex justify-center items-end pb-1 shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                        <div class="w-6 h-2 bg-black rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,1)]"></div>
                        <!-- Physical Liquid Stream -->
                        <div id="pour-stream" class="absolute top-[100%] w-3 bg-transparent h-[300px] origin-top scale-y-0 z-20 transition-transform rounded-full filter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]"></div>
                    </div>

                    <!-- Realistic Glass Area -->
                    <div class="relative z-10 flex flex-col items-center justify-end w-full pb-0 glass-stage-area">
                        
                        <!-- The Glass -->
                        <div id="the-glass" class="realistic-glass whiskey-shape">
                            <!-- Background Reflection -->
                            <div class="glass-back"></div>
                            
                            <!-- Liquid Fill Layer -->
                            <div id="the-liquid" class="realistic-liquid"></div>
                            
                            <!-- Container for Physics Ice -->
                            <div id="ice-container" class="absolute inset-0 pointer-events-none z-[15] overflow-hidden rounded-inherit"></div>
                            
                            <!-- Front Glass Highlights -->
                            <div class="glass-front"></div>
                        </div>
                        
                        <!-- Wine Stem (Toggled via JS) -->
                        <div id="wine-stem" class="w-3 h-20 bg-gradient-to-r from-white/20 via-white/50 to-white/20 opacity-0 transition-opacity border-x border-white/30 relative z-0">
                            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-3 bg-gradient-to-t from-white/40 to-transparent rounded-[50%] border border-white/30"></div>
                        </div>
                    </div>

                    <!-- Drip Tray (Bottom) -->
                    <div class="drip-tray absolute bottom-0 w-full h-8 z-20"></div>
                </div>

                <!-- RIGHT ACTION BUTTONS -->
                <div class="machine-controls-right bg-[#0d0d12]">
                    <div class="hidden md:block mb-8">
                        <div class="code-font text-[9px] text-gray-500 tracking-widest mb-3">SYSTEM DIAGNOSTICS</div>
                        <div class="bg-black/50 border border-white/5 rounded-lg p-3 font-mono text-[10px] text-green-400/70 leading-relaxed shadow-inner">
                            > PUMP 1: STANDBY<br>
                            > PUMP 2: STANDBY<br>
                            > CHILLER: -2°C<br>
                            > VALVE A: CLOSED<br>
                            > PRESSURE: 9 BAR
                        </div>
                    </div>

                    <div class="flex flex-col gap-3 mt-auto">
                        <button id="btn-reset" class="w-full bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500 font-bold py-4 rounded-xl text-xs tracking-widest transition-all sound-click">
                            <i class="fas fa-trash-alt mr-2"></i> FLUSH GLASS
                        </button>
                        <button id="btn-add-water" class="w-full bg-transparent border border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 font-bold py-4 rounded-xl text-xs tracking-widest transition-all sound-click">
                            <i class="fas fa-droplet mr-2"></i> ADD WATER
                        </button>
                        <button id="btn-pour" class="w-full bg-[var(--brand-orange)] text-black hover:bg-orange-400 font-extrabold py-5 rounded-xl text-sm tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:shadow-[0_0_30px_rgba(217,119,6,0.7)] hover:-translate-y-1 sound-click flex items-center justify-center gap-2">
                            <i class="fas fa-power-off"></i> INITIATE POUR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`,
  'mod-compiler': `
    <div class="w-full max-w-4xl mx-auto flex flex-col gap-4 relative h-full justify-start pt-8 md:justify-center pb-32 px-2 md:px-0 md:pr-44 lg:pr-56">
        <div class="code-font text-[10px] text-[#3ddc84] tracking-widest uppercase text-center w-full mb-1 shrink-0">> UNIVERSAL DEPLOYMENT PIPELINE</div>
        <div class="flex flex-wrap justify-center gap-2 mb-1">
            <span class="build-stage" id="stage-parse">Parse</span>
            <span class="build-stage" id="stage-compile">Compile</span>
            <span class="build-stage" id="stage-bundle">Bundle</span>
            <span class="build-stage" id="stage-sign">Sign</span>
            <span class="build-stage" id="stage-deploy">Deploy</span>
        </div>
        <div class="build-progress-wrap mb-2">
            <div id="compiler-progress-bar" class="build-progress-bar"></div>
        </div>
        
        <div class="flex-grow flex items-center justify-between relative px-2 md:px-6 compiler-scale-fix origin-center w-full shrink-0 min-h-[350px]">
            <div class="compiler-col compiler-col--input flex flex-col gap-6 z-20 w-40 relative">
                <div class="compiler-node" id="node-src-1">
                    <i class="fab fa-js text-yellow-400 text-2xl mb-2"></i>
                    <div class="code-font text-[8px] text-gray-400">Main.js</div>
                </div>
                <div class="compiler-node" id="node-src-2">
                    <i class="fab fa-react text-blue-400 text-2xl mb-2"></i>
                    <div class="code-font text-[8px] text-gray-400">App.tsx</div>
                </div>
                <div class="compiler-node" id="node-src-3">
                    <i class="fab fa-css3-alt text-blue-500 text-2xl mb-2"></i>
                    <div class="code-font text-[8px] text-gray-400">Styles.css</div>
                </div>
            </div>

            <div class="relative z-30 flex flex-col items-center compiler-core-wrap">
                <div class="forge-container group" id="forge-core">
                    <div class="forge-ring ring-1"></div>
                    <div class="forge-ring ring-2"></div>
                    <div class="forge-ring ring-3"></div>
                    <div class="forge-center">
                        <i class="fas fa-cube text-white text-4xl"></i>
                    </div>
                </div>
                <button id="btn-compile-v2" class="mt-12 sound-click bg-transparent border border-[#3ddc84] text-[#3ddc84] hover:bg-[#3ddc84] hover:text-black transition-all duration-300 font-bold px-8 py-3 rounded-full text-xs tracking-widest code-font cursor-pointer z-50 shadow-[0_0_15px_rgba(61,220,132,0.2)] hover:shadow-[0_0_25px_rgba(61,220,132,0.6)]">
                    INITIALIZE BUILD
                </button>
            </div>

            <div class="compiler-col compiler-col--output flex flex-col gap-12 z-20 w-40">
                <div class="output-node opacity-30 scale-90" id="out-apple">
                    <i class="fab fa-apple text-white text-5xl"></i>
                    <div class="code-font text-[10px] text-white mt-4 font-bold tracking-widest">iOS BUILD</div>
                    <div class="status-badge">AWAITING</div>
                    <div class="output-meta">arm64 + simulator</div>
                </div>
                <div class="output-node opacity-30 scale-90" id="out-android">
                    <i class="fab fa-android text-[#3ddc84] text-5xl"></i>
                    <div class="code-font text-[10px] text-[#3ddc84] mt-4 font-bold tracking-widest">APK BUILD</div>
                    <div class="status-badge">AWAITING</div>
                    <div class="output-meta">aab + universal apk</div>
                </div>
            </div>

            <svg class="absolute inset-0 w-full h-full pointer-events-none z-10" id="pipeline-lines">
                <path class="pipe-line" id="pipe-in-1" d="M 150 150 L 350 350" />
                <path class="pipe-line" id="pipe-in-2" d="M 150 350 L 350 350" />
                <path class="pipe-line" id="pipe-in-3" d="M 150 550 L 350 350" />
                <path class="pipe-line" id="pipe-out-1" d="M 650 350 L 850 200" />
                <path class="pipe-line" id="pipe-out-2" d="M 650 350 L 850 500" />
            </svg>
            <div id="compiler-dataflow" class="absolute inset-0 pointer-events-none z-20 overflow-hidden"></div>
        </div>

        <div class="hw-screen h-28 rounded-xl p-4 border-[#222] mt-2 z-20 shrink-0">
            <div class="scanline"></div>
            <div class="code-font text-[10px] text-gray-400" id="compiler-terminal">
                > SYSTEM IDLE.<br>> WAITING FOR BUILD TRIGGER.<br>> TARGETS: IOS, ANDROID.
            </div>
        </div>
    </div>
`,
  'mod-portfolio': `
                <div class="w-full max-w-5xl mx-auto flex flex-col gap-16 relative pt-12 pb-32 md:pr-32 lg:pr-48">
                    
                    <!-- ============================================== -->
                    <!-- APP 1: INSECONDS PRO (DESKTOP ENGINE)          -->
                    <!-- ============================================== -->
                    <div class="shrink-0 bg-[#050505]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group transition-all duration-700 hover:border-cyan-500/40">
                        <!-- Animated Ambient Glow -->
                        <div class="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500 opacity-5 blur-[120px] rounded-full group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
                        
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
                            <div>
                                <h2 class="heading-font text-4xl md:text-5xl font-bold text-white tracking-tighter flex items-center gap-3">
                                    InSeconds <span class="text-cyan-400 italic font-light">Pro</span>
                                </h2>
                                <p class="code-font text-[11px] text-cyan-500/70 tracking-widest uppercase mt-3">> The Ultimate Desktop Cold Email Engine</p>
                            </div>
                            <a href="https://wa.me/916393972524?text=Hi%20Hridyansh,%20I'm%20interested%20in%20buying%20the%20InSeconds%20Pro%20Desktop%20Engine!" target="_blank" class="shrink-0 inline-flex items-center gap-2 bg-white/5 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500 hover:text-black px-6 py-3 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-1 transition-all duration-300 sound-click">
                                <i class="fas fa-server text-lg"></i> Purchase Engine
                            </a>
                        </div>
                        
                        <!-- NEW: INTERACTIVE TERMINAL SECTION (Replaces Image) -->
                        <div class="w-full bg-[#020202] rounded-2xl border border-white/5 mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative group-hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                            <div class="bg-[#0a0a0a] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                                <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                                <span class="code-font text-[10px] text-gray-500 ml-2">sys_architecture.py</span>
                            </div>
                            <div class="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 class="text-cyan-400 code-font text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><i class="fas fa-microchip"></i> What is it made of?</h4>
                                    <p class="text-gray-400 text-sm leading-relaxed font-light">
                                        Powered by a blazing-fast <span class="text-white font-medium">Python FastAPI</span> backend and bundled securely as a compiled executable. Handles massive datasets (50,000+ leads) instantly in local memory via <span class="text-white font-medium">Pandas</span>. The frontend is a masterclass in modern web design utilizing <span class="text-white font-medium">HTMX, Tailwind CSS,</span> and <span class="text-white font-medium">DaisyUI</span>. Secured with <span class="text-white font-medium">Firebase Auth</span> and native <span class="text-white font-medium">Google OAuth2</span>.
                                    </p>
                                </div>
                                <div>
                                    <h4 class="text-cyan-400 code-font text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><i class="fas fa-terminal"></i> How it runs</h4>
                                    <p class="text-gray-400 text-sm leading-relaxed font-light">
                                        Transforms your local computer into a decentralized marketing powerhouse. It connects directly to multiple Google Accounts via their official APIs, rotating through accounts and Proxy IPs seamlessly. Using advanced multithreading, it processes thousands of emails in the background while mimicking human typing delays and tab-switching, viewing the traffic as <span class="text-white font-medium">100% authentic user behavior</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- KEY FEATURES BENTO GRID -->
                        <h3 class="text-xs font-bold text-white/50 mb-5 flex items-center gap-2 uppercase tracking-widest code-font"><i class="fas fa-bolt text-cyan-400"></i> Core Engineering</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 relative z-10">
                            <!-- Bento Item -->
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-cyan-900/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-cyan-400 text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-cyan-300 transition-transform"><i class="fas fa-user-secret"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Anti-Spam & Cloaking</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Polymorphic text engine using "Ghost Text" and SVG cloaking. Destroys digital fingerprints so no two emails look the same to AI.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-cyan-900/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-cyan-400 text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-cyan-300 transition-transform"><i class="fas fa-file-invoice-dollar"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Schema Injection</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Tricks Gmail into Primary Inbox placement by injecting official "Invoice" JSON-LD schemas with native 'View & Pay' buttons.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-cyan-900/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-cyan-400 text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-cyan-300 transition-transform"><i class="fas fa-mobile-alt"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Device/ESP Spoofing</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Emulates Apple iOS headers or mimics enterprise routing from Amazon SES/SendGrid to borrow their high-trust sender reputations.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-cyan-900/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-cyan-400 text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-cyan-300 transition-transform"><i class="fas fa-network-wired"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Smart BCC Matrix</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Mathematically splits lists into organic, random-sized BCC chunks across dozens of accounts to maximize daily limits.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-cyan-900/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-cyan-400 text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-cyan-300 transition-transform"><i class="fas fa-file-pdf"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Dynamic PDF Engine</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Instantly compiles base HTML into beautifully formatted, unique PDF attachments on the fly with personalized prospect data.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-cyan-900/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-cyan-400 text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-cyan-300 transition-transform"><i class="fas fa-fingerprint"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Hash Busting</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Automatically alters hidden MD5 metadata of PDFs, Images, and CSVs for every single recipient to evade bulk attachment flags.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-cyan-900/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-cyan-400 text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-cyan-300 transition-transform"><i class="fas fa-robot"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">AI Co-Pilot Scanner</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Integrated Groq (Llama AI) generates highly-converting copy, creates Spintax, and scans emails for "Spam Scores" before sending.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-cyan-900/10 hover:border-cyan-500/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-cyan-400 text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-cyan-300 transition-transform"><i class="fas fa-terminal"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Dual-Terminal Monitor</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Watch the engine in real-time with a "Live Campaign Feed" and an "Advanced Debugger" terminal for deep network-level insights.</p>
                            </div>
                        </div>

                        <!-- WHY IT'S GOOD SECTION -->
                        <div class="p-6 md:p-8 bg-cyan-950/20 border border-cyan-500/20 rounded-2xl relative z-10">
                            <h3 class="text-cyan-400 text-lg font-bold mb-4 flex items-center gap-2"><i class="fas fa-check-double"></i> Why InSeconds Pro is the ultimate advantage:</h3>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div class="flex gap-3"><i class="fas fa-star text-yellow-400 mt-1"></i> <div><strong class="text-white">Primary Inbox Placement:</strong> <span class="text-gray-400 text-sm">Bypasses promotional tabs utilizing timezone masking, text parity, and invoice schemas.</span></div></div>
                                <div class="flex gap-3"><i class="fas fa-infinity text-blue-400 mt-1"></i> <div><strong class="text-white">Infinite Scalability:</strong> <span class="text-gray-400 text-sm">Manage 5 to 500+ accounts. Intelligent proxy mapping prevents Google rate limits.</span></div></div>
                                <div class="flex gap-3"><i class="fas fa-bullseye text-red-400 mt-1"></i> <div><strong class="text-white">Hyper-Personalization:</strong> <span class="text-gray-400 text-sm">Send 10k emails where every prospect gets a unique message & custom PDF report.</span></div></div>
                                <div class="flex gap-3"><i class="fas fa-shield-alt text-green-400 mt-1"></i> <div><strong class="text-white">Data Sovereignty:</strong> <span class="text-gray-400 text-sm">Lead lists & APIs never leave your computer. 100% safe from SaaS data breaches.</span></div></div>
                            </div>
                        </div>

                    </div>

                    <!-- ============================================== -->
                    <!-- APP 2: INSECONDS CHROME EXTENSION              -->
                    <!-- ============================================== -->
                    <div class="shrink-0 bg-[#050505]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] group transition-all duration-700 hover:border-[#facc15]/40">
                        <!-- Animated Ambient Glow -->
                        <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-[#facc15] opacity-5 blur-[120px] rounded-full group-hover:opacity-15 transition-opacity duration-700 pointer-events-none"></div>
                        
                        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
                            <div>
                                <h2 class="heading-font text-4xl md:text-5xl font-bold text-white tracking-tighter flex items-center gap-3">
                                    InSeconds <span class="text-[#facc15] italic font-light">Extension</span>
                                </h2>
                                <p class="code-font text-[11px] text-[#facc15]/70 tracking-widest uppercase mt-3">> The Ultimate Gmail Outreach Assistant</p>
                            </div>
                            <a href="https://wa.me/916393972524?text=Hi%20Hridyansh,%20I'm%20interested%20in%20buying%20the%20InSeconds%20Chrome%20Extension!" target="_blank" class="shrink-0 inline-flex items-center gap-2 bg-white/5 border border-[#facc15]/30 text-[#facc15] hover:bg-[#facc15] hover:text-black px-6 py-3 rounded-full text-xs font-bold shadow-[0_0_20px_rgba(250,204,21,0.1)] hover:shadow-[0_0_30px_rgba(250,204,21,0.4)] hover:-translate-y-1 transition-all duration-300 sound-click">
                                <i class="fas fa-puzzle-piece text-lg"></i> Purchase Extension
                            </a>
                        </div>

                        <!-- NEW: INTERACTIVE TERMINAL SECTION (Replaces Image) -->
                        <div class="w-full bg-[#020202] rounded-2xl border border-white/5 mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative group-hover:border-[#facc15]/30 transition-all duration-500 overflow-hidden">
                            <div class="bg-[#0a0a0a] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                                <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                                <span class="code-font text-[10px] text-gray-500 ml-2">manifest_v3_core.js</span>
                            </div>
                            <div class="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                                <div>
                                    <h4 class="text-[#facc15] code-font text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><i class="fas fa-layer-group"></i> What is it made of?</h4>
                                    <p class="text-gray-400 text-sm leading-relaxed font-light">
                                        Built natively for the modern web browser as a <span class="text-white font-medium">Manifest V3</span> extension. Engineered using blazing-fast <span class="text-white font-medium">Vanilla JavaScript, HTML5,</span> and <span class="text-white font-medium">CSS3</span>. Enterprise-grade security is powered by <span class="text-white font-medium">Firebase Auth</span> and <span class="text-white font-medium">Firestore DB</span> for real-time session management. No external SMTP servers—everything runs entirely within the safety of your local browser.
                                    </p>
                                </div>
                                <div>
                                    <h4 class="text-[#facc15] code-font text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><i class="fas fa-play-circle"></i> How it runs</h4>
                                    <p class="text-gray-400 text-sm leading-relaxed font-light">
                                        Acts like a virtual human assistant inside your Gmail. Once a CSV is uploaded, it physically interacts with the <span class="text-white font-medium">Gmail DOM</span>. It automatically clicks "Compose", types the personalized body, and hits "Send." For follow-ups, it uses Gmail's search to find specific threads. Because it mimics exact human behavior with randomized delays, algorithms view these emails as <span class="text-white font-medium">organic, manual sends</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- KEY FEATURES BENTO GRID -->
                        <h3 class="text-xs font-bold text-white/50 mb-5 flex items-center gap-2 uppercase tracking-widest code-font"><i class="fas fa-star text-[#facc15]"></i> Core Capabilities</h3>

                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 relative z-10">
                            <!-- Bento Item -->
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-yellow-900/10 hover:border-[#facc15]/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-[#facc15] text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-yellow-300 transition-transform"><i class="fas fa-paper-plane"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Automated Campaigns</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Upload a contact list, choose a template, and the tool sends personalized cold emails one by one organically.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-yellow-900/10 hover:border-[#facc15]/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-[#facc15] text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-yellow-300 transition-transform"><i class="fas fa-reply-all"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Smart Follow-Up Engine</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Automatically send follow-up replies to recent "Sent" items or target email threads filed under specific Gmail Labels.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-yellow-900/10 hover:border-[#facc15]/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-[#facc15] text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-yellow-300 transition-transform"><i class="fas fa-user-clock"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Human-Like Sending</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Avoid spam filters by setting randomized time delays between emails and global throttling limits (e.g., 10 emails/hr).</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-yellow-900/10 hover:border-[#facc15]/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-[#facc15] text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-yellow-300 transition-transform"><i class="fas fa-vial"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">A/B Testing</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Create Variant A and B of your initial email. InSeconds automatically alternates between them to test performance.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-yellow-900/10 hover:border-[#facc15]/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-[#facc15] text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-yellow-300 transition-transform"><i class="fas fa-tags"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Dynamic Personalization</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Use merge tags like {first_name} and {company} to make every mass email feel individually hand-written.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-yellow-900/10 hover:border-[#facc15]/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-[#facc15] text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-yellow-300 transition-transform"><i class="fas fa-folder-open"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Rich Template Manager</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Built-in editor allows you to create, save, categorize, and organize multiple templates for subjects and bodies.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-yellow-900/10 hover:border-[#facc15]/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-[#facc15] text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-yellow-300 transition-transform"><i class="fas fa-calendar-check"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Campaign Scheduling</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Set a specific date and time for your campaign to launch automatically in the background using Chrome Alarms.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-yellow-900/10 hover:border-[#facc15]/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-[#facc15] text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-yellow-300 transition-transform"><i class="fas fa-paint-brush"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">Deep UI Customization</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">15+ aesthetic themes, high-contrast modes, panel transparency, and live background animations directly in Gmail.</p>
                            </div>
                            <div class="bg-white/[0.02] p-5 rounded-2xl border border-white/[0.05] hover:bg-yellow-900/10 hover:border-[#facc15]/40 transition-all duration-300 hover:-translate-y-1 group/bento shadow-lg">
                                <div class="text-[#facc15] text-xl mb-3 group-hover/bento:scale-110 group-hover/bento:text-yellow-300 transition-transform"><i class="fas fa-pause-circle"></i></div>
                                <h4 class="text-white font-bold text-sm mb-2">State Saving & Pause</h4>
                                <p class="text-gray-400 text-xs leading-relaxed">Pause, stop, and resume campaigns at any time. The tool remembers exactly who has and hasn't been emailed yet.</p>
                            </div>
                        </div>

                        <!-- WHY IT'S GOOD SECTION -->
                        <div class="p-6 md:p-8 bg-yellow-950/20 border border-[#facc15]/20 rounded-2xl relative z-10">
                            <h3 class="text-[#facc15] text-lg font-bold mb-4 flex items-center gap-2"><i class="fas fa-check-double"></i> Why InSeconds Extension is a game-changer:</h3>
                            <div class="grid md:grid-cols-2 gap-4">
                                <div class="flex gap-3"><i class="fas fa-shield-check text-green-400 mt-1"></i> <div><strong class="text-white">Protects Sender Reputation:</strong> <span class="text-gray-400 text-sm">Sends individually right from your actual Gmail window, bypassing strict spam filters.</span></div></div>
                                <div class="flex gap-3"><i class="fas fa-hourglass-half text-blue-400 mt-1"></i> <div><strong class="text-white">Reclaims Your Time:</strong> <span class="text-gray-400 text-sm">Automate hours of tedious copying, pasting, and clicking in just a few seconds.</span></div></div>
                                <div class="flex gap-3"><i class="fas fa-chart-line text-purple-400 mt-1"></i> <div><strong class="text-white">Boosts Reply Rates:</strong> <span class="text-gray-400 text-sm">Targeted personalization and automated follow-ups ensure leads don't slip away.</span></div></div>
                                <div class="flex gap-3"><i class="fas fa-magic text-pink-400 mt-1"></i> <div><strong class="text-white">100% Frictionless:</strong> <span class="text-gray-400 text-sm">No new software to learn. It lives exactly where you already work: inside your inbox.</span></div></div>
                            </div>
                        </div>

                    </div>

                </div>
            `,
  'mod-music': `
                <div class="music-wallpaper-layer"></div>
                <div class="music-overlay-layer"></div>
                <div class="music-glow-layer" aria-hidden="true"></div>
                <div class="music-grid-layer" aria-hidden="true"></div>
                <div class="music-player-wrap">
                    <div class="airpods-shell" id="airpods-shell">

                        <div class="airpods-stage" id="astro-stage" style="cursor: grab; touch-action: none;">
                            <!-- Three.js Canvas renders here -->
                            <canvas id="astro-canvas" style="width:100%;height:100%;display:block;border-radius:28px;"></canvas>
                            
                            <div id="astro-load-status" class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-2 py-1 text-white/90 font-[Fira\ Code] text-[10px] tracking-widest uppercase pointer-events-none drop-shadow-[0_0_14px_rgba(0,0,0,0.9)]">
                                Loading 3D Model...
                            </div>
                        </div>

                            <div class="music-player-card">
                                <div class="music-player-head">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="code-font text-[10px] tracking-[0.22em] text-blue-400/80 uppercase flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>Spatial Audio</p>
                                        </div>
                                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                                            <i class="fas fa-headphones text-pink-400 text-sm"></i>
                                        </div>
                                </div>
                                <button id="music-start" class="music-start-btn code-font sound-click" type="button">Start</button>
                            </div>

                            <div class="music-meta" style="border-color: rgba(255,255,255,0.06);">
                                <p id="music-track-title" class="music-track-title">Local Track Ready</p>
                            </div>
                            <div id="music-visualizer" class="music-visualizer" aria-hidden="true"></div>

                            <div class="music-progress-wrap">
                                <span id="music-current-time" class="music-time code-font">00:00</span>
                                <input id="music-progress" type="range" min="0" max="100" value="0" step="0.1" aria-label="Music progress">
                                <span id="music-duration" class="music-time code-font">00:00</span>
                            </div>

                            <div class="music-controls">
                                <button id="music-prev" class="music-control-btn sound-click" aria-label="Previous track"><i class="fas fa-backward-step"></i></button>
                                <button id="music-play" class="music-control-btn music-play-btn sound-click" aria-label="Play or pause"><i id="music-play-icon" class="fas fa-play"></i></button>
                                <button id="music-stop" class="music-control-btn music-stop-btn sound-click" aria-label="Stop"><i class="fas fa-stop"></i></button>
                                <button id="music-next" class="music-control-btn sound-click" aria-label="Next track"><i class="fas fa-forward-step"></i></button>
                            </div>

                            <div class="music-volume-wrap ios-volume-wrap">
                                <i class="fas fa-volume-low text-gray-500 text-xs"></i>
                                <input id="music-volume" type="range" min="0" max="1" value="0.65" step="0.01" aria-label="Music volume">
                                <i class="fas fa-volume-high text-gray-500 text-xs"></i>
                            </div>
                        </div>
                        <p class="music-headphone-note code-font"><i class="fas fa-headphones mr-1"></i> Use headphones for best experience</p>
                    </div>
                </div>

                <audio id="music-audio" preload="metadata"></audio>
            `,
  'mod-entropy': `
                <div class="absolute inset-0 w-full h-full bg-black z-0 pointer-events-none">
                    <canvas id="entropy-canvas" class="w-full h-full block"></canvas>
                </div>
                
                <div class="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <h2 id="entropy-t1" class="heading-font text-4xl md:text-6xl text-white tracking-widest uppercase opacity-0 font-bold drop-shadow-[0_0_20px_rgba(217,119,6,0.6)] text-center px-4">
                        Presented by <span class="text-[var(--brand-orange)]">Hridyansh</span>
                    </h2>
                    <h2 id="entropy-t2" class="heading-font text-5xl md:text-8xl text-white tracking-tighter opacity-0 font-extrabold drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] absolute text-center px-4">
                        Coding means creativity.
                    </h2>
                </div>

            `,
};
