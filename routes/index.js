var express = require('express');
var router = express.Router();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var neo4j = require('neo4j');
var toSource = require('tosource')
var dbaccount = '';
var dbpassword = '';
var db = new neo4j.GraphDatabase("http://" + dbaccount + ":" + dbpassword + "@" + "url:24789");
var toSource = require('tosource');
const _ = require('lodash');
const nodemailer = require('nodemailer');
var mailid = '';
var mailpassword = '';
var emailusername = undefined;
var imagedirectory = __dirname + '\\images\\';
var accounttype = ['gmail'];
var howaccount = undefined;
var howpassword = undefined;
var tutorialfinish = false;
var searchcategory = undefined;
var createcategory = undefined;
var accountimagedirectory = 'images/gmail/';
var allissueslist = undefined;
var passwordimagedirectory = 'images/reset_password/gmail/';
var passwdctr = 0;
var context = null;
var transporter = nodemailer.createTransport({

  service: "Gmail",
  auth: {
    user: mailid,
    pass: mailpassword
  }
});

var client = require('twilio')(
  '',
  ''
);
// Set up Conversation service wrapper.
var conversation = new ConversationV1({
  username: '', // replace with username from service key
  password: '', // replace with password from service key
  path: { workspace_id: '' }, // replace with workspace ID
  version_date: '2016-07-11'
});
var accumulator = {};
var base = 6000;


function getmaxincidentid() {
  var query = "MATCH (i:Issue) RETURN MAX(i.id) as maxvalue;";
  db.cypher(query, function (err, results) {
    if (err) {
      accumulator.id = 8000;
    } else {
      var jsonresult = results;
      var maxvalue = jsonresult[0].maxvalue;
      if (maxvalue > 0) {
        accumulator.id = maxvalue + 1;
      }
      else {
        accumulator.id = 3000;
      }
    }
  });
}


/* GET home page. */
var getMyXml = function (data) {
  var ret = "";
  for (var i = 0; i < data.length; i++) {
    ret += " \nId: " + data[i].id + "\tCategory: " + data[i].type + "\nDescription: \n" + data[i].description + "\n" + data[i].emailaddress + "\n";
  }
  return ret;
}
router.get('/', function (req, res) {

  console.log("hello");
  console.log(req);
  res.render('index', { title: 'Express' });

});

router.post('/', function (req, res) {
  req.session.emailaddress = req.body.username;
  //console.log();
  //res.render('index', { title: 'Express' });
  res.redirect('/');
});

router.get('/login', function (req, res) {

  //console.log(req);
  res.render('index1', { title: 'Express' });
});
router.post('/upload', function (req, res) {
  var msg = req.body;

  var created_here = "";
  // console.log(msg);
  //console.log(emailusername);
  conversation.message(msg, (err, response) => {
    if (err) {
      res.send("Something went wrong");
    }
    else if (response.output.text.length != 0) {
      console.log(response);
      if (response.output.nodes_visited.length !== 0) {
        if (response.output.nodes_visited[0] === 'issue_creation' || response.output.nodes_visited[0] === 'category_done') {
          if (response.entities.length !== 0) {
            console.log("entity is ", response.entities[0].value);
            accumulator.type = response.entities[0].value;
            getmaxincidentid();
            res.status(200);
            res.send(JSON.stringify({
              "text": response.output.text,
              "context": response.context
            }))
          }
          else {

            res.status(200);
            res.send(JSON.stringify({
              "text": response.output.text,
              "context": response.context
            }))
          }
        }
        else if (response.output.nodes_visited[0] === 'How') {
          if (response.entities.length !== 0) {
            if (response.entities[0].entity === 'category') {
              if (response.entities[0].value === 'account') {
                howaccount = 'gmail';
                //console.log(imagedirectory + howaccount + '\\signup.png');
                tutorialfinish = false;
                res.status(200);
                res.send(JSON.stringify({
                  "text": signuptutorial[howaccount][0],
                  "context": response.context,
                  "img": accountimagedirectory + 'signup.png'
                  //"img": imagedirectory + howaccount + '\\signup.png'
                }))
              }
              else if (response.entities[0].value === 'password') {
                howaccount = undefined;
                howpassword = 'gmail';
                tutorialfinish = false;
                passwdctr++;
                res.status(200);
                res.send(JSON.stringify({
                  "text": resettutorial[howpassword][0],
                  "context": response.context,
                  "img": passwordimagedirectory + 'gmail0.JPG'
                  //"img": imagedirectory + howaccount + '\\signup.png'
                }))

              }
            }
          }
          else {
            res.status(200);
            res.send(JSON.stringify({
              "text": signuptutorial[howaccount][0],
              "context": response.context
              //"img": imagedirectory + howaccount + '\\signup.png'
            }))
          }
        }
        else if (response.output.nodes_visited[0] === 'descriptionnode' || response.output.nodes_visited[0] === 'descriptionnode1') {
          accumulator.description = response.input.text;
          accumulator.emailaddress = req.session.emailaddress;
          var query = "CREATE (n:Issue " + toSource(accumulator) + ") RETURN n;";
          console.log(query);
          db.cypher(query, function (err, results) {
            console.log(results);
            if (err) {
              res.status(200);
              res.send(JSON.stringify({
                "text": "We had an error accessing database " + err,
                "context": response.context
              }))
            } else {

              sendemail(accumulator, req, res);
              // sendengineeringemail(accumulator.type,mailid);
              counterchecker(accumulator.type);
            }
          });
        }
        else if (response.output.nodes_visited[0] === 'unablelogin') {
          if (response.context.issue == 'true') {
            getmaxincidentid();
            accumulator.description = 'My account has been locked';
            accumulator.emailaddress = req.session.emailaddress;
            accumulator.type = 'account locked';
            var query = "CREATE (n:Issue " + toSource(accumulator) + ") RETURN n;";
            console.log(query);
            db.cypher(query, function (err, results) {
              console.log(results);
              if (err) {
                res.status(200);
                res.send(JSON.stringify({
                  "text": "We had an error accessing database " + err,
                  "context": response.context
                }))
              } else {

                sendemail(accumulator, req, res);
                counterchecker(accumulator.type);
              }
            });
          }
          else {
            res.status(200);
            res.send(JSON.stringify({
              "text": response.output.text,
              "context": response.context
            }))
          }
        }
        else if (response.output.nodes_visited[0] === 'AccountLocked_RaiseTicket') {
          getmaxincidentid();
          accumulator.description = 'My account has been locked';
          accumulator.emailaddress = req.session.emailaddress;
          accumulator.type = 'account locked';
          var query = "CREATE (n:Issue " + toSource(accumulator) + ") RETURN n;";
          console.log(query);
          db.cypher(query, function (err, results) {
            console.log(results);
            if (err) {
              res.status(200);
              res.send(JSON.stringify({
                "text": "We had an error accessing database " + err,
                "context": response.context
              }))
            } else {

              sendemail(accumulator, req, res);
              counterchecker(accumulator.type);
            }
          });
        }
        //AccountLocked_RaiseTicket
        else if (response.output.nodes_visited[0] === 'category-node') {

          if (response.entities.length !== 0) {
            searchcategory = response.entities[0].value;

            res.status(200);
            res.send(JSON.stringify({
              "text": response.output.text,
              "context": response.context
            }))
          }
        }
        else if (response.output.nodes_visited[0] === 'all-issues') {

          var params = { category: searchcategory };
          var query = 'MATCH (n:Issue) WHERE n.type ={category} RETURN n;';
          db.cypher({ query, params }, function (err, results) {
            console.log(results);
            if (err) {
              res.status(200);
              res.send(JSON.stringify({
                "text": "We had an error accessing database",
                "context": response.context
              }))
            } else {
              res.status(200);
              res.send(JSON.stringify({
                "text": 'This is the search result for Category  ' + searchcategory + "\n" + getMyXml(_.map(results, 'n.properties')),
                "context": response.context
              }))
              searchcategory = undefined;
            }
          });
        }



        else if (response.output.nodes_visited[0] === 'Search' || response.output.nodes_visited[0] === 'numberreceived') {
          var numberval = "";
          if (response.entities.length !== 0) {
            numberval = response.entities[0].value;
            var params = { id: parseInt(numberval, 10) };
            var query = 'MATCH (n:Issue {id:{id}}) RETURN n;';
            db.cypher({ query, params }, function (err, results) {
              console.log(results);
              if (err) {
                res.status(200);
                res.send(JSON.stringify({
                  "text": "We had an error accessing database",
                  "context": response.context
                }))
              } else {
                console.log(query);
                res.status(200);
                res.send(JSON.stringify({
                  "text": 'This is the search result for issue Id ' + numberval + " \n" + getMyXml(_.map(results, 'n.properties')),
                  "context": response.context
                }))
              }
            });
          }
          else {
            res.status(200);
            res.send(JSON.stringify({
              "text": response.output.text,
              "context": response.context
            }))
          }

        }

        else if (response.output.nodes_visited[0] === 'number-received') {
          var numberval = "";
          if (response.entities.length !== 0) {
            numberval = response.entities[0].value;
            var params = { id: parseInt(numberval, 10) };
            var query = 'MATCH (n:Issue {id:{id}}) RETURN n;';
            db.cypher({ query, params }, function (err, results) {
              console.log(results);
              if (err) {
                res.status(200);
                res.send(JSON.stringify({
                  "text": "We had an error accessing database",
                  "context": response.context
                }))
              } else {
                res.status(200);
                res.send(JSON.stringify({
                  "text": 'This is the search result for issue Id ' + numberval + ' \n' + getMyXml(_.map(results, 'n.properties')),
                  "context": response.context
                }))
              }
            });
          }

        }
        else if (response.output.nodes_visited[0] === 'next') {


          if (howaccount === 'gmail') {
            if (!tutorialfinish) {
              tutorialfinish = true;
              res.status(200);
              res.send(JSON.stringify({
                "text": signuptutorial[howaccount][1],
                "context": response.context,
                "img": accountimagedirectory + 'next.png'
              }))
            }

            else {


              res.status(200);
              res.send(JSON.stringify({
                "text": signuptutorial[howaccount][2],
                "context": response.context,
                "img": accountimagedirectory + 'finish.png'
              }))
              howaccount = undefined;
            }
          }
          else if (howpassword === 'gmail') {
            if (!tutorialfinish && passwdctr === 1) {
              //tutorialfinish = true;

              res.status(200);
              res.send(JSON.stringify({
                "text": resettutorial[howpassword][passwdctr],
                "context": response.context,
                "img": passwordimagedirectory + 'gmail1.JPG'
              }))
              passwdctr++;
            }
            else if (!tutorialfinish && passwdctr === 2) {
              //tutorialfinish = true;

              res.status(200);
              res.send(JSON.stringify({
                "text": resettutorial[howpassword][passwdctr],
                "context": response.context,
                "img": passwordimagedirectory + 'gmail2.JPG'
              }))
              passwdctr++;
            }
            else if (!tutorialfinish && passwdctr === 3) {
              //tutorialfinish = true;

              res.status(200);
              res.send(JSON.stringify({
                "text": resettutorial[howpassword][passwdctr],
                "context": response.context,
                "img": passwordimagedirectory + 'gmail3.JPG'
              }))
              passwdctr++;
            }
            else if (!tutorialfinish && passwdctr === 4) {


              res.status(200);
              res.send(JSON.stringify({
                "text": resettutorial[howpassword][passwdctr],
                "context": response.context,
                "img": passwordimagedirectory + 'gmail4.JPG'
              }))
              passwdctr++;
            }
            else if (!tutorialfinish && passwdctr === 5) {

              //tutorialfinish = true;
              res.status(200);
              res.send(JSON.stringify({
                "text": resettutorial[howpassword][passwdctr],
                "context": response.context,
                "img": passwordimagedirectory + 'gmail5.JPG'
              }))
              //howpassword=undefined;
              passwdctr++;
            }
            else if (!tutorialfinish && passwdctr === 6) {

              tutorialfinish = true;
              res.status(200);
              res.send(JSON.stringify({
                "text": resettutorial[howpassword][passwdctr],
                "context": response.context
              }))
              howpassword = undefined;
              passwdctr++;
            }

          }
          else {
            res.status(200);
            res.send(JSON.stringify({
              "text": "Good Evening. My Name is Alice. How can I help you?",
              "context": response.context,
            }))
          }
        }
        else {

          if (response.context.product_update) {
            if (response.context.product_update === 'false') {

              if (validateEmail(response.input.text)) {
                delete response.context.product_update;
                res.status(200);
                res.send(JSON.stringify({
                  "text": 'You will be receiving an email confirming that the notification settings has been enabled. <br/> Anything else I could help you with?',
                  "context": response.context
                }))
                sendnotificationemail(response.input.text);
              }
              else {
                res.status(200);
                res.send(JSON.stringify({
                  "text": 'Email address entered is invalid. Please enter an valid email address to continue',
                  "context": response.context
                }))
              }

            }
            else {
              res.status(200);
              res.send(JSON.stringify({
                "text": response.output.text,
                "context": response.context
              }))
            }
          }
          else {
            res.status(200);
            res.send(JSON.stringify({
              "text": response.output.text,
              "context": response.context
            }))
          }
        }

      }
    }
  })
});


router.get('/smssent', function (req, res) {
  //var msg = req.body;
  console.log(req.query);
  var msg = req.query.Body;

  var number = req.query.From;
  var twilioNumber = req.query.To;


  var created_here = "";
  conversation.message({
    input: { text: msg },
    workspace_id: 'd7fe6993-7819-4f97-97ef-46cc21d272e7',
    context: context
  }, (err, response) => {
    if (err) {
      res.send("Something went wrong");
    }
    else if (response.output.text.length != 0) {
      console.log(response);
      if (response.output.nodes_visited.length !== 0) {
        if (response.output.nodes_visited[0] === 'issue_creation' || response.output.nodes_visited[0] === 'category_done') {
          if (response.entities.length !== 0) {
            console.log("entity is ", response.entities[0].value);
            accumulator.type = response.entities[0].value;
            getmaxincidentid();
            client.messages.create({
              from: twilioNumber,
              to: number,
              body: response.output.text[0]
            }, function (err, message) {
              if (err) {
                console.error(err.message);
              }
            });
            res.status(200);
            res.send('');
            context = response.context;
          }
          else {

            client.messages.create({
              from: twilioNumber,
              to: number,
              body: response.output.text[0]
            }, function (err, message) {
              if (err) {
                console.error(err.message);
              }
            });
            res.status(200);
            res.send('');
            context = response.context;
          }
        }
        else if (response.output.nodes_visited[0] === 'How') {
          if (response.entities.length !== 0) {
            if (response.entities[0].entity === 'category') {
              if (response.entities[0].value === 'account') {
                howaccount = 'gmail';
                //console.log(imagedirectory + howaccount + '\\signup.png');
                tutorialfinish = false;
                client.messages.create({
                  from: twilioNumber,
                  to: number,
                  body: twiliosignuptutorial[howaccount][0],
                  mediaUrl:'https://c1.staticflickr.com/5/4164/34157282170_96ec3a5800_b.jpg'
                  //mediaUrl: accountimagedirectory + 'signup.png'
                }, function (err, message) {
                  if (err) {
                    console.error(err.message);
                  }
                });
                res.status(200);
                res.send('');
                context = response.context;
              }
              else if (response.entities[0].value === 'password') {
                howaccount = undefined;
                howpassword = 'gmail';
                tutorialfinish = false;
                passwdctr++;
                client.messages.create({
                  from: twilioNumber,
                  to: number,
                  body: twilioresettutorial[howpassword][0],
                  mediaUrl: 'https://c1.staticflickr.com/5/4166/33700519024_b53f497692_b.jpg'
                }, function (err, message) {
                  if (err) {
                    console.error(err.message);
                  }
                });
                res.status(200);
                res.send('');
                context = response.context;
              }
            }
          }
          else {
            client.messages.create({
              from: twilioNumber,
              to: number,
              body: response.output.text[0]
            }, function (err, message) {
              if (err) {
                console.error(err.message);
              }
            });
            res.status(200);
            res.send('');
            context = response.context;
          }
        }
        else if (response.output.nodes_visited[0] === 'descriptionnode' || response.output.nodes_visited[0] === 'descriptionnode1') {
          accumulator.description = response.input.text;
          accumulator.emailaddress = req.query.From;
          var query = "CREATE (n:Issue " + toSource(accumulator) + ") RETURN n;";
          console.log(query);
          db.cypher(query, function (err, results) {
            console.log(results);
            if (err) {
              res.status(200);
              res.send(JSON.stringify({
                "text": "We had an error accessing database " + err,
                "context": response.context
              }))
            } else {

              sendemail(accumulator, req, res);
              // sendengineeringemail(accumulator.type,mailid);
              counterchecker(accumulator.type);
            }
          });
        }
        else if (response.output.nodes_visited[0] === 'unablelogin') {
          if (response.context.issue == 'true') {
            getmaxincidentid();
            accumulator.description = 'My account has been locked';
            accumulator.emailaddress = req.query.From;
            accumulator.type = 'account locked';
            var query = "CREATE (n:Issue " + toSource(accumulator) + ") RETURN n;";
            console.log(query);
            db.cypher(query, function (err, results) {
              console.log(results);
              if (err) {
                res.status(200);
                res.send(JSON.stringify({
                  "text": "We had an error accessing database " + err,
                  "context": response.context
                }))
              } else {

                sendemail(accumulator, req, res);
                counterchecker(accumulator.type);
              }
            });
          }
          else {
            client.messages.create({
              from: twilioNumber,
              to: number,
              body: response.output.text[0]
            }, function (err, message) {
              if (err) {
                console.error(err.message);
              }
            });
            res.status(200);
            res.send('');
            context = response.context;
          }
        }
        else if (response.output.nodes_visited[0] === 'AccountLocked_RaiseTicket') {
          getmaxincidentid();
          accumulator.description = 'My account has been locked';
          accumulator.emailaddress = req.query.From;
          accumulator.type = 'account locked';
          var query = "CREATE (n:Issue " + toSource(accumulator) + ") RETURN n;";
          console.log(query);
          db.cypher(query, function (err, results) {
            console.log(results);
            if (err) {
              res.status(200);
              res.send(JSON.stringify({
                "text": "We had an error accessing database " + err,
                "context": response.context
              }))
            } else {

              sendemail(accumulator, req, res);
              counterchecker(accumulator.type);
            }
          });
        }
        //AccountLocked_RaiseTicket
        else if (response.output.nodes_visited[0] === 'category-node') {

          if (response.entities.length !== 0) {
            searchcategory = response.entities[0].value;

            client.messages.create({
              from: twilioNumber,
              to: number,
              body: response.output.text[0]
            }, function (err, message) {
              if (err) {
                console.error(err.message);
              }
            });
            res.status(200);
            res.send('');
            context = response.context;
          }
        }
        else if (response.output.nodes_visited[0] === 'all-issues') {

          var params = { category: searchcategory };
          var query = 'MATCH (n:Issue) WHERE n.type ={category} RETURN n;';
          db.cypher({ query, params }, function (err, results) {
            console.log(results);
            if (err) {
              res.status(200);
              res.send(JSON.stringify({
                "text": "We had an error accessing database",
                "context": response.context
              }))
            } else {
              client.messages.create({
                from: twilioNumber,
                to: number,
                body: 'This is the search result for Category  ' + searchcategory + "\n" + getMyXml(_.map(results, 'n.properties'))
              }, function (err, message) {
                if (err) {
                  console.error(err.message);
                }
              });
              res.status(200);
              res.send('');
              context = response.context;
              searchcategory = undefined;
            }
          });
        }



        else if (response.output.nodes_visited[0] === 'Search' || response.output.nodes_visited[0] === 'numberreceived') {
          var numberval = "";
          if (response.entities.length !== 0) {
            numberval = response.entities[0].value;
            var params = { id: parseInt(numberval, 10) };
            var query = 'MATCH (n:Issue {id:{id}}) RETURN n;';
            db.cypher({ query, params }, function (err, results) {
              console.log(results);
              if (err) {
                res.status(200);
                res.send(JSON.stringify({
                  "text": "We had an error accessing database",
                  "context": response.context
                }))
              } else {
                console.log(query);
                client.messages.create({
                  from: twilioNumber,
                  to: number,
                  body: 'This is the search result for issue Id ' + numberval + " \n" + getMyXml(_.map(results, 'n.properties'))
                }, function (err, message) {
                  if (err) {
                    console.error(err.message);
                  }
                });
                res.status(200);
                res.send('');
                context = response.context;
              }
            });
          }
          else {
            client.messages.create({
              from: twilioNumber,
              to: number,
              body: response.output.text[0]
            }, function (err, message) {
              if (err) {
                console.error(err.message);
              }
            });
            res.status(200);
            res.send('');
            context = response.context;
          }

        }

        else if (response.output.nodes_visited[0] === 'number-received') {
          var numberval = "";
          if (response.entities.length !== 0) {
            numberval = response.entities[0].value;
            var params = { id: parseInt(numberval, 10) };
            var query = 'MATCH (n:Issue {id:{id}}) RETURN n;';
            db.cypher({ query, params }, function (err, results) {
              console.log(results);
              if (err) {
                res.status(200);
                res.send(JSON.stringify({
                  "text": "We had an error accessing database",
                  "context": response.context
                }))
              } else {

                client.messages.create({
                  from: twilioNumber,
                  to: number,
                  body: 'This is the search result for issue Id ' + numberval + " \n" + getMyXml(_.map(results, 'n.properties'))
                }, function (err, message) {
                  if (err) {
                    console.error(err.message);
                  }
                });
                res.status(200);
                res.send('');
                context = response.context;
              }
            });
          }

        }
        else if (response.output.nodes_visited[0] === 'next') {


          if (howaccount === 'gmail') {
            if (!tutorialfinish) {
              tutorialfinish = true;
              client.messages.create({
                from: twilioNumber,
                to: number,
                body: twiliosignuptutorial[howaccount][1],
                mediaUrl: 'https://c1.staticflickr.com/5/4188/33700410494_e19e81c533_b.jpg'
              }, function (err, message) {
                if (err) {
                  console.error(err.message);
                }
              });
              res.status(200);
              res.send('');
              context = response.context;
            }
            else {

              client.messages.create({
                from: twilioNumber,
                to: number,
                body: twiliosignuptutorial[howaccount][2],
                mediaUrl: 'https://c1.staticflickr.com/5/4176/34382182092_98000a6157_b.jpg'
              }, function (err, message) {
                if (err) {
                  console.error(err.message);
                }
              });
              res.status(200);
              res.send('');
              context = response.context;
              howaccount = undefined;
            }
          }
          else if (howpassword === 'gmail') {
            if (!tutorialfinish && passwdctr === 1) {
              //tutorialfinish = true;
              client.messages.create({
                from: twilioNumber,
                to: number,
                body: twilioresettutorial[howpassword][passwdctr],
                mediaUrl: 'https://c1.staticflickr.com/5/4161/34501688736_a03e68edd3_b.jpg'
              }, function (err, message) {
                if (err) {
                  console.error(err.message);
                }
              });
              res.status(200);
              res.send('');
              context = response.context;
              passwdctr++;
            }
            else if (!tutorialfinish && passwdctr === 2) {
              //tutorialfinish = true;

              client.messages.create({
                from: twilioNumber,
                to: number,
                body: twilioresettutorial[howpassword][passwdctr],
                mediaUrl: 'https://c1.staticflickr.com/5/4157/34543257465_e0bd26038c_b.jpg'
              }, function (err, message) {
                if (err) {
                  console.error(err.message);
                }
              });
              res.status(200);
              res.send('');
              context = response.context;
              passwdctr++;
            }
            else if (!tutorialfinish && passwdctr === 3) {
              //tutorialfinish = true;

              client.messages.create({
                from: twilioNumber,
                to: number,
                body: twilioresettutorial[howpassword][passwdctr],
                mediaUrl: 'https://c1.staticflickr.com/5/4157/34157363610_df90298069_b.jpg'
              }, function (err, message) {
                if (err) {
                  console.error(err.message);
                }
              });
              res.status(200);
              res.send('');
              context = response.context;
              passwdctr++;
            }
            else if (!tutorialfinish && passwdctr === 4) {


              client.messages.create({
                from: twilioNumber,
                to: number,
                body: twilioresettutorial[howpassword][passwdctr],
                mediaUrl: 'https://c1.staticflickr.com/5/4165/33700518954_914da5ccfa_b.jpg'
              }, function (err, message) {
                if (err) {
                  console.error(err.message);
                }
              });
              res.status(200);
              res.send('');
              context = response.context;
              passwdctr++;
            }
            else if (!tutorialfinish && passwdctr === 5) {

              //tutorialfinish = true;
              client.messages.create({
                from: twilioNumber,
                to: number,
                body: twilioresettutorial[howpassword][passwdctr],
                mediaUrl: 'https://c1.staticflickr.com/5/4176/33700518704_62e2f50eed_b.jpg'
              }, function (err, message) {
                if (err) {
                  console.error(err.message);
                }
              });
              res.status(200);
              res.send('');
              context = response.context;
              //howpassword=undefined;
              passwdctr++;
            }
            else if (!tutorialfinish && passwdctr === 6) {

              tutorialfinish = true;
              client.messages.create({
                from: twilioNumber,
                to: number,
                body: twilioresettutorial[howpassword][passwdctr]
              }, function (err, message) {
                if (err) {
                  console.error(err.message);
                }
              });
              res.status(200);
              res.send('');
              context = response.context;
              howpassword = undefined;
              passwdctr++;
            }

          }
          else {
            client.messages.create({
              from: twilioNumber,
              to: number,
              body: 'Good Evening. My Name is Alice. How can I help you?'
            }, function (err, message) {
              if (err) {
                console.error(err.message);
              }
            });
            res.status(200);
            res.send('');
            context = response.context;
          }
        }
        else {

          if (response.context.product_update) {
            if (response.context.product_update === 'false') {

              if (validateEmail(response.input.text)) {
                delete response.context.product_update;
                client.messages.create({
                  from: twilioNumber,
                  to: number,
                  body: 'You will be receiving an email confirming that the notification settings has been enabled. <br/> Anything else I could help you with?'
                }, function (err, message) {
                  if (err) {
                    console.error(err.message);
                  }
                });
                res.status(200);
                res.send('');
                context = response.context;
                sendnotificationemail(response.input.text);
              }
              else {
                client.messages.create({
                  from: twilioNumber,
                  to: number,
                  body: 'Email address entered is invalid. Please enter an valid email address to continue'
                }, function (err, message) {
                  if (err) {
                    console.error(err.message);
                  }
                });
                res.status(200);
                res.send('');
                context = response.context;
              }

            }
            else {
              client.messages.create({
                from: twilioNumber,
                to: number,
                body: response.output.text[0]
              }, function (err, message) {
                if (err) {
                  console.error(err.message);
                }
              });
              res.status(200);
              res.send('');
              context = response.context;
            }
          }
          else if (response.entities.length > 0) {
            if (response.entities[0].entity == 'sys-number') {
              numberval = response.entities[0].value;
              var params = { id: parseInt(numberval, 10) };
              var query = 'MATCH (n:Issue {id:{id}}) RETURN n;';
              db.cypher({ query, params }, function (err, results) {
                console.log(results);
                if (err) {
                  res.status(200);
                  res.send(JSON.stringify({
                    "text": "We had an error accessing database",
                    "context": response.context
                  }))
                } else {

                  client.messages.create({
                    from: twilioNumber,
                    to: number,
                    body: 'This is the search result for issue Id ' + numberval + " \n" + getMyXml(_.map(results, 'n.properties'))
                  }, function (err, message) {
                    if (err) {
                      console.error(err.message);
                    }
                  });
                  res.status(200);
                  res.send('');
                  context = response.context;
                }
              });
            }
          }
          else {
            client.messages.create({
              from: twilioNumber,
              to: number,
              body: response.output.text[0]
            }, function (err, message) {
              if (err) {
                console.error(err.message);
              }
            });
            res.status(200);
            res.send('');
            context = response.context;
          }
        }

      }
    }
  })


})


var signuptutorial = {
  'gmail': [' Please click on <a target="_blank" href="https://accounts.google.com/SignUp?hl=en-GB"> this link </a> to Signup and follow the instructions. Type next to view next instruction <br/><br/>',
    'Accept the Privacy terms and conditions. Type next to continue<br/><br/>',
    'Congratulations. the Account has been successfully created. Click on continue in the link and access your email. <br/> Anything else I could help you with?<br/><br/>'],
}

var twiliosignuptutorial = {
  'gmail': [' Please follow this link https://accounts.google.com/SignUp?hl=en-GB" to Signup and follow the instructions. Type next to view next instruction',
    'Accept the Privacy terms and conditions. Type next to continue\n',
    'Congratulations. the Account has been successfully created. Click on continue in the link and access your email. \nAnything else I could help you with?\n'],
}

var resettutorial = {
  'gmail': [' Follow <a target="_blank" href="https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&sacu=1&rip=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin"> this link </a> and enter your email address and click on "next" button as shown in the below image. Type next to view next instruction <br/><br/>',
    'Click on "forgot password" button as shown in the image. Type next to continue<br/><br/>',
    'Enter the last known password for the account as shown in the image. Type next to continue<br/><br/>',
    'Select a verification type to verify the account using a text message or a call. Type next to continue<br/><br/>',
    'Enter the verification code you have received. Type next to continue<br/><br/>',
    'Enter the new password and confirm the same. Type next to continue<br/><br/>',
    'Congratulations. the Account password has been reset successfully. <br/> Anything else I could help you with?<br/><br/>'],
}

var twilioresettutorial = {
  'gmail': [' Follow this link https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&sacu=1&rip=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin" and enter your email address and click on "next" button as shown in the below image. Type next to view next instruction \n',
    'Click on "forgot password" button as shown in the image. Type next to continue',
    'Enter the last known password for the account as shown in the image. Type next to continue',
    'Select a verification type to verify the account using a text message or a call. Type next to continue',
    'Enter the verification code you have received. Type next to continue',
    'Enter the new password and confirm the same. Type next to continue',
    'Congratulations. the Account password has been reset successfully. \n Anything else I could help you with?'],
}

function sendemail(accumulator, req, res) {
  var toaddress = undefined
  console.log(req.session);
  if (req.query.From) {
    toaddress = req.query.From;
  }
  else {
    toaddress = req.session.emailaddress;
    let mailOptions1 = {
      from: mailid, // sender address
      to: toaddress, // list of receivers
      subject: '"' + accumulator.type + '" ticket request', // Subject line
      text: 'Test Data', // plain text body
      html: '<p>The ticket request has been submitted successfully. Please store ' + accumulator.id + ' for future reference </p>' // html body
    };
    transporter.sendMail(mailOptions1, (error, info) => {
      if (error) {
        console.log(error);
        // session.send("unable to send message");
        return;
      }
    });
  }

  if (req.query.From) {
    client.messages.create({
      from: req.query.To,
      to: req.query.From,
      body: "We have added this incident to our knowledgebase successfully. Please store " + accumulator.id + " for future reference"
    }, function (err, message) {
      if (err) {
        console.error(err.message);
      }
    });
    // res.context = null;
    res.status(200);
    res.send('');
    context = null;;
  }
  else {
    res.status(200);
    res.send(JSON.stringify({
      "text": 'We have added this incident to our knowledgebase successfully. Please store ' + accumulator.id + ' for future reference',
      "context": null
    }));
  }



}

function counterchecker(type) {
  var query = 'MATCH (n:issuetype {type:"' + type + '"}) set n.counter=n.counter+1 RETURN n;';
  db.cypher(query, function (err, results) {
    console.log(results);
    if (err) {
      console.log(err);
    } else {
      var jsonresults = _.map(results, 'n.properties');
      if (jsonresults[0].counter > 3) {
        updatecounter(type);
        sendengineeringemail(type, mailid);
      }
    }
  });
}

function sendengineeringemail(type, mailid) {
  getallissues(type);


}

function sendnotificationemail(recipient) {
  console.log(recipient);
  console.log(mailid);
  let mailOptions1 = {
    from: mailid, // sender address
    to: recipient, // list of receivers
    subject: 'Notification Update request', // Subject line
    text: 'Test Data', // plain text body
    html: '<p> We have updated the notification settings for this emal address. You will be receiving the product updates  <br/> <br/>  Thank you!!</p>' // html body
  };
  transporter.sendMail(mailOptions1, (error, info) => {
    if (error) {
      console.log(error);
      // session.send("unable to send message");
      return;
    }
  });
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


function updatecounter(type) {
  var params = { category: type };
  var query = 'MATCH (n:issuetype {type:{category}}) set n.counter=0 RETURN n;';
  db.cypher({ query, params }, function (err, results) {
    console.log(results);
    if (err) {
      console.log(err);
    } else {
      console.log("set counter to 0");
    }
  });
}

function getallissues(type) {
  var params = { category: type };
  var query = 'MATCH (n:Issue {type:{category}}) RETURN n;';
  db.cypher({ query, params }, function (err, results) {
    //console.log(results);
    if (err) {
      console.log(err);
    } else {
      var jsonresults = _.map(results, 'n.properties');
      console.log(jsonresults);
      allissueslist = '<table><tr><th>Ticket Id</th><th>Description</th><th>Email_Address</th></tr>'
      for (var i = 0; i < jsonresults.length; i++) {
        allissueslist += '<tr>' + '<td>' + jsonresults[i].id + '</td>' + '<td>' + jsonresults[i].description + '</td>' + '<td>' + jsonresults[i].emailaddress + '</td>' + '</tr>';
      }
      allissueslist += '</table>';
      console.log("helllllll");
      console.log('*****************************************************');
      var str = '<p>There is a emergency request on the following type of issue "' + type + '" </p> <div> These are the issues that have been filed <br/>  ' + allissueslist + '</div>';
      console.log(str);
      console.log('*****************************************************');

      let mailOptions1 = {
        from: mailid, // sender address
        to: 'sephora.engineeringteam@gmail.com', // list of receivers
        subject: '"' + type + '" ticket request', // Subject line
        text: 'Test Data', // plain text body
        html: '<p>There is a emergency request on the following type of issue "' + type + '" </p> <div> These are the issues that have been filed <br/>  ' + allissueslist + '</div>'  // html body
      };
      transporter.sendMail(mailOptions1, (error, info) => {
        if (error) {
          console.log(error);
          // session.send("unable to send  message");
          return;
        }
      });

    }
  });

}



module.exports = router;
