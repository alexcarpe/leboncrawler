var Crawler = require("crawler");
var url = require('url');
var houses = [];
var fs = require('fs');


var c = new Crawler({
    maxConnections : 50,
    forceUTF8: true,
    skipDuplicates: true,
    //rateLimits: 1000,
    // This will be called for each crawled page
    callback : function (error, result, $) {
        var house = {};
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        $('.tabsContent a.list_item.clearfix.trackable').each(function(index, a) {
            var toQueueUrl = $(a).attr('href');
           // console.log(toQueueUrl);
            c.queue("http:"+toQueueUrl);
        });
        
        $('#adview h1.no-border').each(function(index, a) {
            house.title = $(a).text().trim();
        });
        
        $('.properties_description').each(function(index, a) {
            house.description = $(a).text().trim();
        });
          
        $('span.property').each(function(index, p) {
            var p$ = $(p);
            property = p$.text().trim();
            value = p$.next().text().trim();
            house[property] = value;
           
        });
        
        $('.item_price .value').each(function(index, a) {
            house.prix = $(a).text().trim();
        });
        
        
          
       $('a.element.page').each(function(index, a) {
            var toQueueUrl = $(a).attr('href');
            c.queue("http:"+toQueueUrl);
        });
        
       /*$('.line.line_pro').each(function(index, a) {
           house.date = $(a).text().trim();
       });*/
       /* $('.button-orange.phoneNumber').onClick(function(){
            $('.phone_number').each(function(index, a) {
                house.phone = $(a).text().trim();
            });  
        })*/
         
        if(house.title){
            houses.push(house);
            console.log(houses.length);
        }
    },
    
    onDrain: function(){
        fs.writeFile("houses.txt", JSON.stringify(houses), function(err) {
            console.log(err);
        });
    }
});


c.queue('http://www.leboncoin.fr/ventes_immobilieres/offres/pays_de_la_loire/?o=1&location=Nantes');

