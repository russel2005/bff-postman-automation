const fs = require('fs');
const path = require('path');

// Function to read a file, select a random item, and save it to a new file
function createOneRandomDataSet(inputFilePath, outputFilePath) {
    try {
        // Construct full paths relative to the project root
        const dataFilePath = path.join(__dirname, '..', inputFilePath);
        const tempFilePath = path.join(__dirname, '..', outputFilePath);

        const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomData = [data[randomIndex]];

        fs.writeFileSync(tempFilePath, JSON.stringify(randomData, null, 2));

        console.log(`✅ Random data set from "${path.basename(inputFilePath)}" selected and saved to "${path.basename(outputFilePath)}"`);
    } catch (error) {
        console.error(`❌ Error processing data file: ${inputFilePath}`, error);
        process.exit(1);
    }
}

// Define the file paths for each data set
const maInputPath = 'tests/MemberDetails/MemberDetails-TestData-MA-QAR.json';
const maOutputPath = 'tests/MemberDetails/MemberDetails-oneSet-data-MA-QAR.json';

const dqInputPath = 'tests/MemberDetails/MemberDetails-TestData-DQ-QAR.json';
const dqOutputPath = 'tests/MemberDetails/MemberDetails-oneSet-data-DQ-QAR.json';

// Call the function for each data set
createOneRandomDataSet(maInputPath, maOutputPath);
createOneRandomDataSet(dqInputPath, dqOutputPath);
