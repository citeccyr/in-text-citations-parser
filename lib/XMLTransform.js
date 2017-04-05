
const Transform = require('stream').Transform;
const EasyXml = require('easyxml');

const serializer = new EasyXml({
  manifest: true,
  singularize: true,
  rootArray: '',
  rootElement: 'root'
});

const xml = `<root>
    <Linkage>
        <Object>
            <Annotation>
                <Start><!-- 2178 --></Start>
                <End><!-- 2181 --></End>
                <Exact><!-- [1] --></Exact>
                <Prefix></Prefix>
                <Suffix></Suffix>
                <Quote><!-- generated [1] --></Quote>
            </Annotation>
            <To>
                <DataType>paper</DataType>
                <Uri>http://dspacecris.eurocris.org/bitstream/11366/526/1/CRIS2016_paper_40_Parinov.pdf</Uri>
                <Handle>repec:rus:mqijxk:43</Handle>
            </To>
            <Group>repec:rus:ecoper:parinov_sergey.56054-1</Group>
            <From>
                <DataType>person</DataType>
                <Handle>repec:rus:ecoper:parinov_sergey.56054-1</Handle>
            </From>
        </Object>
    </Linkage>
    <SeriesID>intlnk</SeriesID>
    <Template-Type>linkage</Template-Type>
    <Date>
        <Creation>2017-3-25</Creation>
        <Revision>2017-3-25</Revision>
    </Date>
    <Template-Type>linkage</Template-Type>
    <Title>test</Title>

    <Handle>spz:serparinov:intlnk:pannot10</Handle>
</root>`;

const json = {
  Linkage: {
    Object: {
      Annotation: {
        Start: 0,
        End: 0,
        Exact: '',
        Prefix: '', // Empty
        Suffix: '', // Empty
        Quote: 'generated'
      },
      To: {
        DataType: 'paper',
        Uri: '',
        Handle: ''
      },
      Group: 'repec:rus:ecoper:parinov_sergey.56054-1',
      From: {
        DataType: 'person',
        Handle: 'repec:rus:ecoper:parinov_sergey.56054-1'
      }
    }
  },
  Series: 'intlnk',
  'Template-Type': 'linkage',
  Date: {
    Creation: '2017-3-27',
    Revision: '2017-3-27'
  },
  Title: '',
  Provider: {
    Name: 'Socionet'
  },
  Organization: {
    Handle: 'repec:rus:ecoorg:cemi-ras_admin.45009-org1'
  },
  DocID: '',
  Handle: 'spz:serparinov:intlnk:' // + filename prefix (DocID)
};

/**
 * Convert annotations to XML in object mode stream
 * @type {XMLTransform}
 */
module.exports = class XMLTransform extends Transform {

  /**
   *
   * @param {Object} options
   * @param {string} options.uri
   * @param {string} options.handle
   * @param {string} options.prefix
   */
  constructor(options) {
    super({
      readableObjectMode: true,
      writableObjectMode: true,
    });
    this.options = options;
  }

  /**
   *
   * @param {Object|*} obj
   * @param obj.annotations
   * @param obj.positions
   * @param obj.references
   * @param obj.xml
   * @param encoding
   * @param cb
   * @private
   */
  _transform (obj, encoding, cb) {
    let xmls = [];

    let xml;

    obj.references.map((annotation, i)=> {
      xml = Object.assign({}, json);

      xml.Linkage.Object.Annotation = annotation;
      xml.Linkage.Object.Annotation.Prefix = '';
      xml.Linkage.Object.Annotation.Suffix = '';
      xml.Linkage.Object.Annotation.Quote = 'generated ' + annotation.Exact;
      xml.Linkage.Object.To.Uri = this.options.uri;
      xml.Linkage.Object.To.Handle = this.options.handle;
      xml.DocID = this.options.prefix + i;
      xml.Title = 'title ' + xml.DocID;
      xml.Handle = xml.Handle + xml.DocID;

      xmls.push( serializer.render(xml) );
    });

    obj.xmls = xmls;
    this.push( obj );
    cb();
  }
};