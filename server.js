import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";


const app = express();
const PORT = process.env.PORT|| 3000;

fs.mkdirSync("uploads",{recursive: true})

const storage = multer.diskStorage({
    destination: (req, file, cd) =>{
        cd(null, "uploads/")
    },
    filename: (req, file, cd) =>{
       const ext = path.extname(file.originalname).toLowerCase();
       const timestamp = Date.now();
       const randomNumber = Math.round(Math.random() * 1e9);
       
       const safeName =`${timestamp}-${randomNumber}-${ext}`;
       cd(null, safeName);
    }
});

const fileFilter = (req, file, cd) => {
     const allow = new Set(["image/jpeg","image/png"]);
     if(!allow.has(file.mimetype)) {
        return cd(new Error("Only JPD/PNG allowed"),false);
     }
     cd(null, true);
};

const upload = multer({
    storage,
    limits:{
        fileSize: 1 * 1024 * 1024, //1 MB
        files: 1,
    },
    fileFilter,
});


app.get("/health", (req, res)=> res.json({status: "ok"}))

app.post("/upload", upload.single("avater"), (req, res)=>{
    res.json({
        message: "File Upload successfully",
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
    });
});

app.use((err, req, res, next) => {
     const status = 400;
     res.status(status).json({error: err.message | "Not Uploaded"});
})


app.listen(PORT,()=> console.log(`Runinning at ${PORT}`));