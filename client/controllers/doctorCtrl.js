const doctorModel =require("../models/doctorModel");
const eventModel = require("../models/eventModel");
const userModel = require("../models/userModels");

// update doc profile
const updateProfileController = async (req, res) => {
    try {
      const doctor = await doctorModel.findOneAndUpdate(
        { userId: req.body.userId },
        req.body
      );
      res.status(201).send({
        success: true,
        message: "Doctor Profile Updated",
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Doctor Profile Update issue",
        error,
      });
    }
  };
const getDoctorInfoController = async (req,res)=>
{
    try{
const doctor = await doctorModel.findOne({userId:req.body.userId})
res.status(200).send({
    success:true,
    message:"doctor data fetch success",
    data: doctor,

});
    }
    catch(error)
    {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in Fetching Doctor details"
        })
    }
      
}
const getDoctorByIdController = async(req,res)=>
{
    try{

        const doctor =await doctorModel.findOne({_id:req.body.doctorId})
        res.status(200).send({
            success:true,
            message:"Single Doc Info fetched successfully",
            data:doctor,
        })
    }
    catch(error){

        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in Single doctor info"
        })
    }

  
}

const doctorAppointmentsController= async(req,res)=>
{
try{
const doctor= await doctorModel.findOne({userId:req.body.userId}); 
  const appointments =await eventModel.find({
    doctorId:doctor._id})
    res.status(200).send({
      success:true,
      message:'Doctor Appointments fetched successfully',
      data:appointments 
    })

}
catch(error)
{
  console.log(error)
  res.status(500).send({
    success:false,
    error,
    message:"Error in Doc Apppointments"
  })
}


}

const updateStatusController= async( req,res)=>
{

  try{

const {appointmentsId,status}  = req.body 
const appointments =await   eventModel.findByIdAndUpdate(appointmentsId,{status}) 
const user = await userModel.findOne({ _id: appointments.userId});

const notifcation = user.notifcation;
    notifcation.push({
      type: "Status-updated",
      message: `Your Appointment is updated  ${status}`,
      onCLickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(500).send({
      success:true,
      message:"Appointments Status updated"
    })
  }
  catch(error)
  {

    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:"Error in Update status"
    })
  }



}
module.exports = {getDoctorInfoController,updateProfileController,getDoctorByIdController,doctorAppointmentsController,updateStatusController} 