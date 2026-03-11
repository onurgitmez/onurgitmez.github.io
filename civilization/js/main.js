import { 
    loadGame, 
    saveGame, 
    tick, 
    manualGather, 
    recruitVillager, 
    adjustJob, 
    buildStructure, 
    buildMax, 
    purchaseTech, 
    confirmPrestige, 
    doPrestige 
} from './engine.js';

import { 
    generateJobsUI, 
    generateBuildingsUI, 
    generateTechUI, 
    updateUI, 
    switchTab 
} from './ui.js';

// 1. Expose necessary functions to the global window object for HTML onclick attributes
window.manualGather = manualGather;
window.recruitVillager = recruitVillager;
window.adjustJob = adjustJob;
window.buildStructure = buildStructure;
window.buildMax = buildMax;
window.purchaseTech = purchaseTech;
window.confirmPrestige = confirmPrestige;
window.doPrestige = doPrestige;
window.switchTab = switchTab;

// The reset function is small enough to just define right here
window.confirmReset = function() {
    if(confirm("Are you sure? This will delete ALL your progress including prestige!")) {
        localStorage.removeItem('civIdleSave');
        location.reload();
    }
};

// 2. Initialize Game
function init() {
    // Build the interface
    generateJobsUI();
    generateBuildingsUI();
    generateTechUI();
    
    // Load saved data
    loadGame(); 
    
    // Start game loops
    setInterval(tick, 200);        // Run the main game loop every 200ms
    setInterval(saveGame, 30000);  // Save the game every 30 seconds
    
    // Do one initial UI update
    updateUI();
    
    console.log("✅ Modular Game Initialized Successfully");
}

// Start everything up!
init();