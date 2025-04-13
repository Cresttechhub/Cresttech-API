export enum ErrorMessages {
  // User Error Messages
  USER_EMAIL_EXISTS_ERROR = 'User Email Exists Already',
  USERNAME_EXISTS_ERROR = 'Username exists Already',
  USER_NOT_FOUND = 'User Not Found',
  INCORRECT_OLD_PASSWORD = 'Incorrect Old Password',
  CANT_UPDATE_USER_EMAIL = 'User Email can not be Updated',
  UPDATE_ERROR = 'Error Occured while Updating User',
  DELETE_CLIENT_ERROR = 'Failed to delete client',
  DATABASE_DUPLICATE_KEY = 'A duplicate key violation occurred.',

  //Admin Error Messages
  ADMIN_EXISTS_ERROR = 'Super Admin Exists Already',
  PASSWORD_MISMATCH = 'Passwords do not match',

  // AUth Errors Messages
  INVALID_LOGIN_DETAILS_ERROR = 'Invalid Email or Password',
  AUTH_TOKEN_REQUIRED_ERROR = 'Authorization token is required',
  INVALID_USER_REQUIRED_ERROR = 'User Not Authorized',
  INVALID_AUTH_TOKEN_ERROR = 'Invalid Authorization token',
  INVALID_OTP = 'Activation Failed! The Email or OTP you entered is incorrect. Please try again.',
  INVALID_CREDENTIALS = 'Invalid Credentials!',
  PASSWORD_RESET_FAILED = 'Unable to process password reset request',
  RESET_TOKEN_ERROR = 'Invalid or Expired Token',

  //Validation
  PERMISSION_NOT_GRANTED_ERROR = 'Permission Not Granted',

  // Database
  DATABASE_ERROR = 'An unexpected database error occurred',
}

export enum DatabaseErrorNumber {
  DUPLICATE_KEY = '23505',
}
