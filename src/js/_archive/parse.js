// Count all of the links from the io.js build page
var jsdom = require("node-jsdom");
var fs = require("fs");
var source = fs.readFileSync("./nyc-best-50-places.html", "utf-8");

jsdom.env(
    source,
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
        var num = 0;
        var baseImgUrl = 'http://images.complex.com/complex/image/upload/t_article_image/';
        var data = window.$("script")[13].innerHTML;
        eval(data);
        if (p_dslArticleData.slides.length != 50) {
            throw new Error("ERROR; please check source file");
        }
        [p_dslArticleData.slides[2]].forEach(function (s)  {
            console.log(s.ordinal + " - " + s.headline + " - " + s.preview.cloudinaryId + "." + s.preview.format);
            content_html = window.$.parseHTML(s.content), nodeNames = [];
            console.log(content_html);


        });
    }
);


/*
"content":

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