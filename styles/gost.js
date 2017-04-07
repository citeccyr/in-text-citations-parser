'use strict';
/**
 * GOST citation style RegExp and normalize rules
 * example: [1]
 * @type {*}
 */
module.exports = {
  // Match all between [ ]
  // TODO: add more checks, remove support of [nm] without digits
  regexp: /\[([^\]]*)\]/gi, // parse or match
  normalize: {

    /**
     * Clean brackets from `'[1]'` to `'1'`
     * @param {string} str
     * @returns {string}
     */
    clean_brackets: function (str) {
      // remove [ and ]
      return str.replace(/\[|\]/gi, '');
    },

    /**
     * Convert list from `'1,2'` to `[1, 2]`
     * @param {string} str
     * @returns {string[]}
     */
    list: function (str) {
      // split and make list with elements
      let list = str.split(',')
        .map((item) => {
          return item.trim();
        });
      console.log('[styles/gost.js] list()', list);
      return list.length > 1
        ? list[0]
        : list;
    },

    /**
     * Convert range from `'1-3'` to `[1, 2, 3]`
     * @param {string|string[]} str
     * @returns {string[]}
     */
    range: function (str) {
      // -, Alt+0150, Alt+0151 to -
      str = str.replace(/-|–|—/, '-');
      // split, and make list with range
      let [ start, end ] = str.split('-')
        .map((item) => {
          return item.trim();
        });
      if (typeof end === 'undefined') {
        return start;
      }

      start = parseInt( start );
      end = parseInt( end );

      console.log('[styles/gost.js] start, end', start, end);

      let list = [];
      for (; start <= end; start++) {
        list.push(start);
      }
      console.log('[styles/gost.js] range()', list);
      return list;
    }
  }
};