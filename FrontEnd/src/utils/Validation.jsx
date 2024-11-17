import * as Yup from "yup";

// Validation schema using Yup
export const Registervalidation = Yup.object({
  name: Yup.string()
    .required("username is required")
    .min(2, "username must be at least 2 characters")
    .matches(/^[A-Za-z\s]*$/, "username cannot contain numbers")
    .test(
      "no-whitespace",
      "username cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .test(
      "no-whitespace",
      "Email cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),

  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required")
    .test(
      "no-whitespace",
      "Phone number cannot contain only spaces",
      (value) => value && value.trim().length > 0
    )
    .test(
      "no-repeated-numbers",
      "Phone number cannot be the same repeated number",
      (value) => {
        return !/^(.)\1{9}$/.test(value);
      }
    ),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .test(
      "no-whitespace",
      "Password cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required")
    .test(
      "no-whitespace",
      "Confirm password cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),
});

export const Loginvalidation = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required")
    .test(
      "no-whitespace",
      "Email cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .test(
      "no-whitespace",
      "Password cannot contain only spaces",
      (value) => value && value.trim().length > 0
    ),
});


 
  export const SubmissionPorvatalidation = Yup.object({
  task: Yup.string()
    .required('Task is required')
    .matches(/^[A-Za-z\s]*$/, "Task cannot contain numbers")
    .min(5, 'Task must be at least 5 characters')
    .max(50, 'Task cannot be more than 100 characters'),  

  admin: Yup.string()
    .required('Admin is required')
    .matches(/^[A-Za-z\s]*$/, "admin name cannot contain numbers")
    .min(3, 'Admin name must be at least 3 characters')
    .max(20, 'Admin name cannot be more than 50 characters'), 

});
   

