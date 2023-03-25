import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import { registerValidation, loginValidation, postCreateValidation } from './validations.js'
import { checkAuth, handleValidationErrors } from './utils/index.js'
import { UserController, PostController } from './controllers/index.js'


const app = express()

// -----  Storage  -------

const storage = multer.diskStorage({
    destination: (_,__,cb) => {
        cb(null, 'uploads')
    },
    filename: (_,file,cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage})

//-----  Conect MangoDB database -----
mongoose.connect(process.env.MONGO_CONNECT_LINK)
    .then(()=>{console.log('DB ok')})
    .catch((err)=>{console.log('DB Error', err)})


// ----- Express uses ------
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))



// -----  API's  --------

app.post('/auth/login', handleValidationErrors, UserController.login)
app.post('/auth/register', handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)
app.get('/users/:id', UserController.getUserById)

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, PostController.update)

app.patch('/posts/comment/:id', checkAuth, PostController.addComment)

app.get('/tags', PostController.getLastTags)
app.get('/posts/tags', PostController.getLastTags);

app.post('/uploads',checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url : `/uploads/${req.file.originalname}`,
    })
})

// ------- Start Server -------

app.listen(process.env.PORT, (err)=>{
    if(err) return console.log(err)

    console.log('Server Ok')
})