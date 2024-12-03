const mapStart = -2000;
const mapEnd = 20000;

const generateSpawnPoints = (start, end, count) => {
    if (count > Math.floor((end - start) / 30)) {
        throw new Error("Not enough space in the range to generate unique spawn points with a gap of 30.");
    }

    const spawnPoints = [];
    while (spawnPoints.length < count) {
        const randomPoint = Math.floor(Math.random() * (end - start + 1)) + start;

        // Check if the spawn point is valid (gap of at least 30 and not already in use)
        if (
            !spawnPoints.some(point => Math.abs(point - randomPoint) < 30)
        ) {
            spawnPoints.push(randomPoint);
        }
    }

    return spawnPoints;
}


const generateSpawns = (start, end, total, configs, spawnDistribution) => {
    const types = Object.keys(configs);

    // Calculate how many of each type to spawn
    const counts = types.reduce((acc, type) => {
        acc[type] = Math.floor(total * (spawnDistribution[type] || 0));
        return acc;
    }, {});

    // Create an array of types to shuffle
    const queue = [];
    for (const [type, count] of Object.entries(counts)) {
        for (let i = 0; i < count; i++) {
            queue.push(type);
        }
    }

    // Shuffle the array to randomize the order of types
    for (let i = queue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [queue[i], queue[j]] = [queue[j], queue[i]];
    }

    const spawnPoints = [];
    let attempts = 0; // To avoid infinite loops
    for (const type of queue) {
        let x;
        do {
            x = Math.floor(Math.random() * (end - start + 1)) + start;
            attempts++;
        } while (
            spawnPoints.some(point => Math.abs(point.x - x) < 30) &&
            attempts < 100
        );

        if (attempts >= 100) {
            console.warn(`Could not place all ${type} within spacing constraints.`);
            break;
        }

        spawnPoints.push({ type, x });
    }

    return spawnPoints;
};

// Example usage for guns
const generateGunSpawns = (start, end, totalGuns, gunConfigs) => {
    const spawnDistribution = {
        pistol: 0.35,
        ak47: 0.125,
        m14: 0.125,
        smg: 0.2,
        shotgun: 0.15,
        bazuka: 0.05
    };
    return generateSpawns(start, end, totalGuns, gunConfigs, spawnDistribution);
};

// Example usage for items
const generateItemSpawns = (start, end, totalItems, itemConfigs) => {
    const spawnDistribution = {
        grenade: 0.2,
        health: 0.25,
        armor: 0.2,
        ammo: 0.3,
        barrel: 0.05
    };
    return generateSpawns(start, end, totalItems, itemConfigs, spawnDistribution);
};

module.exports = { 
    generateGunSpawns, 
    generateItemSpawns, 
    generateSpawnPoints,
    mapStart,
    mapEnd
};