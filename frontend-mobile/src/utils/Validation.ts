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
      case 'lastname':
        if (!values.lastname) {
          message = 'Vui lòng nhập tên của bạn';
        } else if (!Validator.username(values.lastname)) {
          message = 'Tên chỉ được chứa các ký tự chữ cái'
        } 
        else {
          message = '';
        }
        break;
      
      case 'firstname':
        if (!values.firstname) {
          message = 'Vui lòng nhập họ của bạn';
        } else if (!Validator.username(values.firstname)) {
          message = 'Họ chỉ được chứa các ký tự chữ cái'
        } 
        else {
          message = '';
        }
        break;
      case 'email':
        if (!values.email) {
          message = 'Vui lòng nhập địa chỉ email';
        } else if (!Validator.email(values.email)) {
          message = 'Địa chỉ email không hợp lệ';
        } else {
          message = '';
        }
        break;
  
      case 'password':
        if (!values.password) {
          message ='Vui lòng nhập mật khẩu';
        } else if (values.password.length < 6) {
          message = 'Mật khẩu phải có ít nhất 6 ký tự'
        } else {
          message = '';
        }
        break;
  
      case 'confirmPassword':
        if (!values.confirmPassword) {
          message = 'Vui lòng nhập xác nhận mật khẩu';
        } else if (values.confirmPassword !== values.password) {
          message = 'Mật khẩu nhập lại phải giống với mật khẩu';
        } else {
          message = '';
        }
        break;

        case 'confirmNewPassword':
          if (!values.confirmNewPassword) {
            message = 'Vui lòng nhập xác nhận mật khẩu mới';
          } else if (values.confirmNewPassword !== values.newPassword) {
            message = 'Mật khẩu nhập lại phải giống với mật khẩu mới';
          } else {
            message = '';
          }
          break;

      case 'oldPassword':
        if (!values.oldPassword) {
          message ='Vui lòng nhập mật khẩu cũ';
        } else if (values.oldPassword.length < 6) {
          message = 'Mật khẩu cũ phải có ít nhất 6 ký tự'
        } else {
          message = '';
        }
        break;

      case 'newPassword':
        if (!values.newPassword) {
          message ='Vui lòng nhập mật khẩu mới';
        } else if (values.newPassword.length < 6) {
          message = 'Mật khẩu mới phải có ít nhất 6 ký tự'
        } else {
          message = '';
        }
        break;
      
      case 'phonenumber':
        if (!values.phonenumber) {
          message ='Vui lòng nhập số điện thoại';
        } else if (values.phonenumber.length < 10 || values.phonenumber.length > 12) {
          message = 'Số điện thoại không hợp lệ'
        } else {
          console.log(values.phonenumber.length)
          message = '';
        }
        break;
    }
    updatedErrorMessage[key] = message;
    return updatedErrorMessage; // Sử dụng bản sao mới của errorMessage
  };
}