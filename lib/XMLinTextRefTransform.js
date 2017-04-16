
const Transform = require('stream').Transform;
const EasyXml = require('easyxml');

const serializer = new EasyXml({
  manifest: true,
  singularize: true,
  rootArray: 'intextrefs',
  //rootElement: ''
});

class XMLinTextRefTransform extends Transform {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    });
  }

  _transform (obj, encoding, cb) {
    let xmls = [];

    let in_text_references = [];
    let annotations;

    Object.keys(obj.references).map((cite_num)=> {

      annotations = obj.references[cite_num];

      annotations.map((annotation, i) => {
        annotation.Reference = cite_num;
        console.log('references', cite_num, annotation);
        in_text_references.push(
          Object.assign({}, annotation) // Fix: same last value for all references
        );
      });

    });
    xmls.push( serializer.render(in_text_references) );

    obj.xmls = xmls;

    this.push( obj );
    cb();

  }
}

module.exports = XMLinTextRefTransform;