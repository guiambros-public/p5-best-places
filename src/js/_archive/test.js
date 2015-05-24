// Count all of the links from the io.js build page
var jsdom = require("node-jsdom");
var fs = require("fs");
var source = fs.readFileSync("./nyc-best-50-places.html", "utf-8");

jsdom.env(
    source,
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
        var num = 0;
        // for (var i in window.$("script")) {
        //     num += 1;
        //     console.log("script [" + num + "] has length [" + i.length, "].");
        // }

        console.log("----");
        data = window.$("script")[13].innerHTML;
        //eval(data);
        console.log(data);
        console.log(p_dslArticleData);

    }
);
