const fs = require('fs');
const Transform = require('stream').Transform;

class FileTransform extends Transform {
  constructor(options) {
    super({
      readableObjectMode: false,
      writableObjectMode: true,
    });
    this.options = options;
  }

  _transform (obj, encoding, cb) {
    //console.log('[FileTransform] _transform', obj);
    //let string = '';
    let path;

    obj.xmls.map((xml_string, i) => {
      path = this.options.outdir + '/' +  this.options.prefix + i + '.xml';
      //console.log('[FileTransform] ', i, xml_string );
      console.log('[FileTransform] path', path );
      //string += xml_string;
      this.push(xml_string);
      fs.writeFile(path, xml_string, (err) => {
        if (err) {
          console.error('[FileTransform] fs.writeFile error', err);
        }
      });
    });
    cb();
  }
}

module.exports = FileTransform;