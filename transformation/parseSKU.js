const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const Transform = require('stream').Transform;

const filePath = path.join(__dirname, 'sku.csv')
try {
    const fileToRead = fs.createReadStream(filePath);  
    const transform = new Transform({
        writableObjectMode: true,
        transform(chunk) {
            const data = chunk.toString();
            console.log(data);
            const lines = data.split('\n');
            let keys = lines[0].split(',');
            keys = keys.map((key) => key.replace(/\n (?= ( [^"] * "[^"] * " ) * [^"] * $ )/g, ''));
            fileToRead.close();
        }
    });

    fileToRead.pipe(transform);
} catch (err) {
    throw err;
}

// fsp.readdir(__dirname)
//    .then((arr) => {
//        const filtered = arr.filter((e) => {
//            const split = e.split('.');
//            const extension = split[split.length - 1];
//            if (extension === 'csv') {
//                return true;
//            }
//        })
//        return filtered
//    })
//    .then((csvs) => {
//        const promises = [];
//        for (let csv of csvs) {
//            promises.push(findKeys(
//                csv.split('.')[0], 
//                path.join(__dirname, csv)
//            ));
//        }
//        return Promise.all(promises);
//    })
//    .then((tables) => {
//        console.log(tables);
//        for (let table of tables) {
//            for (let key of table.keys) {
//                if (key.toLowerCase().includes('id') && key.length > 2) {
//                    const parent = key.toLowerCase().replace(/id/g,'');
//                    const canidates = tables.filter((e) => e.name.toLowerCase() === parent);
//                    if (canidates.length > 0) {
//                        for (let canidate of canidates) {
//                            canidate.children.push(table);
//                            table.parents.push(canidate);
//                            console.log(`${table.name} is a child of ${parent} because of the ${key} key.`);
//                        }
//                    }
//                }
//            }
//        }
//        console.log(tables);
//    })