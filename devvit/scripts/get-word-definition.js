import fs from 'fs';

const wordsFilePath = 'server/words.json';
const outputFilePath = 'word-definitions.json';
const noDefinitionsFilePath = 'no-definitions.json';
const apiBaseUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const throttleTime = 0; // Throttle time in milliseconds
const cooldownTime = 10000; // Cooldown time in milliseconds for 429 errors

async function fetchDefinitions(rangeStart, rangeEnd) {
  // Read the words file
  const wordsData = JSON.parse(fs.readFileSync(wordsFilePath, 'utf8'));

  // Read or initialize the output files
  let outputData = [];
  if (fs.existsSync(outputFilePath)) {
    outputData = JSON.parse(fs.readFileSync(outputFilePath, 'utf8'));
  }

  let noDefinitionsData = [];
  if (fs.existsSync(noDefinitionsFilePath)) {
    noDefinitionsData = JSON.parse(fs.readFileSync(noDefinitionsFilePath, 'utf8'));
  }

  const existingWords = new Map(outputData.map(entry => [entry.word, entry]));
  const noDefinitionWords = new Set(noDefinitionsData);

  // Filter the range
  const wordsInRange = wordsData.slice(rangeStart, rangeEnd);

  for (const { member: word } of wordsInRange) {
    if (existingWords.has(word) && existingWords.get(word).definitions.length > 0) {
      console.log(`Skipping ${word} (already exists and has definitions)`);
      continue;
    }

    if (noDefinitionWords.has(word)) {
      console.log(`Skipping ${word} (already marked as no definition)`);
      continue;
    }

    let success = false;
    while (!success) {
      try {
        console.log(`Fetching definitions for: ${word}`);
        const response = await fetch(`${apiBaseUrl}/${word}`);
        if (!response.ok) {
          if (response.status === 404) {
            console.log(`No definitions found for: ${word}`);
            noDefinitionsData.push(word);
            fs.writeFileSync(noDefinitionsFilePath, JSON.stringify(noDefinitionsData, null, 2));
            success = true;
            continue;
          } else if (response.status === 429) {
            console.log(`Rate limit exceeded. Waiting for cooldown time: ${cooldownTime}ms`);
            await new Promise(resolve => setTimeout(resolve, cooldownTime));
            continue;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const definitions = [];

        data.forEach(entry => {
          if (entry.meanings) {
            entry.meanings.forEach(meaning => {
              if (meaning.definitions) {
                meaning.definitions.slice(0, 2).forEach(def => {
                  definitions.push({
                    type: meaning.partOfSpeech,
                    description: def.definition
                  });
                });
              }
            });
          }
        });

        if (definitions.length > 0) {
          outputData = outputData.filter(entry => entry.word !== word);
          outputData.push({ word, definitions });
          console.log(`Added definitions for: ${word}`);
        } else {
          console.log(`No definitions found for: ${word}`);
        }

        // Save progress to avoid data loss
        fs.writeFileSync(outputFilePath, JSON.stringify(outputData, null, 2));

        success = true;

        // Throttle requests
        await new Promise(resolve => setTimeout(resolve, throttleTime));
      } catch (error) {
        console.error(`Error fetching definitions for ${word}:`, error.message);
      }
    }
  }

  console.log('All words processed!');
}

// Example usage
fetchDefinitions(0, 1000);