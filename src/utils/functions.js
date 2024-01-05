const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies

const responseAndDelete = (res, status, data, files) => {
    files.map((file) => {
        if (fs.existsSync(files[file])) {
            console.log(`delete file: ${files[file]}`);
            fs.unlinkSync(files[file]);
        }
        return null;
    });

    return res.status(status).send(data);
};

module.exports = {
    responseAndDelete,
};
