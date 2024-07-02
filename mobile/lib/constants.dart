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

const orange = Color(0xFFFF7643);
const black = Colors.black;
const white = Colors.white;
const grey = Color.fromRGBO(248, 248, 248, 1);
const kAnimationDuration = Duration(milliseconds: 200);

const headingStyle = TextStyle(
  fontSize: 22,
  color: Colors.black,
  height: 1.5,
);

const appBarTitleStyle = TextStyle(
  fontSize: 16,
  color: Colors.black,
);
const defaultDuration = Duration(milliseconds: 250);

// Form Error
final RegExp emailValidatorRegExp =
    RegExp(r"^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+");
final RegExp phoneValidatorRegExp = RegExp(r'^[0-9]{8}$');

final otpInputDecoration = InputDecoration(
  contentPadding: const EdgeInsets.symmetric(vertical: 16),
  border: outlineInputBorder(),
  focusedBorder: outlineInputBorder(),
  enabledBorder: outlineInputBorder(),
);

OutlineInputBorder outlineInputBorder() {
  return OutlineInputBorder(
    borderRadius: BorderRadius.circular(5),
    borderSide: const BorderSide(color: kTextColor),
  );
}

const dateDBFormat = "MMMM Do YYYY, h:mm:ss a";
const dateDisplayFormat = "YYYY-MM-DD h:mm:ss";

const List<String> genderOptions = ['male', 'female'];
const String genderDefaultOptions = 'male';
