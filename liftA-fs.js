/*
MIT License

Copyright (c) 2017 Bill Enright

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function () {

  'use strict';

  module.exports = ((fs) => {
    let arw = require('lifta')();

    let readFileA = (x, cont, p) => {
      let cancelled = false;
      let cancelId;
      fs.readFile(x, (err, data) => {
        // if not cancelled, advance and continue
        if (!cancelled) {
          p.advance(cancelId);
          if (err) {
            err.x = x;
            cont(err, p);
          } else {
            cont(data, p);
          }
        }
      });
      cancelId = p.add(() => cancelled = true);
      return p;
    };

    let writeFileA = (x, cont, p) => {
      let cancelled = false;
      let cancelId;
      fs.writeFile(x.fileName, x.data, (err) => {
        // if not cancelled, advance and continue
        if (!cancelled) {
          p.advance(cancelId);
          if (err) {
            err.x = x;
            cont(err, p);
          } else {
            cont(x, p);
          }
        }
      });
      cancelId = p.add(() => cancelled = true);
      return p;
    };

    return {
      readFileA: readFileA,
      writeFileA: writeFileA
    }
  })(require('fs'));

})();