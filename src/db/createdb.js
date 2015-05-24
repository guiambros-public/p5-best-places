function read_db() {
    // Read data about the 50 most popular places in NYC. Data is mixed with HTML, in a <script/> section.
    // Source: http://www.complex.com/pop-culture/2014/07/the-50-coolest-places-in-nyc-right-now/.
    // Sample content:
    //      <p><strong>Neighborhood<\/strong>: Greenwich Village<br \/>
    //      <strong>Address<\/strong>: <a href=\"https:\/\/www.google.com\/maps\/place\/Bergino+Baseball+Clubhouse\/@40.732776,-73.99177,17z">67 E. 11th St<\/a>.<br \/>
    //      <strong>Website<\/strong>: <a href=\"http:\/\/...\/\">bergino.com<\/a><\/p>\r\n<p>....description...<\/a><\/p>",

    var fs = require("fs");
    var baseImgUrl = 'http://images.complex.com/complex/image/upload/t_article_image/';
    var source = fs.readFileSync("./nyc-best-50-places.html", "utf-8");

    var cheerio = require('cheerio');
    var $ = cheerio.load(source);

    var load_script = $("script").eq(13).html();
    eval(load_script);

    if (p_dslArticleData.slides.length != 50) {
        throw new Error("ERROR; please check source file");
    }
    var data = [];

    p_dslArticleData.slides.forEach(function (item)  {
        $ = cheerio.load(item.content);
        var c = $("p").first().text().replace(/(\r\n|\n|\r)/gm, "").replace(/(\ )/gm, " "); // clean string, remove cr/lf
        var p = {
            'address': "",
            'website': "",
            'neighborhood': "",
            'image': "",
            'description': "",
            'favorite': false
        };
        p.address      = c.match("Address\:\ (.*)Website")[1];
        p.website      = c.match("Website\:\ (.*)")[1];
        p.neighborhood = c.match("Neighborhood\:\ (.*)Address")[1];
        p.image        = baseImgUrl + item.preview.cloudinaryId + "." + item.preview.format;
        p.description = $("p").last().html();
        data.push(p);
        //console.log (p);
    });

    return data;
};

var fs = require("fs");
data = read_db();
fs.writeFileSync('./data.json', JSON.stringify(data) , 'utf-8');

//console.log(data);

