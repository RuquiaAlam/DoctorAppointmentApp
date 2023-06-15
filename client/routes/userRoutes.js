const express =require('express')
const {loginController, authController, applyDoctorController,getAllNotificationController,deleteAllNotificationController, getAllDoctorsController, eventController, bookingAvailabilityController, userEventsController} = require('../controllers/userCtrl');
const {registerController} = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');
//router object
const router = express.Router();


//login method||POST

router.post('/login', loginController);
//register method||POST
router.post('/register',registerController) 
router.post("/getUserData", authMiddleware, authController);



//ApplyDoctor||post
router.post("/apply-doctor" ,authMiddleware,applyDoctorController)
module.exports= router;

//Notification||post
router.post("/get-all-notification" ,authMiddleware,getAllNotificationController)
//Notification||post
router.post("/delete-all-notification" ,authMiddleware,deleteAllNotificationController)


//Get all Docs
router.get("/getAllDoctors",authMiddleware,getAllDoctorsController)


//book event 
router.post("/book-events", authMiddleware, eventController);
module.exports= router; 
//booking availability
router.post("/booking-availability", authMiddleware,bookingAvailabilityController)

//Events List
router.get("/user-events",authMiddleware,userEventsController)