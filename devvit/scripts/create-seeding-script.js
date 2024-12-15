import fs from "fs";
import msgpack from "@msgpack/msgpack";

const definitionsFilePath = "word-definitions.json";
const redisSeedFilePath = "redis-seed-data.json";

function serializeForRedisSeed() {
  // Read the word definitions file
  let definitionsData = [];
  if (fs.existsSync(definitionsFilePath)) {
    definitionsData = JSON.parse(fs.readFileSync(definitionsFilePath, "utf8"));
  } else {
    console.error("Definitions file not found!");
    return;
  }

  const redisSeedData = definitionsData.reduce((acc, entry) => {
    const serializedValue = Buffer.from(
      msgpack.encode(entry.definitions)
    ).toString("base64");

    return { ...acc, [entry.word]: serializedValue };
  }, {});

  // Write the serialized data to the redis seed file
  fs.writeFileSync(redisSeedFilePath, JSON.stringify(redisSeedData, null, 2));
  console.log("Redis seed data file created successfully!");
}

// Execute the function
serializeForRedisSeed();
