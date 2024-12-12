import fs from 'fs';

const wordsFilePath = 'server/words.json';
const outputFilePath = 'word-definitions.json';

function addScoresToDefinitions() {
  // Read the words file
  const wordsData = JSON.parse(fs.readFileSync(wordsFilePath, 'utf8'));

  // Read the word definitions file
  let outputData = [];
  if (fs.existsSync(outputFilePath)) {
    outputData = JSON.parse(fs.readFileSync(outputFilePath, 'utf8'));
  }

  const scoresMap = new Map(wordsData.map(word => [word.member, word.score]));

  // Add scores to definitions
  outputData = outputData.map(entry => {
    const score = scoresMap.get(entry.word);
    if (score !== undefined) {
      return { ...entry, score };
    }
    return entry;
  });

  // Write back the updated data
  fs.writeFileSync(outputFilePath, JSON.stringify(outputData, null, 2));
  console.log('Scores added to word definitions successfully!');
}

// Execute the function
addScoresToDefinitions();