// Count all of the links from the io.js build page
var cheerio = require('cheerio');
var fs = require("fs");
var source = fs.readFileSync("./nyc-best-50-places.html", "utf-8");
var num = 0;
var baseImgUrl = 'http://images.complex.com/complex/image/upload/t_article_image/';

$ = cheerio.load(source);

var data = $("script").eq(13).html();
eval(data);
if (p_dslArticleData.slides.length != 50) {
    throw new Error("ERROR; please check source file");
}

p_dslArticleData.slides.forEach(function (s)  {
    $ = cheerio.load(s.content);
    console.log(s.ordinal + " - " + s.headline + " - " + s.preview.cloudinaryId + "." + s.preview.format);
    content = $("p").first().text().replace(/(\r\n|\n|\r)/gm, "").replace(/(\ )/gm, " ");
    address      = content.match("Address\:\ (.*)Website")[1];
    website      = content.match("Website\:\ (.*)")[1];
    neighborhood = content.match("Neighborhood\:\ (.*)Address")[1];
    description = $("p").last().html();

    console.log("address: " + address);
    console.log("neighborhood: " + neighborhood);
    console.log("website: " + website);
    //console.log("description: " + description);
    console.log("-----------------------------------------------------------------");
});


/*


<p><strong>Neighborhood<\/strong>: Greenwich Village<br \/>
<strong>Address<\/strong>: <a href=\"https:\/\/www.google.com\/maps\/place\/Bergino+Baseball+Clubhouse\/@40.732776,-73.99177,17z\/data=!3m1!4b1!4m2!3m1!1s0x0:0x8fb3b84cb1fd7c94\">67 E. 11th St<\/a>.<br \/>
<strong>Website<\/strong>: <a href=\"http:\/\/bergino.com\/\" target=\"_blank\">bergino.com<\/a><\/p>\r\n<p>Bergino Baseball Clubhouse offers a unique twist to baseball accessories, producing extraordinary items perfect for the game\u2019s fanatics and gifting. If you\u2019ve ever marked a map-designed or fuzzy purple suede ball down on your wish list, this shop that generates hand-made items will have that arranged. The venue itself\u2014well known for its dope artwork and decorative fixtures like the Babe Ruth photo made of Legos and even a color-coded wall with baseballs neatly resting in steel baskets. No matter the desire to throw events at the place or just browsing, this is definitely a landmark to bring those who are seriously devoted to having some exclusive baseball collectables hanging around the house.\u2014<a href=\"https:\/\/twitter.com\/cedrich__\" target=\"_blank\">Cedric Hall&nbsp;<\/a><\/p>",



<p>
  <strong>Neighborhood<\/strong>: Hell&#39;s Kitchen<br \/>\r\n
  <strong>Address<\/strong>: <a target=\"_blank\" href=\"https:\/\/www.google.com\/maps\/preview?ie=UTF-8&amp;fb=1&amp;gl=us&amp;cid=2055560682077443517&amp;q=Gotham+West+Market&amp;ei=dx_IU-OePNLfsASlooKoBg&amp;ved=0CIwBEPwSMAo\">
  600 11th Ave.<\/a><br \/>\r\n
  <strong>Website<\/strong>:\u00a0<a target=\"_blank\" href=\"http:\/\/gothamwestmarket.com\/\">gothamwestmarket.com<\/a>\u00a0
<\/p>\r\n\r\n

  <p>
    There are days you want to eat something, and others where you want to eat <em>everything<\/em>. On the latter, you&#39;d be well-advised to head to Gotham West Market. The multi-vendor gastro wonderland is an indecisive eater&#39;s dream. Unlike similar concepts like Chelsea Market, Gotham West has only eight carefully-chosen vendors, each of which occupies a small slice of the sleek space. Sit at Cannibal&#39;s counter and take down a pig&#39;s head cuban sandwich at Cannibal, or\u00a0<a target=\"_blank\" href=\"http:\/\/www.complex.com\/city-guide\/2014\/03\/the-best-ramen-in-nyc\/ivan-ramen-slurp-shop\">slurp a bowl of Ivan&#39;s savory rye noodles.\u00a0<\/a>\u00a0Stop by\u00a0Genuine Roadside for a burger and a side of &#39;70s nostalgia, or wash down tapas with Rioja at chef Seamus Mullen&#39;s tapas bar. Sure, it&#39;s avenues away from a subway, but with a Blue Bottle and a bike store on premise, Gotham West&#39;s many diversions can easily consume an entire afternoon. Or, have you consuming for an entire afternoon. Both are strong options. \u2014 <a target=\"_blank\" href=\"https:\/\/twitter.com\/ShanteCosme\">Shant&eacute; Cosme<\/a><br \/>\r\n\u00a0
  <\/p>\r\n",

"
<p>
    <strong>Neighborhood<\/strong>: Chinatown <br \/>

    <strong>Address<\/strong>: <a href=\"https:\/\/www.google.com\/maps\/place\/Bassanova+Ramen\/@40.716406,-73.997751,17z\/data=!3m1!4b1!4m2!3m1!1s0x0:0xe4b3ef4ca51637b6\">
        76 Mott St<\/a>.<br \/>

    <strong>Website<\/strong>:
        <a href=\"http:\/\/bassanovanyc.com\/\" target=\"_blank\">bassanovanyc.com<\/a>&nbsp;
<\/p>\r\n


<p>Outside of Japan, New York is just about the best city for ramen in the world. You have Ippudo, Momofuku, Ivan, Chuko, Totto, and that's just off the top of my head. Still, Bassanova Ramen stands out when it comes to wild flavors and radical experimentation. Founded by&nbsp;Japanese-American Chef Keizo Shimamoto who learned his craft at the original Bassanova&nbsp;in Japan, the recipes include ingredients like Thai curry and truffle oil added to the rich <em>dashi<\/em>. The Tondaku Green Curry Ramen, in particular, is one of the best bowls&nbsp;I've had in recent memory. Slurrrrp. \u2014 <a href=\"http:\/\/twitter.com\/nathanreese\">Nathan Reese&nbsp;<\/a><br \/><br \/>

<\/p>

",

*/