const path = require('path');

module.exports = {
    checkImageType: (file) => {
        console.log('fillle:',file)
        const filetypes = /jpg|jpeg|png/ // Choose Types you want...
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = filetypes.test(file.mimetype)
    
        if (extname && mimetype) {
            return false
        } else {
            let error = 'Files other than jpg, jpeg and png are not allowed!' // custom this message to fit your needs
            return error
        }
    }
}