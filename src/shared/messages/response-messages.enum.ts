export enum ResponseMessages {
  // Users
  CREATE_USER = 'Account Created Successfully! Please check your email to activate your account.',
  UPDATE_USER = 'Profile Updated Successfully',
  DELETE_USER = 'User Deactivated Successfully',
  PROFILE_DATA = 'Profile data retrieved successfully!',
  USERS_DATA = 'Client Fecthed Successfully',
  //Admin
  CREATE_ADMIN = 'Admin Created Successful',

  // OTP
  OTP_RESENT = 'OTP Resent Successfully! Please check your email for the new code.',

  // AUTH
  LOGIN_SUCCESS = 'Login successful! Welcome back.',
  REFRESH_TOKEN = 'Token Refreshed Successfully! You are now Re-Authenticated.',
  FORGOT_PASSWORD = 'Password Reset link sent Successfully! Please check your email',
  PASSWORD_RESET_SUCCESS = 'Password Reset Successful!, Kindly Login',
}
