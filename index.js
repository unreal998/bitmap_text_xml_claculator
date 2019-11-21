const xml2js = require("xml2json");
const fs = require('fs');

let currentFile = process.argv[process.argv.length - 1].toString();

fs.readFile(__dirname + '/' + currentFile, 'utf8', function(err, data) {
    if (err) throw err;
    let calculatedObj = calculateXOffsetValue(data);
    let convertToXml = xml2js.toXml(JSON.stringify(calculatedObj));
    fs.writeFile(__dirname + '/' + currentFile, convertToXml, function(err) {
        if (err) throw err;
        console.warn('symbols "," and "." might be wrong calculating, check it!!!');
        console.log('It\ saved!');
    });
});

function calculateXOffsetValue(data) {
    let json = xml2js.toJson(data);
    let jsonObj = JSON.parse(json);
    let maxVal = 0;
    if (jsonObj.font && jsonObj.font.chars && jsonObj.font.chars.char)  {
        for (obj of jsonObj.font.chars.char) {
            maxVal = obj.xadvance > maxVal ? obj.xadvance : maxVal;
        }
        for (obj of jsonObj.font.chars.char) {
            if (obj.width !== 0) {
                if (maxVal - obj.width > obj.width || maxVal - obj.width > 100)  {
                    obj.xoffset = obj.xadvance - obj.width;
                }
                else {
                    obj.xadvance = maxVal;
                    obj.xoffset = obj.xadvance - obj.width;
                }
            }
        }
    }
    else {
        console.error(`wrong xml, it work only fow bitMap text xmls`)
    }

    return jsonObj
}