import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: 5 * 1024 * 1024,// 5 mb
        files:25
    }
})

export default upload 
