var express= require('express');
var request = require('request');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/static'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/3000');

app.get('/', function(req, res) {
    url = 'http://www.thestranger.com/events//2016-06-01?picks=true';

    // The structure of our request call
    // The first parameter is our URL
    // The callback function takes 3 parameters, an error, response status code and the html

    request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            //console.log($('.calendar-post'));

            $('.calendar-post').map(function(i, value) {
              var title = $(value).find('.calendar-post-left .calendar-post-title a').text();
              var date = $(value).find('.calendar-post-date').text();
              var location = $(value).find('.calendar-post-neighborhood').text();
              var price = $(value).find('.calendar-post-event-price').text();
              var category = $(value).find('.calendar-category').text();
              var link = $(value).find('.calendar-post-title a').attr("href");
              var image = $(value).find('.calendar-post-image img').attr("src");
              var results = [];
              for (i=0;i<title.length;i++){
                var item = {"title": title[i], "date": date[i], "location": location[i], "price": price[i], "category": category[i], "link": link[i], "image": image[i]};
                results.push(item);
              }
              console.log("results are: ",results);
            });


            // $('.calendar-post').filter(function(){
            //   var data = $(this);
            //   console.log(data.children(".calendar-post-left .calendar-post-title a"));
            // });
            // Finally, we'll define the variables we're going to capture
           //  for (i=0;i<data.length;i++)
           //   var title, date, category, location, price;
           //   var json = { title : "", date : "", category : "", location : "", price : ""};
           // }
        }
    })
    res.send('haha'); 
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

app.listen(3000);