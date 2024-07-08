import * as yup from 'yup';

// Login validation
const LoginValidation = yup.object().shape({
  email: yup.string().email().required('Vui lòng nhập đại chỉ email').trim(),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(20, 'Mật khẩu không được quá 20 ký tự')
    .matches(/(?=.*[0-9])/, 'Mật khẩu phải chứa ít nhất một số')
});

// Register validation
const RegisterValidation = yup.object().shape({
  email: yup.string().email().required('Vui lòng nhập đại chỉ email').trim(),
  password: yup
    .string()
    .required('Vui lòng nhập mật khẩu')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(20, 'Mật khẩu không được quá 20 ký tự')
    .matches(/(?=.*[0-9])/, 'Mật khẩu phải chứa ít nhất một số'),
  firstName: yup
    .string()
    .required('Vui lòng nhập tên của bạn')
    .max(20, 'Tên của bạn không được quá 20 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'Tên chỉ được chứa các ký tự chữ cái'),
  lastName: yup
    .string()
    .required('Vui lòng nhập họ của bạn')
    .max(20, 'Họ của bạn không được quá 20 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'Họ chỉ được chứa các ký tự chữ cái')
});

const PasswordValidation = yup.object().shape({
  oldPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu cũ')
    .min(6, 'Mật khẩu cũ phải có ít nhất 6 ký tự')
    .max(20, 'Mật khẩu cũ không được quá 20 ký tự')
    .matches(/(?=.*[0-9])/, 'Mật khẩu cũ phải chứa ít nhất một số'),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(20, 'Mật khẩu mới không được quá 20 ký tự')
    .matches(/(?=.*[0-9])/, 'Mật khẩu mới phải chứa ít nhất một số'),
  confirmPassword: yup
    .string()
    .required('Vui lòng nhập xác nhận mật khẩu')
    .min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự')
    .max(20, 'Xác nhận mật khẩu không được quá 20 ký tự')
    .matches(/(?=.*[0-9])/, 'Xác nhận mật khẩu phải chứa ít nhất một số')
    .oneOf([yup.ref('newPassword')], 'Xác nhận mật khẩu phải trùng khớp với mật khẩu mới')
});

const ProfileValidation = yup.object().shape({
  firstName: yup
    .string()
    .required('Vui lòng nhập tên của bạn')
    .max(20, 'Tên của bạn không được quá 20 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'Tên chỉ được chứa các ký tự chữ cái'),
  lastName: yup
    .string()
    .required('Vui lòng nhập họ của bạn')
    .max(20, 'Họ của bạn không được quá 20 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'Họ chỉ được chứa các ký tự chữ cái'),
  email: yup.string().email().required('Vui lòng nhập đại chỉ email').trim(),
  address: yup.string().email().required('Vui lòng nhập đại chỉ').trim(),
  phone: yup
    .string()
    .trim()
    .matches(/^[0-9]*$/, 'Only contain numbers')
    .matches(/^$|^[0-9]{10,11}$/, 'Phone number must be 10 to 11 digits'),

});

const ForgotPasswordValidation = yup.object().shape({
  email: yup.string().email().required('Vui lòng nhập đại chỉ email')
});

const ResetPasswordValidation = yup.object().shape({
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .max(20, 'Mật khẩu mới không được quá 20 ký tự')
    .matches(/(?=.*[0-9])/, 'Mật khẩu mới phải chứa ít nhất một số'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu')
    .min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự')
    .max(20, 'Xác nhận mật khẩu không được quá 20 ký tự')
    .matches(/(?=.*[0-9])/, 'Xác nhận mật khẩu phải chứa ít nhất một số')
    .oneOf([yup.ref('newPassword')], 'Xác nhận mật khẩu phải trùng khớp với mật khẩu mới')
});

// admin edit user info validation
const EditUserInfoValidation = yup.object().shape({
  email: yup.string().email().required('Vui lòng nhập đại chỉ email').trim(),
  firstName: yup
    .string()
    .required('Vui lòng nhập tên của bạn')
    .max(20, 'Tên của bạn không được quá 20 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'Tên chỉ được chứa các ký tự chữ cái'),
  lastName: yup
    .string()
    .required('Vui lòng nhập họ của bạn')
    .max(20, 'Họ của bạn không được quá 20 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ ]*$/, 'Họ chỉ được chứa các ký tự chữ cái'),
  phoneNumber: yup
    .string()
    .trim()
    .required('Vui lòng nhập họ của bạn')
    .matches(/^[0-9]*$/, 'Số điện thoại chỉ được chứa các số')
    .matches(/^$|^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  warehouseName: yup
    .string()
    .trim()
    .required('Please select an warehouse work'),
});

const CreateWarehouseValidation = yup.object().shape({
  warehousename: yup
    .string()
    .required('Warehouse name is required')
    .max(20, 'Warehouse name must be less than 20 characters'),

    address: yup
    .string()
    .required('Address is required'),

    avatar: yup
    .string()
    .required('Avatar is required'),

    phonenumber: yup
    .string()
    .trim()
    .required('Phone number is required')
    .matches(/^[0-9]*$/, 'Only contain numbers')
    .matches(/^$|^[0-9]{10,11}$/, 'Phone number must be 10 to 11 digits'),

});


const EditWarehouseInfoValidation = yup.object().shape({
  warehouseid: yup
    .string(),

  warehousename: yup
    .string()
    .max(20, 'Warehouse name must be less than 20 characters'),

    phonenumber: yup
    .string()
    .matches(/^[0-9]*$/, 'Only contain numbers')
    .matches(/^$|^[0-9]{10,11}$/, 'Phone number must be 10 to 11 digits'),

    address: yup
    .string(),

    avatar: yup
    .string()
});


export {
  LoginValidation,
  RegisterValidation,
  PasswordValidation,
  ProfileValidation,
  ForgotPasswordValidation,
  ResetPasswordValidation,
  EditUserInfoValidation,
  CreateWarehouseValidation,
  EditWarehouseInfoValidation
};
