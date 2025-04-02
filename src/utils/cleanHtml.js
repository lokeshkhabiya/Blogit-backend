const cheerio = require('cheerio');

function cleanHTML(rawHtml) {
  const $ = cheerio.load(rawHtml);

  $('*').each((i, el) => {
    Object.keys(el.attribs).forEach(attr => {
      if (attr.startsWith('data-')) {
        $(el).removeAttr(attr);
      }
    });
  });

  return $.html();
}

module.exports = cleanHTML;