const Courses = require('../../models/courses')
const FileValidation = require('../../helpers/FileValidation')
const S3BucketUploads = require('../../helpers/S3BucketUploads')
const AWS = require('aws-sdk')

const {
    addCourseValidation,
} = require("../../validations/course/courseValidation");

let s3bucket = new AWS.S3({
    accessKeyId: process.env.IAM_ACCESS_KEY,
    secretAccessKey: process.env.IAM_SECRET_KEY,
    Bucket: process.env.AWS_USER_BUCKET
});

module.exports = {
    addCourse: async (req, res) => {
        try {
            console.log('ahaii', req.files)
            // body validation
            const dataValidation = await addCourseValidation(req.body);
            if (dataValidation.error) {
                const message = dataValidation.error.details[0].message.replace(/"/g, "");
                return res.json({
                    error: true,
                    message: message,
                });
            }

            // checking for files
            if (!req.files) {
                return res.json({
                    error: true,
                    message: 'Please add a thumbnail',
                });
            }

            // thumbnail validation
            if (req.files.thumbnail) {
                let notImage = FileValidation.checkImageType(req.files.thumbnail)
                console.log(notImage)
                if (notImage) {
                    return res.json({
                        error: true,
                        message: 'Oops, thumbnail is not an image'
                    })
                }
            } else {
                return res.json({
                    error: true,
                    message: 'Please add a thumbnail',
                });
            }

            // demoVideo validation
            if (req.files.demoVideo) {
                let notVideo = FileValidation.checkVideoType(req.files.demoVideo)
                console.log(notVideo)
                if (notVideo) {
                    return res.json({
                        error: true,
                        message: 'Oops, please add a proper demo video'
                    })
                }
            } else {
                return res.json({
                    error: true,
                    message: 'Please add a demo video',
                });
            }

            // Existing name validation
            let existingCourse = await Courses.findOne({courseName: req.body.name})
            if (existingCourse) {
                return res.json({
                    error: true,
                    message: 'Course name already exists',
                });
            }

            // calculating discounts
            if (req.body.discountPrice >= req.body.actualPrice) {
                return res.json({
                    error: true,
                    message: 'Discount price should be less than actual price',
                });
            }
            let discountAmount = req.body.actualPrice - req.body.discountPrice
            let discountPercentage = Math.round((discountAmount / req.body.actualPrice) * 100)

            // Image uploading to s3
            let thumbnailImage;
            let imagename = Date.now()
            s3bucket.createBucket(function () {
                var params = {
                    Bucket: process.env.AWS_USER_BUCKET,
                    Key: '' + imagename + '.jpg',
                    Body: req.files.thumbnail.data
                };
                s3bucket.upload(params, function (err, data) {
                    if (err) {
                        console.log('error in callback');
                        console.log(err);

                        return res.json({
                            error: true,
                            message: 'Image Upload Failed!!'
                        })

                    } else {
                        console.log('<<===S3 IMG UPLOAD SUCCESS===>>');
                        console.log(data);

                        thumbnailImage = data.Key

                        // Video uploading to s3
                        let videoname = Date.now()
                        s3bucket.createBucket(function () {
                            var params = {
                                Bucket: process.env.AWS_USER_BUCKET,
                                Key: '' + videoname + '.mp4',
                                Body: req.files.demoVideo.data
                            };
                            s3bucket.upload(params, async function (err, data) {
                                if (err) {
                                    console.log('error in callback');
                                    console.log(err);

                                    return res.json({
                                        error: true,
                                        message: 'Video Upload Failed!!'
                                    })

                                } else {
                                    console.log('<<===S3 VID UPLOAD SUCCESS===>>');
                                    console.log(data);

                                    // db object
                                    let courseObj = Courses({
                                        courseName: req.body.name,
                                        author: req.body.author,
                                        duration: req.body.duration,
                                        courseDescription: req.body.author,
                                        courseDescription2: req.body.description2,
                                        courseCategory: req.body.category,
                                        actualPrice: req.body.actualPrice,
                                        discountPrice: req.body.discountPrice,
                                        thumbnailImage: thumbnailImage,
                                        demoVideo: data.Key,
                                        discountPercentage: discountPercentage,
                                        metaData: req.body.metaData
                                    })

                                    let saveCourse = await courseObj.save()

                                    return res.json({
                                        error: false,
                                        message: "Course added successfully",
                                        data: saveCourse
                                    });
                                }
                            });
                        });
                    }
                });
            });

        } catch (error) {
            res.json({
                error: true,
                message: "something went wrong",
                error_stack: error + ''
            });
        }
    }
}