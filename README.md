# in-text-citations-parser

> Creates a stream from PDF

Node.js module for parsing in-text citations from streams.

Use it with [pdf-stream](https://www.npmjs.com/package/pdf-stream) module.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [Contribute](#contribute)
- [License](#license)

## Install

```
  npm install in-text-citations-parser
```

## Usage

### `new XMLTransform()` converter

```javascript
  'use strict';
  
  const fs = require('fs');
  const pdf_stream = require('pdf-stream');
  global.XMLHttpRequest = require('xhr2'); // for PDFJS
  const parser = require('in-text-citations-parser');
  const ParserTransform = parser.ParserTransform;
  const XMLTransform = parser.XMLTransform;
  const FileTransform = parser.FileTransform;

  let configs = [{
    file: './CRIS2016_paper_40_Parinov.txt',
    uri: 'http://dspacecris.eurocris.org/bitstream/11366/526/1/CRIS2016_paper_40_Parinov.pdf',
    handle: 'repec:rus:mqijxk:43',
    prefix: 'pannot1'
  },
  // ...
  ];

  configs.map((config)=> {
    fs.createReadStream(config.file)
      .pipe(new ParserTransform('gost'))
      .pipe(new XMLTransform({
        uri: config.uri,
        handle: config.handle,
        prefix: config.prefix
      }))
      .pipe(new FileTransform({
        outdir: './out',
        prefix: config.prefix,
      }));    
  });
```

### `new XMLinTextRefTransform()` converter

```javascript
  'use strict';
  
  const fs = require('fs');
  const pdf_stream = require('pdf-stream');
  
  const parser = require('in-text-citations-parser');
  const ParserTransform = parser.ParserTransform;
  const XMLinTextRefTransform = parser.XMLinTextRefTransform;
  const FileTransform = parser.FileTransform;
  
  let file = './CRIS2016_paper_40_Parinov.txt';
  //let file = './2014_Nevolin_rfbr.txt';
  //let file = './pdt-journal_112_145.txt';
  const text_stream = fs.createReadStream(file);
  
  text_stream
    .pipe(new ParserTransform('gost'))
    .pipe(new XMLinTextRefTransform())
    .pipe(new FileTransform({
      outdir: './out',
      prefix: 'CRIS2016_paper_40_Parinov_intextref',
    }))
  ;
```

## API

All methods are streams, use them with `.pipe()`.

### new ParserTransform(options)

> alternative usage: `new ParserTransform('gost')`

Find citations in text.

Options:

* `options` — String with name of predefined style (gost) or RegExp or Object, with params:
  * `regexp` — Regular expression for citation match;
  * `normalize` — Object with functions for normalizing the matched citations.

### new XMLTransform(options) 

Convert annotations to XML in object mode stream.

Options:

* uri — `xml.Linkage.Object.To.Uri`;
* handle — `xml.Linkage.Object.To.Handle`;
* prefix — `xml.DocID`.

### new XMLinTextRefTransform()

Convert annotations to XML format `in-text references` for CiteEcCyr project, in object mode stream.

### new FileTransform(options)

Save XMLs objects to XML files.

Options object:

* `outdir` — output directory;
* `prefix` — file prefix.

## Contribute

Contributors are welcome. [Open an issue](https://github.com/citeccyr/in-text-citations-parser/issues/new) or submit pull request.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

Apache 2.0

© Sergey N
