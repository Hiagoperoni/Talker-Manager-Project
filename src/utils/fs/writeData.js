const fs = require('fs/promises');

const writeFile = async (data, path) => {
    try {
        await fs.writeFile(path, JSON.stringify(data));
        return true;
    } catch (err) {
        console.log('Error on write file');
        console.log(err.message);
        return false;
    }
};

module.exports = { writeFile };
