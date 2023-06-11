const fs = require("fs");
const http = require("http");
const url = require("url");
const jsonData = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(jsonData);
const overviewTemplate = fs.readFileSync(
  `${__dirname}/overview_template.html`,
  "utf-8"
);
const dishCardTemplate = fs.readFileSync(`${__dirname}/dish.html`, "utf-8");
const dishDetailsTemplate = fs.readFileSync(
  `${__dirname}/dish_details.html`,
  "utf-8"
);
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%DISHNAME%}/g, product.productName);
  output = output.replace(/{%DISHORIGIN%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ISORGANIC%}/g, product.organic);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  return output;
};

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead("200", {
      "Content-type": "text/html",
    });
    const dishCardsHTML = dataObject
      .map((el) => {
        return replaceTemplate(dishCardTemplate, el);
      })
      .join("");

    const finalOverviewHTML = overviewTemplate.replace(
      /{%ALLDISHES%}/g,
      dishCardsHTML
    );
    res.end(finalOverviewHTML);
  } else if (pathname === "/product") {
    res.writeHead("200", {
      "Content-type": "text/html",
    });
    const selectedRecipe = dataObject[query.id];
    const finalOverviewHTML = replaceTemplate(
      dishDetailsTemplate,
      selectedRecipe
    );
    res.end(finalOverviewHTML);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h2>Page not found</h2>");
  }
});
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
