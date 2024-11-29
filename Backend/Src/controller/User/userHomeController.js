import UserModel from "../../model/userModel.js";
import AssignmentModel from "../../model/assignmentModel.js";


const submitAssignment = async (req, res) => {
  try {
    const { admin, email } = req.body;
    const task = req.file?.path; 
    console.log('task'+ task)

    if (!task || !admin || !email) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    console.log(111)

    // Check if the admin exists and has the correct role
    const existAdmin = await UserModel.findOne({ username: admin, role: 'admin' });

    if (!existAdmin) {
      console.log(22)
      console.error(`Admin with username: ${admin} not found.`);
      return res.status(401).json({ success: false, message: "Incorrect admin details." });
    }
    console.log(3)
    // Check if the student exists
    const student = await UserModel.findOne({ email: email });
         
    if (!student) {
      console.log(4)
      console.error(`Student with email: ${email} not found.`);
      return res.status(404).json({ success: false, message: "Student not found." });
    }
  console.log(5)
    // Check for duplicate assignment submission
    const existingAssignment = await AssignmentModel.findOne({
      userId: student.username,
      task: task,
    });

    if (existingAssignment) {
      console.log(6)
      console.error(`Duplicate assignment submission by student: ${student.username}`);
      return res.status(409).json({ success: false, message: "Assignment for this task already submitted." });
    }
   console.log(7)
    // Create a new assignment record
    const assignment = await AssignmentModel.create({
      userId: student.username,
      task: task, // Store file path in the database
      admin: admin,
    });

    if (assignment) {
      console.log(8)
      console.log(`Assignment successfully submitted by student: ${email}`);
      return res.status(200).json({ success: true, message: 'Assignment submitted successfully.' });
    }
    console.log(9)

    return res.status(409).json({ success: false, message: 'Assignment submission failed.' });

  } catch (error) {
    console.log(10)
    console.error('Error during assignment submission:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
};

  

export { submitAssignment };
