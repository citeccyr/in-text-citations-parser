
const Transform = require('stream').Transform;
const EasyXml = require('easyxml');

const serializer = new EasyXml({
  manifest: true,
  singularize: true,
  rootArray: 'Annotations',
  //rootElement: ''
});

class XMLTransform extends Transform {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    });
  }

  _transform (obj, encoding, cb) {
    let xmls = [];

    obj.annotations.map((annotation)=> {
      xmls.push( serializer.render(annotation) );
    });

    obj.xmls = xmls;
    this.push( obj );
    cb();
  }
}

module.exports = XMLTransform;