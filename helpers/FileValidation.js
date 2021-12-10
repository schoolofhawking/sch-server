const path = require('path');

module.exports = {
    checkImageType: (file) => {
        const filetypes = /jpg|jpeg|png/ // Choose Types you want...
        const extname = filetypes.test(path.extname(file.name).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)
        if (extname && mimetype) {
            return false
        } else {
            let error = 'Files other than jpg, jpeg and png are not allowed!' // custom this message to fit your needs
            return error
        }
    },
    checkVideoType: (file) => {
        const filetypes = /mp4|avi|mkv|mov|3gp/ // Choose Types you want...
        const extname = filetypes.test(path.extname(file.name).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)
        if (extname && mimetype) {
            return false
        } else {
            let error = 'Files other than mp4, mkv, mov and 3gp are not allowed!' // custom this message to fit your needs
            return error
        }
    }
}