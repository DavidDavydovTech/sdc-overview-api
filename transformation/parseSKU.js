const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const Transform = require('stream').Transform;

let leftover = null;
const filePath = path.join(__dirname, 'sku.csv')
try {
    const read = fs.createReadStream(filePath);
    read.setEncoding('UTF8'); // Set the encoding to be utf8. 

    // Handle stream events --> data, end, and error
    read.on('data', function(chunk) {
        // const values = chunk.split(/\n(?=(?:[^"\\]*(?:\\.|"(?:[^"\\]*\\.)*[^"\\]*"))*[^"]*$)/);
        const values = chunk.split("\n");
        const top = values.length - 1;

        if (leftover !== null) {
            values[0] = leftover + values[0];
            leftover = null;
        }

        if (
            values[top]
                .split(/,(?=(?:[^"\\]*(?:\\.|"(?:[^"\\]*\\.)*[^"\\]*"))*[^"]*$)/g)
                .length !== 4
        ) {
            leftover = values.pop();
        }

        for (let i in values) {
            const value = values[i];
            const arr = value.split(/,(?=(?:[^"\\]*(?:\\.|"(?:[^"\\]*\\.)*[^"\\]*"))*[^"]*$)/g)
            const abort = false;
            let nullAmount = false;

            switch(true) {
                case arr.length !== 4:
                    // console.log(`[${i}] Warning, a line was incomplete!`, arr);
                    continue;
                // case isNaN(Number.parseInt(arr[0])):
                    // console.log(`[${i}] Warning, id was mutated (...but do we care?)`, arr[0]);
                case isNaN(Number.parseInt(arr[1])):
                    console.log(`[${i}] Warning, style_id was mutated!`, arr[1]);
                    continue;
                case arr[2][0] !== "\"" || arr[2][arr[2].length - 1] !== "\"":
                    console.log(`[${i}] Warning, size was mutated!`, arr[2]);
                    continue;
                case isNaN(Number.parseInt(arr[3])):
                    // console.log(`[${i}] Warning, id was mutated (...but do we care?)`, arr[3]);
                    nullAmount = true;
                default:
                    // no errors!
            }

            if (!abort) {
                const pathToFile = path.join(__dirname, 'sku', `${arr[1]}.json`);
                // let exists = fs.existsSync(pathToFile);
                // if (!exists) {
                //     fs.openSync(pathToFile, 'w');
                // }

                fs.appendFileSync(
                    pathToFile, 
                    `{"size":${arr[2]},"amount":${nullAmount?'null':arr[3]}}\n`, 
                    (err) => {
                        if (err) console.log(err);
                    },
                );
            }
        }
    });

    read.on('end',function() {
        console.log('FINISHED STREAM!!!!\nFINISHED STREAM!!!!\nFINISHED STREAM!!!!\nFINISHED STREAM!!!!\nFINISHED STREAM!!!!\nFINISHED STREAM!!!!\n');
    });

    read.on('error', function(err) {
    console.log(err.stack);
    });
} catch (err) {
    throw err;
}
