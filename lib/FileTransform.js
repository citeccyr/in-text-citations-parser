const fs = require('fs');
const Transform = require('stream').Transform;

class FileTransform extends Transform {
  constructor(options) {
    super({
      readableObjectMode: false,
      writableObjectMode: true,
    });
  }

  _transform (obj, encoding, cb) {
    //console.log('[FileTransform] _transform', obj);
    //let string = '';
    obj.xmls.map((xml_string, i) => {
      console.log('[FileTransform] ', i, xml_string );
      //string += xml_string;
      this.push(xml_string);
    });
    cb();
  }
}

module.exports = FileTransform;