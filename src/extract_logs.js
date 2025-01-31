const fs = require('fs');
const readline = require('readline');
const path = require('path');

if (process.argv.length !== 3) {
    console.error("Usage: node extract_logs.js <YYYY-MM-DD>");
    process.exit(1);
}

const targetDate = process.argv[2];
const logFile = path.join(__dirname, '../test_logs.log'); // Ensure it's outside src
const outputDir = path.join(__dirname, '../output'); // Ensure output is outside src
const outputFile = path.join(outputDir, `output_${targetDate}.txt`);

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const readStream = fs.createReadStream(logFile, { encoding: 'utf8' });
const writeStream = fs.createWriteStream(outputFile, { encoding: 'utf8' });
const rl = readline.createInterface({ input: readStream, crlfDelay: Infinity });

console.log(`Extracting logs for ${targetDate}...`);

rl.on('line', (line) => {
    if (line.startsWith(targetDate)) {
        writeStream.write(line + '\n');
    }
});

rl.on('close', () => {
    console.log(`Extraction complete. Logs saved to ${outputFile}`);
    writeStream.end();
});

rl.on('error', (err) => {
    console.error("Error reading the log file:", err);
    process.exit(1);
});

writeStream.on('error', (err) => {
    console.error("Error writing to output file:", err);
    process.exit(1);
});
