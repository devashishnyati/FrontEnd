/*
 * GET home page.
 */
module.exports.index = function(req, res) 
{
   var html = '<!DOCTYPE html>\n'
            + '<html lang="en-US">\n'
            + '<head>\n'
            + '   <meta charset="UTF-8">\n'
            + '   <title>Hello, world</title>\n'
            + '</head>\n'
            + '<body>\n'
            + '   <h1>Hello, world!</h1>\n'
            + '</body>\n'
            + '</html>\n';
   res.send(html);
};
