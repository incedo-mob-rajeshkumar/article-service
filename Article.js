var AWS = require("aws-sdk");
var Log = require('log');
var logger = new Log('info');
import dynamodb from 'serverless-dynamodb-client';
import uuid from 'uuid';
const table = process.env.STAGE.toLocaleUpperCase() + '.CONTENT.ARTICLE'

class Article {

    constructor() {
        this.db = dynamodb.doc;
    }

    createArticle(site,body) {
        logger.info("start create article");
        var id = uuid.v4();
        var params = {
           TableName:table,
           Item: Object.assign({
               "id":id,
               "site":site
               },body)
        };
        logger.info(JSON.stringify(params));
         return this.db.put(params).promise().then(data => {
            logger.info("data :: >" + JSON.stringify(data));
            data = Object.assign({ id: id }, body);
            return data;
        });

        logger.info("finished create article");

    }

    getArticle(id,site) {

        logger.info("start getArticle()");

        var params = {
            TableName: table,
            KeyConditionExpression: "#id = :idValue and site = :siteValue",
            ExpressionAttributeNames: {
                "#id": "id"
            },
            ExpressionAttributeValues: {
                ":idValue": id,
                ":siteValue": site
            }
        };

        return this.db.query(params).promise();
        logger.info("end getSeries()");
    
    }

    getArticleList(site) {
        
                logger.info("start getArticle()");
        
                var params = {
                    TableName: table,
                    Limit: 10,
                    ExclusiveStartKey: {"site":"demo-3","id":"6d439b44-0fdd-44bc-a33d-532b855d812b"}
                };
        
                return this.db.scan(params, function(err, data) {
                    if (err) console.log("SRRRR  ::::: " +JSON.stringify(err)); // an error occurred
                    else {console.log("DATTA  ::::: " + JSON.stringify(data)); // successful response
                    return data;
                }}).promise();
                logger.info("end getSeries()");
            
            }

    updateArticle(id,site,data) {

        logger.info("start updateArticle()" + JSON.stringify(data));
        var updateExp = "set ";
        var counter = 0;
        var attributename;
        var param = JSON.parse(data);

        var expAttrValues = {};
        for (attributename in param) {
            var element = param[attributename];
            updateExp = updateExp + attributename + " = :col" + counter + " ,"
            expAttrValues[":col" + counter] = element;
            counter = counter + 1;
        }

        var updateExpCommaIndex = updateExp.toString().lastIndexOf(",")
        updateExp = updateExp.slice(0, updateExpCommaIndex - 1);

        var params = {
            TableName: table,
            Key: {
                "id": id,
                "site": site
            },
            UpdateExpression: updateExp,
            ExpressionAttributeValues: expAttrValues,
            "ReturnValues": "UPDATED_NEW"
        };

        return this.db.update(params).promise();
        logger.info("end updateArticle()");
    
    }
}

module.exports = Article;