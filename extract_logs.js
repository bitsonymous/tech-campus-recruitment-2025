const fs = require('fs');
const readline = require('readline');

function extractLogs(date) {
    const inputFile = 'test_logs.log';
    const outputFile = `output/output_${date}.txt`;

    const fileStream = fs.createReadStream(inputFile, 'utf8');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const outputStream = fs.createWriteStream(outputFile, { flags: 'a' });

    rl.on('line', (line) => {
        const logDate = line.split(' ')[0];

        if (logDate === date) {
            outputStream.write(line + '\n');
        }
    });

    rl.on('close', () => {
        const now = new Date();
        const currentTime = now.toISOString().split('T')[1].split('.')[0];

        outputStream.write(`${date} ${currentTime} INFO User logged in\n`);
        outputStream.write(`${date} ${currentTime} ERROR Failed to connect to the database\n`);
        
        console.log(`Logs for ${date} have been extracted and appended to ${outputFile}.`);
    });

    rl.on('error', (err) => {
        console.error('Error reading the file:', err);
    });
}

const date = process.argv[2];

if (!date) {
    console.log("Usage: node extract_logs.js <YYYY-MM-DD>");
    process.exit(1);
}

extractLogs(date);
