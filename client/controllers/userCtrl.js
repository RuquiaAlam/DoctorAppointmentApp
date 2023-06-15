const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const eventModel =require("../models/eventModel");
const moment = require("moment");

// register call back
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "User Added", success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        success: false,
        message: `Register Controller ${error.message}`,
      });
  }
};
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "invalid Email/Password", success: false });
    }

    // if we have valid email and password CREATE TOKEN
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Successful", success: true, token });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ success: false, message: `Error in login ctrl ${err.message}` });
  }
};

const authController = async (req, res) => {
  try {
    //we have to get user from user ,model
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res
        .status(200)
        .send({ message: "User not found", success: false });
    } else {
      res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "auth error", success: false, error });
  }
};

// APpply DOctor CTRL
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notifcation = adminUser.notifcation;
    notifcation.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied For A Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/docotrs",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notifcation });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied SUccessfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error WHile Applying For Doctotr",
    });
  }
};


//notification ctrl
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notifcation = user.notifcation;
    seennotification.push(...notifcation);
    user.notifcation = [];
    user.seennotification = notifcation;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};
// delete notifications
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notifcation = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "unable to delete all notifications",
      error,
    });
  }
};
const getAllDoctorsController = async  (req,res)  =>
{
try{
  const doctors = await doctorModel.find({status:'approved'})
  res.status(200).send({
    success:true,
    message:"Doctors list fetched successfully",
    data:doctors,

  });

}
catch(error)
{
  console.log(error);
  res.status(500).send({
    success:false,
    error,
    message:"Error while getting doctors"
  })
}
}
//Book event 
const eventController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newEvent = new eventModel(req.body);
    
    await newEvent.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notifcation.push({
      type: "New-event-request",
      message: `A new event Request from ${req.body.userInfo.name}`,
      onCLickPath: "/user/events",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Book successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While booking an event",
    });
  }
};
//booking bookingAvailabilityController
const bookingAvailabilityController = async(req,res)=>
{
  try{

    const date = moment(req.body.date,"DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time,"HH:mm").subtract(1 ,"hours").toISOString();
    const toTime = moment(req.body.time,"HH:mm").add(1 ,"hours").toISOString();
    const doctorId  = req.body.doctorId
    const events = await eventModel.find({doctorId,date,
      time :{
        $gte:fromTime ,
        $lte:toTime,
         //compare greaterthan and lessthan

      },})
      if(events.length >0)
        {
res.status(200).send({
  message:"Appointment not available at this time",
  success:true
})
        }
else
{
  return res.status(200).send({
    success:true,
    message: "Appointment available"
  })
}
        }

  
  catch(error)
  {
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:"Error while booking an event"
    })
  }

}

//user events controller
const userEventsController= async( req,res)=>
{
try{
  const events = await  eventModel.find( {userId:req.body.userId})
  res.status(200).send({
    success:true,
    message:'Users events fetched successfully',
    data: events 
  })
}
catch(error)
{

  console.log(error)
  res.status(500).send( {

    success:false,
    error,
    message:"error in user events"

  })
   
}

}
module.exports = {
  registerController,
  loginController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,eventController,
  bookingAvailabilityController,userEventsController
};
