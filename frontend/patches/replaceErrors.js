const fs = require('fs');

const filePath = 'src/api/axios-client/Client.ts';
const searchString = 'An unexpected server error occurred.';
const replacementString = '        throw response.data;';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const lines = data.split('\n');
  const updatedLines = lines.map((line) => {
    if (line.includes(searchString)) {
      return replacementString;
    }
    return line;
  });

  const updatedData = updatedLines.join('\n');

  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to file:', err);
      return;
    }
    console.log('Line replaced successfully.');
  });
});
