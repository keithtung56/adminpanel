import 'package:flutter/material.dart';

const kPrimaryColor = Color(0xFFFF7643);
const kPrimaryLightColor = Color(0xFFFFECDF);
const kPrimaryGradientColor = LinearGradient(
  begin: Alignment.topLeft,
  end: Alignment.bottomRight,
  colors: [Color(0xFFFFA53E), Color(0xFFFF7643)],
);
const kSecondaryColor = Color(0xFF979797);
const kTextColor = Colors.black;

const kAnimationDuration = Duration(milliseconds: 200);

const headingStyle = TextStyle(
  fontSize: 24,
  fontWeight: FontWeight.bold,
  color: Colors.black,
  height: 1.5,
);

const defaultDuration = Duration(milliseconds: 250);

// Form Error
final RegExp emailValidatorRegExp =
    RegExp(r"^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
const String emptyEmailError = "Please Enter your email";
const String invalidEmailError = "Please Enter Valid Email";
const String emptyPasswordError = "Please Enter your password";
const String tooShortPasswordError = "Password is too short";
const String notMatchPasswordError = "Passwords don't match";
const String emptyUsernameError = "Please Enter your username";
const String emptyAgeError = "Please Enter your age";
// Payment Form Error
const String emptyNameError = "Please Enter your name";
const String emptyPhoneError = "Please Enter phone";
const String emptyCityError = "Please Enter city";
const String emptyCountryError = "Please Enter country";
const String emptyAddressLine1 = "Please Enter Address1";
const String emptyAddressLine2 = "Please Enter Address2";
const String emptyPostalCode = "Please Enter postal code";
const String emptyState = "Please Enter state";

final otpInputDecoration = InputDecoration(
  contentPadding: const EdgeInsets.symmetric(vertical: 16),
  border: outlineInputBorder(),
  focusedBorder: outlineInputBorder(),
  enabledBorder: outlineInputBorder(),
);

OutlineInputBorder outlineInputBorder() {
  return OutlineInputBorder(
    borderRadius: BorderRadius.circular(16),
    borderSide: const BorderSide(color: kTextColor),
  );
}

const dateDBFormat = "MMMM Do YYYY, h:mm:ss a";
const dateDisplayFormat = "YYYY-MM-DD h:mm:ss";

const List<String> genderOptions = ['male', 'female'];
const String genderDefaultOptions = 'male';
