import express from 'express'
import upload from '../../Utils/multer.js';
import * as userAuthController from '../controller/User/userAuthController.js';
import * as userHomeController from '../controller/User/userHomeController.js'

const router = express.Router()


router.post('/register',userAuthController.register)

router.post('/google-register',userAuthController.googleRegister)

router.post('/login',userAuthController.login)

router.post('/google-login',userAuthController.googleLogin)

router.post('/assignments',upload.single('file'),userHomeController.submitAssignment)



export default router