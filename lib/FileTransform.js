'use strict';

const fs = require('fs');
const Transform = require('stream').Transform;

module.exports = class FileTransform extends Transform {
  /**
   * Save XMLs objects to XML files
   * @param {Object} options Options object
   * @param {string} options.outdir Output directory
   * @param {string} options.prefix File prefix
   */
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
    let the_id;

    obj.xmls.map((xml_string, i) => {
      the_id = typeof obj.xmls_ids !== 'undefined'
        && typeof obj.xmls_ids[i] !== 'undefined'
        ? obj.xmls_ids[i]
        : '';
      path = this.options.outdir + '/' +  this.options.prefix + the_id + '.xml';
      //console.log('[FileTransform] ', the_id, xml_string );
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
};