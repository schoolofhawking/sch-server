const AWS = require('aws-sdk')

let s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_ACCESS_KEY,
    secretAccessKey: process.env.IAM_SECRET_KEY,
    Bucket: process.env.AWS_USER_BUCKET
});

module.exports = {
    imageUpload: (file,filename,destination) => {
        s3bucket.createBucket(async function () {
            var params = {
                Bucket: process.env.AWS_USER_BUCKET,
                Key: destination + filename + '.jpg',
                Body: file.data
            };
            await s3bucket.upload(params, function (err, data) {
                if (err) {
                    console.log('error in callback');
                    console.log(err);

                    let ret = {
                        success: false,
                        data: err
                    }
                    return ret

                } else {
                    console.log('<<===S3 IMG UPLOAD SUCCESS===>>');
                    console.log(data);

                    let ret = {
                        success: true,
                        hai:'ooii',
                        data: data
                    }
                    return ret

                }
            });
        });
    }
}