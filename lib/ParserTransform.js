'use strict';

const Transform = require('stream').Transform;
const EasyXml = require('easyxml');

const serializer = new EasyXml({
  manifest: true,
  singularize: true,
  rootArray: 'Annotations',
  //rootElement: ''
});

const CITATION_LENGTH = 120;

class ParserTransform extends Transform {

  /**
   * Find citations in text
   * @param {Object|string} options String with name of predefined style or RegExp or Object
   * @param {RegExp} [options.regexp] Regular expression for citation match
   * @param {Function[]} [options.normalize] Object with functions for normalizing of matched citations
   */
  constructor(options) {
    super({
      readableObjectMode: false,
      writableObjectMode: true,
    });

    if (options instanceof RegExp) {
      options = {
        regexp: options
      };
    }
    if (typeof options === 'string' ) {
      // TODO: Add loader for options.style (string)
      const style = require('../styles/' + options);
      const regexp = style
        && style.regexp instanceof RegExp
        ? style.regexp
        : false;

      if (!regexp) {
        throw new Error(
          '[ParserTransform] style ' + style + ' is not found in module directory `/styles`\n' +
          'please use RegExp instead or make pull request with new style'
        );
      }

      options = {
        regexp: regexp
      };
      if (typeof style.normalize !== 'undefined') {
        options['normalize'] = style.normalize;
      }
    }

    if (!options
    || !options.regexp instanceof RegExp) {
      throw new Error('[Parser Transform] not found `options.regexp`\n' +
        'set parameter like this `new ParserTransform ( { regexp: ... } );` '
      )
    }

    this.regexp = options.regexp;
    this.normalize = typeof options.normalize !== 'undefined'
      ? options.normalize
      : {};
  }

  /**
   * Transform stream
   * @param {Buffer} obj
   * @param encoding
   * @param cb
   * @private
   */
  _transform (obj, encoding, cb) {
    //console.log('[ParserTransform]', encoding, obj );
    // TODO: maybe use buffer
    let string = obj.toString();
    // TODO: Rewrite to Map and Set or use hashtable
    let matches = string.match(this.regexp);
    //console.log('[ParserTransform] matches', this.regexp, matches);

    let count_match = {};
    matches.map((match) => {
      if (typeof count_match[match] === 'undefined') {
        count_match[match] = 1;
      } else {
        ++count_match[match];
      }
    });
    //console.log('[ParserTransform] count_match', count_match);

    let count;
    let last_position;
    let positions = {};
    let references = {};
    let annotations = [];
    let end;
    Object.keys(count_match).map((match) => {
      last_position = 0;
      count = count_match[match];

      // Get position of inline citation in text
      for (let i = 0; i < count; i++) {
        // Fix: because not finding last position from current
        last_position = string.indexOf(match, last_position + 1);
        if (typeof positions[match] === 'undefined') {
          positions[match] = [];
        }

        end = last_position + match.length;
        let annotation = {
          Prefix: string.substr(last_position - CITATION_LENGTH, CITATION_LENGTH),
          Suffix: string.substr(end, CITATION_LENGTH),
          Start: last_position,
          End: end,
          Exact: match
        };
        positions[match].push(annotation);
        annotations.push( annotation);
      }

      // Create reference list
      // TODO move let outside of cycle
      let [citations] = this._normalize(match);
      if (typeof citations === 'string') {
        references[citations] = positions[match];
      } else if (Array.isArray(citations)) {
        let citation;
        for (let i = 0, ii = citations.length; i < ii; i++) {
          citation = citations[i];
          references[citation] = positions[match];
        }
      }

    });
    //console.log('[ParserTransform] positions', positions);
    //console.log('[ParserTransform] references', references);



    let xml_doc = serializer.render(annotations);
    this.push( xml_doc );
    cb();
  }

  /**
   * Normalize citation
   * @param match
   * @returns {*}
   * @private
   */
  _normalize(match) {
    if (typeof this.normalize === 'undefined'
      || Object.keys(this.normalize).length === 0) {
      return [match];
    }

    let stage_func;
    let results = match;
    Object.keys(this.normalize).map((stage_name) => {
      stage_func = this.normalize[stage_name];
      //console.log('_normalize - stage before', stage_name, results);

      if (Array.isArray( results )) {
        let temp_results = [];
        results.map((item) => {
          let temp = stage_func( item );
          temp_results.push( temp );
        });
        results = temp_results;
      } else {
        results = stage_func(results);
      }
      //console.log('_normalize - stage after', stage_name, results);

    });

    return results;
  }
}

module.exports = ParserTransform;