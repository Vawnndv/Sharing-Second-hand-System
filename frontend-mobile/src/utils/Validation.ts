import { ErrorMessages } from './../models/ErrorMessages';

export class Validator {
  static email(mail: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  static username(username: string) {
    const regex = /^[\p{L}\s]*$/u;
    if (regex.test(username)) {
      return true;
    } 
    return false;
  }
  
  static Password = (val: string) => {
    return val.length >= 6;
  };

  static Validation = (key: keyof ErrorMessages, errorMessage: ErrorMessages, values: ErrorMessages) => {
    let updatedErrorMessage = {...errorMessage}; // Tạo một bản sao mới của errorMessage
    let message = '';

    switch (key) {
      case 'username':
        if (!values.username) {
          message = 'Username is required!!!';
        } else if (!Validator.username(values.username)) {
          message = 'Only contain letters!!!'
        } 
        else {
          message = '';
        }
        break;
  
      case 'email':
        if (!values.email) {
          message = 'Email is required';
        } else if (!Validator.email(values.email)) {
          message = 'Email is not invalid';
        } else {
          message = '';
        }
        break;
  
      case 'password':
        if (!values.password) {
          message ='Password is required!!!';
        } else if (values.password.length < 6) {
          message = 'Password must contain at least 6 character!!!'
        } else {
          message = '';
        }
        break;
  
      case 'confirmPassword':
        if (!values.confirmPassword) {
          message = 'Please type confirm password';
        } else if (values.confirmPassword !== values.password) {
          message = 'Password is not match';
        } else {
          message = '';
        }
        break;

        case 'confirmNewPassword':
          if (!values.confirmNewPassword) {
            message = 'Please type new confirm password';
          } else if (values.confirmNewPassword !== values.newPassword) {
            message = 'New Password is not match';
          } else {
            message = '';
          }
          break;

      case 'oldPassword':
        if (!values.oldPassword) {
          message ='Old Password is required!!!';
        } else if (values.oldPassword.length < 6) {
          message = 'Old Password must contain at least 6 character!!!'
        } else {
          message = '';
        }
        break;

      case 'newPassword':
        if (!values.newPassword) {
          message ='New Password is required!!!';
        } else if (values.newPassword.length < 6) {
          message = 'New Password must contain at least 6 character!!!'
        } else {
          message = '';
        }
        break;
    }
    updatedErrorMessage[key] = message;
    return updatedErrorMessage; // Sử dụng bản sao mới của errorMessage
  };
}