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
  address: yup.string().required('Vui lòng nhập đại chỉ').trim(),
  phone: yup
  .string()
  .trim()
  .required('Vui lòng nhập số điện thoại')
  .matches(/^[0-9]*$/, 'Chỉ chứa các ký tự số')
  .matches(/^$|^[0-9]{10,11}$/, 'Số điện thoại phải có từ 10 đến 11 chữ số'),
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
    .required('Vui lòng chọn kho làm việc'),
});

const CreateWarehouseValidation = yup.object().shape({
  warehousename: yup
    .string()
    .required('Vui lòng nhập tên kho')
    .max(20, 'Tên kho phải ít hơn 20 ký tự'),

    address: yup
    .string()
    .required('Vui lòng nhập địa chỉ kho'),

    avatar: yup
    .string()
    .required('Vui lòng chọn ảnh kho'),

    phonenumber: yup
    .string()
    .trim()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^[0-9]*$/, 'Chỉ chứa các ký tự số')
    .matches(/^$|^[0-9]{10,11}$/, 'Số điện thoại phải có từ 10 đến 11 chữ số'),
});


const EditWarehouseInfoValidation = yup.object().shape({
  warehouseid: yup
    .string(),

    warehousename: yup
    .string()
    .required('Vui lòng nhập tên kho')
    .max(20, 'Tên kho phải ít hơn 20 ký tự'),

    phonenumber: yup
    .string()
    .trim()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^[0-9]*$/, 'Chỉ chứa các ký tự số')
    .matches(/^$|^[0-9]{10,11}$/, 'Số điện thoại phải có từ 10 đến 11 chữ số'),

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
