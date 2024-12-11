import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File paths
const wordsFilePath = path.join(__dirname, 'server', 'words.txt');
const badWordsFilePath = path.join(__dirname, 'server', 'bad-words.txt');
const outputJsonPath = path.join(__dirname, 'server', 'words.json');

// Utility function to read a file line by line
function readLines(filePath) {
    return fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).filter(Boolean);
}

// Utility function to write lines back to a file
function writeLines(filePath, lines) {
    fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
}

try {
    // Step 1: Remove lines with spaces in "bad-words.txt"
    let badWords = readLines(badWordsFilePath);
    badWords = badWords.filter(word => !word.includes(' '));
    writeLines(badWordsFilePath, badWords);

    // Step 2: Remove lines in "words.txt" containing any bad words (including as substrings)
    const words = readLines(wordsFilePath);
    const filteredWords = words.filter(word => !badWords.some(badWord => word.includes(badWord)));

    // Step 3: Remove words that don't contain a vowel (including "y")
    const wordsWithVowels = filteredWords.filter(word => /[aeiouyAEIOUY]/.test(word));

    // Step 4: Convert "words.txt" to JSON array
    let wordsJson = wordsWithVowels.map(line => {
        const [member, score] = line.split(',');
        return { member: member.trim(), score: parseInt(score.trim(), 10) };
    });

    // Step 5: Separate words by length and filter top percentiles
    const shortWords = wordsJson.filter(entry => entry.member.length <= 4);
    const longWords = wordsJson.filter(entry => entry.member.length > 4);

    // Get top 20% of short words
    const shortThreshold = Math.ceil(shortWords.length * 0.2);
    shortWords.sort((a, b) => b.score - a.score);
    const topShortWords = shortWords.slice(0, shortThreshold);

    // Get top 10% of long words
    const longThreshold = Math.ceil(longWords.length * 0.1);
    longWords.sort((a, b) => b.score - a.score);
    const topLongWords = longWords.slice(0, longThreshold);

    // Combine results and sort by score
    const finalWordsJson = [...topShortWords, ...topLongWords].sort((a, b) => b.score - a.score);

    // Write the JSON array to a file
    fs.writeFileSync(outputJsonPath, JSON.stringify(finalWordsJson, null, 2), 'utf-8');

    // Log the counts
    console.log(`Number of short words included: ${topShortWords.length}`);
    console.log(`Number of long words included: ${topLongWords.length}`);

    console.log('Files processed successfully. JSON file created with filtered words.');
} catch (error) {
    console.error('Error processing files:', error);
}