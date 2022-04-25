import { parse } from 'csv-parse';
import fs from 'fs';

const records = [];
const content = fs.createReadStream('0X71EAA691B6E5D5E75A3EBB36D4F87CBFB23C87B0.csv', 'utf8');

const parser = parse();
content.pipe(parser);

function mapToShortNum(item) {
  // Check if it is a number
  const maybeNumber = Number(item)
  if (!Number.isNaN(maybeNumber)) {
    // If it is a number, convert it to a fixed point number
    return maybeNumber.toFixed(2);
  }
  // If it is not a number, return it as is
  return item;
}

parser.on("data", data => {
  // Add the data to the records array
  records.push(data);
})


parser.on('end', function () {
  const json = [null]
  const [header, ...data] = records;
  for (const record of data) {
    const [tokenId, ...rest] = record;

    json[Number(tokenId)] = rest.slice(-1)[0];
  }
  fs.writeFileSync('0X71EAA691B6E5D5E75A3EBB36D4F87CBFB23C87B0.json', JSON.stringify(json, null, 2));
});
