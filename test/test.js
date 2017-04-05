/**
 * Test
 */
'use strict';

const fs = require('fs');

const pdf_stream = require('pdf-stream');
global.XMLHttpRequest = require('xhr2'); // for PDFJS

const ParserTransform = require('../index').ParserTransform;
const XMLTransform = require('../index').XMLTransform;
const FileTransform = require('../index').FileTransform;

const gost = require('../styles/gost');

//let file = './CRIS2016_paper_40_Parinov.txt';
//let file = './2014_Nevolin_rfbr.txt';
//let file = './pdt-journal_112_145.txt';

let configs = [{
  file: './CRIS2016_paper_40_Parinov.txt',
  uri: 'http://dspacecris.eurocris.org/bitstream/11366/526/1/CRIS2016_paper_40_Parinov.pdf',
  handle: 'repec:rus:mqijxk:43',
  prefix: 'pannot1'
}, {
  file: './2014_Nevolin_rfbr.txt',
  uri: 'http://nevolin.socionet.ru/files/2014_Nevolin_rfbr.pdf',
  handle: 'repec:rus:pgfhxz:wp9',
  prefix: 'pannot2'
}, {
  file: './pdt-journal_112_145.txt',
  uri: 'http://www.pdt-journal.com/jour/article/viewFile/112/145.pdf',
  handle: 'spz:neicon:pdt:y:2016:i:4:p:25-34',
  prefix: 'pannot3'
}];

let config = configs[0];

//const text_stream = fs.createReadStream(file);
//const text_stream = fs.createReadStream(config.file);

configs.map((config) => {
  generate_xml_files(config)
});

function generate_xml_files( config ) {
  // TODO: fix problem with streaming using xhr2, getting only part files
  /*new pdf_stream.PDFReadable({
    src: config.uri
  }).on('error', function(err){
    console.error('PDFReadable error', err);
  }).pipe(new pdf_stream.PDFStringifyTransform({
    whitespace: ''
  }))*/
  fs.createReadStream(config.file)
    .pipe(new ParserTransform(gost))
    .pipe(new XMLTransform({
      uri: config.uri,
      handle: config.handle,
      prefix: config.prefix
    }))
    .pipe(new FileTransform({
      outdir: '.',
      prefix: config.prefix,
    }))
    //.pipe(process.stdout)
  ;
}