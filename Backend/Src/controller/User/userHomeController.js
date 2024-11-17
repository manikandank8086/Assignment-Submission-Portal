import UserModel from "../../model/userModel.js";
import AssignmentModel from "../../model/assignmentModel.js";


const submitAssignment = async (req, res) => {
    try {
      const { task, admin, email } = req.body;
  
      if (!task || !admin || !email) {
        return res.status(400).json({ success: false, message: "Missing required fields." });
      }
  
      const existAdmin = await UserModel.findOne({ username: admin, role: 'admin' });
  
      if (!existAdmin) {
        console.error(`Admin with username: ${admin} not found.`);
        return res.status(401).json({ success: false, message: "Incorrect admin details." });
      }
  
      const student = await UserModel.findOne({ email: email });
  
      if (!student) {
        console.error(`Student with email: ${email} not found.`);
        return res.status(404).json({ success: false, message: "Student not found." });
      }
  
      // Check if an assignment already exists for this user and task
      const existingAssignment = await AssignmentModel.findOne({
        userId: student.username,
        task: task,
      });
  
      if (existingAssignment) {
        console.error(`Duplicate assignment submission by student: ${student.username}`);
        return res.status(409).json({ success: false, message: "Assignment for this task already submitted." });
      }
  
      // Create a new assignment record
      const assignment = await AssignmentModel.create({
        userId: student.username,
        task: task,
        admin: admin,
      });
  
      if (assignment) {
        console.log(`Assignment successfully submitted by student: ${email}`);
        return res.status(200).json({ success: true, message: 'Assignment submitted successfully.' });
      }
  
      return res.status(409).json({ success: false, message: 'Assignment submission failed.' });
  
    } catch (error) {
      console.error('Error during assignment submission:', error.message);
      return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
    }
  };
  

export { submitAssignment };
