export const resources = {
    credits: 0,
    biomass: 0, stone: 0,
    ironOre: 0, copperOre: 0, coal: 0,
    ironIngot: 0, copperIngot: 0,
    ironPlate: 0, ironRod: 0, wire: 0, cable: 0, screw: 0, concrete: 0,
    steelIngot: 0, crudeOil: 0, plastic: 0, circuit: 0, motor: 0,
    bauxite: 0, aluminumIngot: 0, computer: 0,
    uraniumOre: 0, uraniumCell: 0, nuclearWaste: 0, fusionCore: 0
};

export let resourceRates = {}; 

export let gameState = {
    stage: 0,
    systemReady: false,
    power: { produced: 0, demanded: 0, efficiency: 1.0 },
    buildings: {} 
};