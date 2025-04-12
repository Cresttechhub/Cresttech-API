export enum ResponseMessages {
  // Users
  CREATE_USER = 'Account Created Successfully! Please check your email to activate your account.',
  UPDATE_USER = 'Profile Updated Successfully',
  DELETE_USER = 'User Deactivated Successfully',
  PROFILE_DATA = 'Profile data retrieved successfully!',
  USERS_DATA = 'Client Fecthed Successfully',
  USER_COURSE_FETCHED = 'Courses Fetched Successfully',
  //Admin
  CREATE_ADMIN = 'Admin Created Successful',

  // OTP
  OTP_RESENT = 'OTP Resent Successfully! Please check your email for the new code.',

  // AUTH
  LOGIN_SUCCESS = 'Login successful! Welcome back.',
  REFRESH_TOKEN = 'Token Refreshed Successfully! You are now Re-Authenticated.',
  FORGOT_PASSWORD = 'Password Reset link sent Successfully! Please check your email',
  PASSWORD_RESET_SUCCESS = 'Password Reset Successful!, Kindly Login',

  // Courses
  CREATE_COURSE = 'Course Created Successfully',
  FIND_COURSES = 'Courses Fetched Successfully',
  FIND_COURSE = 'Course Fetched Successfully',
  UPDATE_COURSE = 'Course Updated Successfully',
  COURSE_DELETED = 'Course Deleted Successfully',
  COURSE_SELECTED = 'Course Selected Successfully',
}
