import express from 'express'
import * as adminAuthController from '../controller/Admin/adminAuthController.js'
import * as adminHomeControllr from '../controller/Admin/adminHomeController.js'

const router = express.Router()

router.post('/admin/register',adminAuthController.register)

router.post('/admin/login',adminAuthController.login)

router.get('/admin/dashbord/:email',adminHomeControllr.getAssignments)

router.patch('/admin/assignment',adminHomeControllr.updateStatus)


export default router