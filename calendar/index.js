cheerio = require('cheerio');
var request = require('request');

var display = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

module.exports = function (cb) {
  request.get('http://www.toddscalendar.com/', function (err, res, body) {
    if (err) return cb(err);
    $ = cheerio.load(body);
    var cal = $('table table');

    // 7 arrays with each day's events as {time: 'blah', text: 'blah'}
    // Monday is 0
    var days = toArray(cal[0].children[3].children[3])
    .filter(odds.bind(this))[1]
    .filter(odds.bind(this))
    .map(function (d) {
      return d.children[1].children[1].children;
    }).map(function (d) {
      return d.filter(odds.bind(this));
    }).map(function (d) {
      return d.map(function (e) {
        return {
          time: e.children[1].children[3].children[1].children[0].data,
          text: e.children[1].children[1].children[1].children[0].data
        };
      });
    });

    // flatten all those into one array with the day of the week included
    var result = [].concat.apply([], display.map(function (day, i) {
      return days[i].map(function (d) {
        d.day = day;
        return d;
      });
    }));

    cb(null, result);
  });
};

function toArray(obj) {
  delete obj._root;
  delete obj.length;
  delete obj.options;
  delete obj.prevObject;

  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}

function odds(val, i) {
  return i % 2 == 1;
}
