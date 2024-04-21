import * as yup from 'yup';

// Login validation
const LoginValidation = yup.object().shape({
  email: yup.string().email().required('Email is required').trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be less than 20 characters')
    .matches(/(?=.*[0-9])/, 'Password must contain a number')
});

// Register validation
const RegisterValidation = yup.object().shape({
  email: yup.string().email().required('Email is required').trim(),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must be less than 20 characters')
    .matches(/(?=.*[0-9])/, 'Password must contain a number'),
  firstName: yup
    .string()
    .required('First name is required')
    .max(20, 'First name must be less than 20 characters')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'First name must contain only letters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .max(20, 'Last name must be less than 20 characters')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'Last name must contain only letters')
});

const PasswordValidation = yup.object().shape({
  oldPassword: yup
    .string()
    .required('Old password is required')
    .min(6, 'Old password must be at least 6 characters')
    .max(20, 'Old password must be less than 20 characters')
    .matches(/(?=.*[0-9])/, 'Old Password must contain a number'),
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'New Password must be at least 6 characters')
    .max(20, 'New Password must be less than 20 characters')
    .matches(/(?=.*[0-9])/, 'New Password must contain a number'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .min(6, 'Confirm password must be at least 6 characters')
    .max(20, 'Confirm password must be less than 20 characters')
    .matches(/(?=.*[0-9])/, 'Confirm password must contain a number')
    .oneOf([yup.ref('newPassword')], 'Confirm password must match')
});

const ProfileValidation = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .max(20, 'First name must be less than 20 characters')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'First name must contain only letters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .max(20, 'Last name must be less than 20 characters')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'Last name must contain only letters'),
  email: yup.string().email().required('Email is required').trim(),
  phone: yup
    .string()
    .trim()
    .matches(/^[0-9]*$/, 'Only contain numbers')
    .matches(/^$|^[0-9]{10,11}$/, 'Phone number must be 10 to 11 digits'),
  userId: yup
    .string()
    .trim()
    .matches(/^[0-9]*$/, 'Only contain numbers')
  // .matches(/^$|^[0-9]{8}$/, 'Student ID must contain exactly 8 digits')
});

const ForgotPasswordValidation = yup.object().shape({
  email: yup.string().email().required('Email is required')
});

const ResetPasswordValidation = yup.object().shape({
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'New Password must be at least 6 characters')
    .max(20, 'New Password must be less than 20 characters')
    .matches(/(?=.*[0-9])/, 'New Password must contain a number'),
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .min(6, 'Confirm password must be at least 6 characters')
    .max(20, 'Confirm password must be less than 20 characters')
    .matches(/(?=.*[0-9])/, 'Confirm password must contain a number')
    .oneOf([yup.ref('newPassword')], 'Confirm password must match')
});

// admin edit user info validation
const EditUserInfoValidation = yup.object().shape({
  email: yup.string().email().required('Email is required').trim(),
  userId: yup
    .string()
    // .trim()
    .matches(/^[0-9]*$/, 'Only contain numbers'),
  // .matches(/^$|^[0-9]{8}$/, 'Student ID must contain exactly 8 digits'),

  firstName: yup
    .string()
    .required('First name is required')
    .max(20, 'First name must be less than 20 characters')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'First name must contain only letters'),
  lastName: yup
    .string()
    .required('Last name is required')
    .max(20, 'Last name must be less than 20 characters')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'Last name must contain only letters')
});

export {
  LoginValidation,
  RegisterValidation,
  PasswordValidation,
  ProfileValidation,
  ForgotPasswordValidation,
  ResetPasswordValidation,
  EditUserInfoValidation
};
