const weights: { [letter: string]: number } = {
    A: 8.4966,
    B: 2.072,
    C: 4.5388,
    D: 3.3844,
    E: 11.1607,
    F: 1.8121,
    G: 2.4705,
    H: 3.0034,
    I: 7.5448,
    J: 0.1965,
    K: 1.1016,
    L: 5.4893,
    M: 3.0129,
    N: 6.6544,
    O: 7.1635,
    P: 3.1671,
    Q: 0.1962,
    R: 7.5809,
    S: 5.7351,
    T: 6.9509,
    U: 3.6308,
    V: 1.0074,
    W: 1.2899,
    X: 0.2902,
    Y: 1.7779,
    Z: 0.2722
};

export function generateRandomLetter(): string {
    // Flatten the weights into a cumulative array
    const entries = Object.entries(weights);
    const cumulativeWeights: { letter: string; cumulative: number }[] = [];
    let totalWeight = 0;

    for (const [letter, weight] of entries) {
        totalWeight += weight;
        cumulativeWeights.push({ letter, cumulative: totalWeight });
    }

    // Generate a random number within the total weight range
    const randomValue = Math.random() * totalWeight;

    // Find the letter corresponding to the random value
    for (const { letter, cumulative } of cumulativeWeights) {
        if (randomValue <= cumulative) {
            return letter;
        }
    }

    // Fallback (should not happen if weights are set up correctly)
    throw new Error("Failed to select a letter. Check your weights.");
}