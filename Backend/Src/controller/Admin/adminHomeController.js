import AssignmentModel from "../../model/assignmentModel.js"
import UserModel from "../../model/userModel.js"


const getAssignments= async(req,res)=>{
    try {
        console.log('working home controller')
        const email=req.params.email
        console.log(email)
        console.log('111111111')
        const admin=await UserModel.findOne({email:email,role:'admin'})
        console.log(admin)
        console.log('111111111')

        const adminName=admin.username
        console.log(adminName)
        console.log('111111111')

        const assignments=await AssignmentModel.find({admin:adminName})
        console.log(assignments)
        console.log('111111111')

        if(assignments){
            console.log('2222222')

            return res.status(200).json({success:true,assignmentData:assignments,message:'Assignments find it'})
        }
        console.log('333333333')

        return res.status(401).json({success:false,message:'No Assignmetns'})
        
    } catch (error) {
        console.log('catching error'+ error)
        return res.status(500).json({success:false,message:'Internal Server Error'})
    }
}


const updateStatus = async (req, res) => {
    try {
      console.log('Working controller');
      const { isActive, assignmentId } = req.body;
      console.log(isActive + ' ' + assignmentId);
  
      if (isActive !== undefined && assignmentId) {
        // Perform the update operation
        const result = await AssignmentModel.updateOne(
          { _id: assignmentId },
          {
            $set: {
              status: isActive ? "accepted" : "rejected",
            },
          }
        );
  
        // Check if the update was successful
        if (result.modifiedCount > 0) {
          return res.status(200).json({ success: true, message: 'Status updated successfully' });
        } else {
          return res.status(400).json({ success: false, message: 'Assignment not found or status already updated' });
        }
      } else {
        return res.status(400).json({ success: false, message: 'Invalid data' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  


export  {getAssignments,updateStatus}