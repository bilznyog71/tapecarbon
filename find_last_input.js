import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('C:/Users/bilzny/.gemini/antigravity-ide/brain/b84f5cb9-369a-4876-a026-3b411f207af1/.system_generated/logs/transcript.jsonl');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let lastUserInput = null;
for await (const line of rl) {
  if (line.includes('"type":"USER_INPUT"')) {
    lastUserInput = line;
  }
}

if (lastUserInput) {
  const parsed = JSON.parse(lastUserInput);
  console.log(JSON.stringify(parsed, null, 2));
}
