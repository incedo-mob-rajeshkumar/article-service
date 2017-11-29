import Article from './Article'
var Log = require('log');
var logger = new Log('info');

const isString = (obj => typeof obj === 'string' || obj instanceof String)

module.exports.saveArticle = (event, context, callback) => {


  logger.info("start saveArticle()");
    let site = event.queryStringParameters.site;


  logger.info("site :: > " + site);

  var article = new Article();
  var requestBody = isString(event.body) ? JSON.parse(event.body) : event.body;

  article.createArticle(site,requestBody).then(data => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(data)
      };

      callback(null, response);
    })
      .catch(err => {
        const response = {
          statusCode: 409,
          body: {
            message: 'Could not save the Article',
            stack: err
          }
        };

        callback(null, response);
      });


  };

  module.exports.getArticle = (event, context, callback) => {
    var article = new Article();

    let id = event.pathParameters.id;
    let site = event.queryStringParameters.site;

    logger.info("id :: > " + id);
    logger.info("site :: > " + site);

    article.getArticle(id, site).then(data => {
      const response = {
        "statusCode": 200,
        "body": JSON.stringify(data.Items[0])
      };

      callback(null, response);
    }).catch(err => {

      const response = {
        statusCode: 200,
        body: {
          message: 'Could not get the Article',
          stack: err
        }
      };
      logger.info(JSON.stringify(response));
      callback(null, JSON.stringify(response));

    });

  };

  module.exports.getArticleList = (event, context, callback) => {
    var article = new Article();

    
    let site = event.queryStringParameters.site;

   
    logger.info("site :: > " + site);

    article.getArticleList(site).then(data => {
      logger.info("DATA::::" + JSON.stringify(data));
      const response = {
        "statusCode": 200,
        "body": JSON.stringify(data)
      };
      
      callback(null, response);
    }).catch(err => {

      const response = {
        statusCode: 200,
        body: {
          message: 'Could not get the Article',
          stack: err
        }
      };
      
      callback(null, JSON.stringify(response));

    });

  };

module.exports.updateArticle = (event, context, callback) => {
  let id = event.pathParameters.id;
  let site = event.queryStringParameters.site;
  let body = event.body

  logger.info("id :: > " + id);
  logger.info("site :: > " + site);
  logger.info("body :: > " + body);

  var article = new Article();
  article.updateArticle(id, site, body).then(data => {
    console.log(JSON.stringify(data));

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Inside update Article',
        input: data,
      }),
    };

    callback(null, response);
  });

};

module.exports.deleteArticle = (event, context, callback) => {


  for (var attributename in event)
    logger.info(attributename + ": " + JSON.stringify(event[attributename]));

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Inside delete Article',
      input: event,
    }),
  };

  callback(null, response);


};