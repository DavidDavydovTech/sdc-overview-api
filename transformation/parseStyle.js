const fs = require('fs');
const fsp = fs.promises;
const path = require('path');
const Transform = require('stream').Transform;

let leftover = null;
const filePath = path.join(__dirname, 'style.csv')
let total = 0;
let parents = 0;
try {
    const read = fs.createReadStream(filePath);
    read.setEncoding('UTF8'); // Set the encoding to be utf8. 
    console.log('Started...')
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
                .length !== 6
        ) {
            leftover = values.pop();
        }

        for (let i in values) {
            const value = values[i];
            const arr = value.split(/,(?=(?:[^"\\]*(?:\\.|"(?:[^"\\]*\\.)*[^"\\]*"))*[^"]*$)/g)
            const abort = false;
            let nullSale = false;
            let boolVal = Number.parseInt(arr[5]);
            try {
                switch(true) {
                    case arr.length !== 6:
                        console.log(`[${i}] Warning, a line was incomplete!`, arr);
                        continue;
                    case isNaN(Number.parseInt(arr[1])) || isNaN(Number.parseInt(arr[0])):
                        //console.log(`[${i}] Warning, style_id was mutated!`, arr[1]);
                        continue;
                    // NOTE: NAME
                    case 
                    (
                        arr[2][0] !== "\"" 
                        || arr[2][arr[2].length - 1] !== "\""
                    )
                    && (arr[2].match(/"/g) || []).length % 2 === 0:
                        //console.log(`[${i}] Warning, size was mutated!`, arr[2]);
                        continue;
                    // NOTE: ORIGINAL_PRICE
                    case isNaN(Number.parseInt(arr[4])):
                        continue;
                    // NOTE: SALE_PRICE
                    case isNaN(Number.parseInt(arr[3])):
                        nullSale = true;
                        //console.log(arr[3])
                        break;
                    default:
                        // no errors!
                }

                if ( ![0,1].includes(boolVal) ) {
                    continue;
                }
    
                if (!abort) {
                    let photo = null
                    try {
                        photo = fs.readFileSync(path.join(__dirname, 'photo', `${arr[0]}.json`), 'utf8')
                            .split('}\n{')
                            .join('},{');
                    } catch (err) {
                        // null
                    }

                    let sku = null;
                    try {
                        sku = fs.readFileSync(path.join(__dirname, 'sku', `${arr[0]}.json`), 'utf8')
                        .split('}\n{')
                        .join('},{');
                    } catch (err) {
                        // null
                    }

                    const final = `{"name":${arr[2]},"price":${arr[4]},"salePrice":${nullSale?'null':arr[3]},"photos":${photo === null?'null':`[${photo}]`},"skus":${sku === null?'null':`[${sku}]`}}\n`;
                    fs.appendFileSync(
                        path.join(__dirname, 'style', `${arr[1]}.json`), 
                        final, 
                        (err) => {
                            throw err;
                        }
                    );
                }
            } catch (err) {
                console.log(arr);
                throw err;
            }
            
        }
        total += values.length;
        console.log(`Parsed ${total} Style collections so far...`)
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
