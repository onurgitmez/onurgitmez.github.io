export const TICK_RATE = 10;
export const DT = 1 / TICK_RATE;

export const tabs = [
    { id: 'power', icon: '⚡', name: 'Power' },
    { id: 'extraction', icon: '⛏️', name: 'Extraction' },
    { id: 'smelting', icon: '🔥', name: 'Smelting' },
    { id: 'production', icon: '⚙️', name: 'Factory' },
    { id: 'advanced', icon: '📟', name: 'High-Tech' },
    { id: 'nuclear', icon: '☢️', name: 'Nuclear' }
];

export const buildingDefs = {
    // TIER 0
    genBiomass: { name: "Biomass Burner", stage: 0, tab: 'power', cost: { stone: 5 }, power: 15, inputs: { biomass: 0.5 }, outputs: {} },
    windTurbine: { name: "Wind Turbine", stage: 0, tab: 'power', cost: { ironPlate: 15, wire: 10 }, power: 5, inputs: {}, outputs: {} },
    drillIron: { name: "Iron Drill", stage: 0, tab: 'extraction', cost: { credits: 50 }, power: -2.5, inputs: {}, outputs: { ironOre: 1 } },
    drillCopper: { name: "Copper Drill", stage: 0, tab: 'extraction', cost: { credits: 80 }, power: -2.5, inputs: {}, outputs: { copperOre: 1 } },
    drillStone: { name: "Quarry Drill", stage: 0, tab: 'extraction', cost: { credits: 50 }, power: -2.5, inputs: {}, outputs: { stone: 1 } },
    smelterIron: { name: "Iron Smelter", stage: 0, tab: 'smelting', cost: { ironOre: 20 }, power: -4, inputs: { ironOre: 1 }, outputs: { ironIngot: 1 } },
    smelterCopper: { name: "Copper Smelter", stage: 0, tab: 'smelting', cost: { ironOre: 20 }, power: -4, inputs: { copperOre: 1 }, outputs: { copperIngot: 1 } },
    constPlate: { name: "Plate Press", stage: 0, tab: 'production', cost: { ironIngot: 20 }, power: -4, inputs: { ironIngot: 2 }, outputs: { ironPlate: 2 } },
    constRod: { name: "Rod Former", stage: 0, tab: 'production', cost: { ironIngot: 15 }, power: -3, inputs: { ironIngot: 1 }, outputs: { ironRod: 2 } },
    constWire: { name: "Wire Cabler", stage: 0, tab: 'production', cost: { copperIngot: 10 }, power: -4, inputs: { copperIngot: 1 }, outputs: { wire: 2 } },
    constScrew: { name: "Screw Factory", stage: 0, tab: 'production', cost: { ironRod: 20 }, power: -3, inputs: { ironRod: 1 }, outputs: { screw: 4 } },
    constCable: { name: "Cable Machine", stage: 0, tab: 'production', cost: { wire: 30 }, power: -4, inputs: { wire: 2 }, outputs: { cable: 1 } },

    // MILESTONE 1
    milestone1: { name: "UNLOCK: Coal Power", stage: 0, tab: 'production', type: 'milestone', cost: { ironPlate: 100, wire: 100 }, unlocks: 1 },
    
    // TIER 1
    drillCoal: { name: "Coal Miner", stage: 1, tab: 'extraction', cost: { credits: 200, ironPlate: 50 }, power: -5, inputs: {}, outputs: { coal: 1 } },
    genCoal: { name: "Coal Generator", stage: 1, tab: 'power', cost: { ironPlate: 50, wire: 50 }, power: 50, inputs: { coal: 1 }, outputs: {} },
    foundrySteel: { name: "Steel Foundry", stage: 1, tab: 'smelting', cost: { ironPlate: 100, concrete: 50 }, power: -15, inputs: { ironIngot: 3, coal: 2 }, outputs: { steelIngot: 2 } },
    constConcrete: { name: "Cement Mixer", stage: 1, tab: 'production', cost: { ironPlate: 20 }, power: -8, inputs: { stone: 3 }, outputs: { concrete: 1 } },
    
    // MILESTONE 2
    milestone2: { name: "UNLOCK: Oil & Plastic", stage: 1, tab: 'production', type: 'milestone', cost: { steelIngot: 200, concrete: 200 }, unlocks: 2 },
    
    // TIER 2
    pumpOil: { name: "Oil Pump", stage: 2, tab: 'extraction', cost: { steelIngot: 100, motor: 5 }, power: -30, inputs: {}, outputs: { crudeOil: 1 } },
    refineryPlastic: { name: "Plastic Refinery", stage: 2, tab: 'production', cost: { steelIngot: 50, ironPlate: 100 }, power: -25, inputs: { crudeOil: 1 }, outputs: { plastic: 2 } },
    assemblerMotor: { name: "Motor Factory", stage: 2, tab: 'production', cost: { steelIngot: 50, wire: 100 }, power: -15, inputs: { ironRod: 2, wire: 4 }, outputs: { motor: 1 } },
    assemblerCircuit: { name: "Circuit Assembler", stage: 2, tab: 'advanced', cost: { ironPlate: 50, wire: 100 }, power: -10, inputs: { copperIngot: 2, plastic: 1 }, outputs: { circuit: 1 } },
    
    // MILESTONE 3
    milestone3: { name: "UNLOCK: Advanced Tech", stage: 2, tab: 'advanced', type: 'milestone', cost: { circuit: 200, motor: 100 }, unlocks: 3 },
    
    // TIER 3
    drillBauxite: { name: "Bauxite Miner", stage: 3, tab: 'extraction', cost: { credits: 1000, steelIngot: 200 }, power: -40, inputs: {}, outputs: { bauxite: 1 } },
    smelterAluminum: { name: "Alum. Smelter", stage: 3, tab: 'smelting', cost: { steelIngot: 200, circuit: 50 }, power: -60, inputs: { bauxite: 4, coal: 2 }, outputs: { aluminumIngot: 2 } },
    assemblerComputer: { name: "Computer Fab", stage: 3, tab: 'advanced', cost: { circuit: 100, plastic: 100 }, power: -100, inputs: { circuit: 5, plastic: 3, cable: 2 }, outputs: { computer: 1 } },
    
    // MILESTONE 4
    milestone4: { name: "UNLOCK: Nuclear Age", stage: 3, tab: 'advanced', type: 'milestone', cost: { computer: 100, aluminumIngot: 500 }, unlocks: 4 },
    
    // TIER 4
    drillUranium: { name: "Uranium Miner", stage: 4, tab: 'extraction', cost: { credits: 5000, computer: 10 }, power: -200, inputs: {}, outputs: { uraniumOre: 1 } },
    centrifuge: { name: "Centrifuge", stage: 4, tab: 'nuclear', cost: { aluminumIngot: 500, computer: 50 }, power: -150, inputs: { uraniumOre: 5 }, outputs: { uraniumCell: 1 } },
    genNuclear: { name: "Nuclear Reactor", stage: 4, tab: 'nuclear', cost: { concrete: 2000, steelIngot: 1000, computer: 50 }, power: 5000, inputs: { uraniumCell: 0.1 }, outputs: { nuclearWaste: 0.1 } },
    wasteProcessor: { name: "Waste Recycler", stage: 4, tab: 'nuclear', cost: { aluminumIngot: 1000, computer: 100 }, power: -300, inputs: { nuclearWaste: 1 }, outputs: { uraniumOre: 2 } },
    projectAssembly: { name: "PROJECT ASSEMBLY", stage: 4, tab: 'advanced', cost: { computer: 500, aluminumIngot: 1000, fusionCore: 1 }, power: 0, inputs: {}, outputs: {} }
};