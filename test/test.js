/**
 * Test
 */

const fs = require('fs');
const ParserTransform = require('../index').ParserTransform;
const gost = require('../styles/gost');

//let file = './CRIS2016_paper_40_Parinov.txt';
//let file = './2014_Nevolin_rfbr.txt';
let file = './pdt-journal_112_145.txt';
const text_stream = fs.createReadStream(file);

text_stream
  .pipe(new ParserTransform(gost))
  .pipe(process.stdout)
;