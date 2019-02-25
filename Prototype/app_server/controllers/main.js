var lineReader = require('line-reader');

/**
 * Send the contents of an HTML page to the client.
 * @param fileName the name of the file containing the HTML page.
 * @param result the HTTP result.
 */
function sendPage(fileName, result)
{
    var html = '';

    // Read the file one line at a time.
    lineReader.eachLine(fileName,
        /**
         * Append each line to string html.
         * Send the contents of html to the client
         * after the last line has been read.
         * @param line the line read from the file.
         * @param last set to true after the last line.
         */
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
        + '    <meta charset="UTF-8">\n'
        + '    <title>Form Examples</title>\n'
        + '</head>\n'
        + '<body>\n'
        + '    ' + text + '\n'  // insert the body text
        + '</body>\n'
        + '</html>\n';

    result.send(html);
}



/**
 * Extract crime details from the request.
 * @param request the HTTP request.
 * @returns a string containing the crime details.
 */
function getCrimeDetails(request)
{
    var date = request.param('date');
    var address  = request.param('address');
    var crime = request.param('crime');
    var description=request.param('description');
    var arrest = request.param('arrest');
    var domestic = request.param('domestic');
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("crime1");
	  var myobj = [
	    { date:date,
	    	address: address,
	        crime: crime,
	        description: description,
	        arrest: arrest,
	        domestic:domestic}
	  ];
	  dbo.collection("crimeDetails").insertMany(myobj, function(err, res) {
	    if (err) throw err;
	    console.log("Number of documents inserted: " + res.insertedCount);
      });

    });

    var crimeDetails='Date: '+date+'<br>Address:'+address+'<br>Crime:'+crime+'<br>Description:'+description+
    '<br>Arrest: '+arrest+'<br>Domestic:'+domestic;
    return crimeDetails;
}

function getAllCrimeDetails(request,res)
{
	var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("crime1");
    var crimeDetails = "";
    dbo.collection("crimeDetails").find({}).toArray(function(err, result) {
    if (err) throw err;
    crimeDetails = result;
    var crimeDetailsOne = "";
    for(i =0;i<crimeDetails.length;i++){
        console.log(crimeDetailsOne);
        crimeDetailsOne += 'Date: '+crimeDetails[i].date+'<br>Address:'+crimeDetails[i].address+'<br>Crime:'+crimeDetails[i].crime+'<br>Description'+crimeDetails[i].description+
        '<br>Arrest: '+crimeDetails[i].arrest+'<br>Domestic:'+crimeDetails[i].domestic+'<hr>';
    }
    if (crimeDetailsOne) {
    	var text = '   <h1> Crime Details </h1> <br>' + crimeDetailsOne;
        sendBody(text,res);
    }
    else {
    	var text = '   <h1> Crime Details </h1> <br>' + '<p> No Records to Display</p>' +
    	'<p> Note: Add a crime from Home Page to view crime records </p>';
        sendBody(text,res);
    } 
    });

});

}
/*
 * GET Add Crime page.
 */
module.exports.get_addcrime = function(request, result)
{

    sendPage('./public/addcrime.html', result);
};


/*
 * POST text fields page.
 */
module.exports.post_addcrime = function(request, result)
{
    var text = '   <b> Crime Details </b> <br>' + getCrimeDetails(request);
    sendBody(text, result);
};

/*
* Get View Crime Page
*/
module.exports.get_viewcrime = function(request, result)
{
    getAllCrimeDetails(request,result);
};


// added code
var registeredUsers = [];

module.exports.loggedIn = function(req, res, next)
{
   console.log("Checking if logged in:");
   if (req.session.user)
   {
       // Proceed if the user is logged in.
       console.log("Logged in: ");
       console.log(req.session.user);
       next(); 
   } 
   else 
   {
       console.log("Not logged in");
       res.send("You must first log in.");
   }
};

/*
 * GET registration page.
 */
module.exports.get_register = function(req, res)
{
   //res.render('register',
   //           {message:"Please register!"});
   sendPage('./public/register.html', res);
};
/*
 * POST registration page.
 */
module.exports.post_register = function(req, res)
{
   if (!req.body.username || !req.body.password)
   {
       res.status("400");
       res.send("Invalid details!");
   } 
   else 
   {
       // Create an array of users with matching usernames.
       var matches = registeredUsers.filter(function(user)
                     {
                        return user.username === req.body.username;
                     });
// If there is a match, the user has already registered.
       if (matches.length > 0)

       {
          var text = "User already registered!";
          sendBody(text, res);
           //res.render('register',
           //            {message:"User already registered!"});
       }
        
       // Register a new user.
       else
       {
           var newUser = { username: req.body.username, 
                           password: req.body.password };
           registeredUsers.push(newUser);
           console.log("New user:");
           console.log(newUser);
           console.log("Registered users:");
           console.log(registeredUsers);
           res.redirect('/login');
       }
   }
};


/*
 * GET login page.
 */
module.exports.get_login = function(req, res)
{
   //res.render('login', { message:"Please log in!"});
   sendPage('./public/login.html', res);
};
/*
 * POST login page.
 */
module.exports.post_login = function(req, res)
{
   console.log("Registered users:"); console.log(registeredUsers);
   console.log("Logging in: " + req.body.username + "/"
                              + req.body.password);
                              // Create an array of users with matching credentials.
   var matches = registeredUsers.filter(function(user)
                 {
                     return    (user.username === req.body.username) 
                            && (user.password === req.body.password);
                 });
    
   console.log("Matching credentials: "); console.log(matches);
    
   if (matches.length == 0)
   {
       sendPage('./public/login.html', res);
   }
   else
   {
       // The user is logged in for this session.
       req.session.user = matches[0];
       console.log("Sucessfully logged in:"); 
       console.log(req.session.user.username);
      
       res.redirect('/viewcrime'); // can change
                  //{ name: req.session.user.username }, res);
   }
};
/*
 * GET logout page.
 */
module.exports.get_logout = function(req, res)
{
   console.log("Logging out:");
    
   if (req.session.user)
   {
       var name = req.session.user.username;
       console.log(name);
        
       req.session.destroy(function()
       {
           console.log(name + " logged out.");
       });
        
       //res.send(name + " is now logged out.");
       sendPage('/', res);
   }
   else
   {
       console.log("Nobody is currently logged in!");
       
   }
};

/*
 * GET home page.
 */
module.exports.index = function(req, res, next) 
{
    res.render('index', { title: 'Safelink Home Page' });
};
