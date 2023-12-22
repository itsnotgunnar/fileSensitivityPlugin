const fs = require('fs').promises;
const path = require('path');

// Regular expressions for different data types
const regexPatterns = {
    email: /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/g,
    ssn: /\b(?!000|666|9\d{2})([0-8]\d{2}|7([0-6]\d))([-]?|\s{1})\d\d\3(?!0000)\d{4}\b/g,
    ipv4: /\d{1,3}[.]\d{1,3}[.]\d{1,3}[.]\d{1,3}/g,
//    date: /([1][12]|[0]?[1-9])[\/-]([3][01]|[12]\d|[0]?[1-9])[\/-](\d{4}|\d{2})/g,
    masterCard: /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/g,
    visa: /\b([4]\d{3}[\s]\d{4}[\s]\d{4}[\s]\d{4}|[4]\d{3}[-]\d{4}[-]\d{4}[-]\d{4}|[4]\d{3}[.]\d{4}[.]\d{4}[.]\d{4}|[4]\d{3}\d{4}\d{4}\d{4})\b/g,
    amex: /^3[47][0-9]{13}$/g,
    zipCode: /^((\d{5}-\d{4})|(\d{5})|([A-Z]\d[A-Z]\s\d[A-Z]\d))$/g,
//    filePath: /\\[^\\]+$/g
};

async function scanDirectory(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    for (let file of files) {
        const filePath = path.join(dir, file.name);
        if (file.isDirectory()) {
            await scanDirectory(filePath); // Recursive call for directories
        } else if (file.isFile()) {
            await scanFile(filePath);
        }
    }
}

async function scanFile(filePath) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        console.log(`Scanning ${filePath}...`);
        for (let [type, regex] of Object.entries(regexPatterns)) {
            const matches = content.match(regex) || [];
            if (matches.length > 0) {
                console.log(`Found ${matches.length} ${type} in ${filePath}`);
                // You can also log individual matches if needed
            }
        }
    } catch (err) {
        console.error(`Error reading file ${filePath}: ${err.message}`);
    }
}

// Replace '/path/to/directory' with the path of the directory you want to scan
scanDirectory('/file/path').catch(console.error);

