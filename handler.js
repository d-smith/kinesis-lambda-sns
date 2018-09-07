const _ = require('lodash');
const AWS = require('aws-sdk');
const SNS = new AWS.SNS();

const topicArn = process.env.DOWNSTREAM_TOPIC_ARN;
      
console.log(`Topic arn is ${topicArn}`);

const doIt = async (event, context, callback) => {
    let records = event["Records"];
    console.log(`publish ${records.length} records`);
    records.forEach((r) => {
        let pubData = Buffer.from(r.kinesis.data, 'base64').toString()
        let params = {
            Message: pubData,
            TopicArn: topicArn
        };

        SNS.publish(params, (err, data) => {
            if(err) console.log(err, err.stack);
            else console.log(data);
        });
    });

    callback(null, 'ok');
};

const doRecord = async (event, context, callback) => {
    console.log(`doRecord called with event ${JSON.stringify(event)}`);
    callback(null, 'ok');
};

module.exports = {
    doRecord,
    doIt
};