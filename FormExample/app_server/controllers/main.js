var lineReader = require('line-reader');


/*
 * GET home page.
 */
module.exports.home = function(request, result) 
{
   sendPage('index.html', result);
};


module.exports.get_textfields = function(request, result) 
{
   sendPage('text.html', result);
};

module.exports.post_textfields = function(request, result) 
{
   var text = '   Hello, ' + getName(request);
   sendBody(text, result);
};

module.exports.get_checkboxes = function(request, result) 
{
   sendPage('checkbox.html', result);
};
module.exports.post_checkboxes = function(request, result) 
{
   var text = '   Hello, ' + getName(request);   
   text = modify(text, request);
   sendBody(text, result);
};
module.exports.get_radiobuttons = function(request, result) 
{
   sendPage('radio.html', result);
};

module.exports.post_radiobuttons = function(request, result) 
{
   var direction = request.body.direction;
   var text = direction === 'coming' ? 'Hello' : 'Goodbye';
   console.log(text)
   text = text + ', ' + getName(request);
   text = modify(text, request);
   sendBody(text, result);
};

module.exports.get_menu = function(request, result) 
{
   sendPage('select.html', result);
};

module.exports.post_menu = function(request, result) 
{
   var direction = request.body.direction;
   var language = request.body.language;
   var text;
    
   // Process language and direction.
   if(direction === "coming") 
   {
       switch(language) 
       {
           case "english":
               text = "Hello";
               break;
           case "french":
               text = "Bonjour";
               break;
           case "german":
               text = "Guten Tag";
               break;
           default:
               text ="";
       }
   }
    else if (direction === "going") 
   {
       switch (language) 
       {
           case "english":
               text = "Goodbye";
               break;
           case "french":
               text = "Au revoir";
               break;
           case "german":
               text = "Auf wiedersehen";
               break;
           default:
               text ="";
       }
   }
           
   text = text +', ' + getName(request);
   text = modify(text, request);
   sendBody(text, result);
};


//var x = document.getElementById("demo");

// function getLocation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   } else { 
//     x.innerHTML = "Geolocation is not supported by this browser.";
//   }
// }

// function showPosition(position) {
//   x.innerHTML = "Latitude: " + position.coords.latitude + 
//   "<br>Longitude: " + position.coords.longitude;
// }




/**
 * Extract the first and last names from the request.
 * @param request the HTTP request.
 * @returns a string containing the first and last names.
 */
function getName(request)
{
   var firstName = request.param('firstName');
   var lastName  = request.param('lastName');
    
   return firstName + ' ' + lastName + '!';
}

/**
 * Send the contents of an HTML page to the client
 * with an inserted body text.
 * @param text the body text.
 * @param result the HTTP result.
 */
function sendBody(text, result)
{
   var html = '<!DOCTYPE html>\n'
       + '<html lang="en-US">\n'
       + '<head>\n'
       + '   <meta charset="UTF-8">\n'
       + '   <title>Form Examples</title>\n'
       + '</head>\n'
       + '<body>\n'
       + '   ' + text + '\n' // insert the body text
       + '</body>\n'
       + '</html>\n';
    
   result.send(html);   
}

function sendPage(fileName, result)
{
   var html = '';
    
   // Read the file one line at a time.
   lineReader.eachLine(fileName,
       function(line, last)
       {
           html += line + '\n';
           if (last) 
           { 
               result.send(html);
               return false; 
           }
           else
           {
               return true;
           }
       });
}

/**
 * Extract the strong and emphasized values from the request.
 * Surround the text with <strong> or <em> tags.
 * @param text the text to surround.
 * @param request the HTTP request.
 * @returns a string containing the surrounded text.
 */
function modify(text, request)
{
   if (request.body.strong)
   {
       text = '<strong>' + text + '</strong>'; 
   }
    
   if (request.body.em)
   {
       text = '<em>' + text + '</em>'; 
   }
    
   return text;
}
