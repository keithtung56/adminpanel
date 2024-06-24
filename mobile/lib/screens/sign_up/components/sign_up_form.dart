import 'package:flutter/material.dart';
import 'package:shop_app/screens/home/home_screen.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/crud/user/db_user_service.dart';
import '../../../components/custom_surfix_icon.dart';
import '../../../components/form_error.dart';
import '../../../constants.dart';

class SignUpForm extends StatefulWidget {
  const SignUpForm({super.key});

  @override
  State<SignUpForm> createState() => _SignUpFormState();
}

class _SignUpFormState extends State<SignUpForm> {
  final _formKey = GlobalKey<FormState>();
  String email = "";
  String password = "";
  String confirmPassword = "";
  int age = 0;
  String username = "";
  String gender = genderDefaultOptions;
  bool remember = false;
  final List<String?> errors = [];
  void addError({String? error}) {
    if (!errors.contains(error)) {
      setState(() {
        errors.add(error);
      });
    }
  }

  void removeError({String? error}) {
    if (errors.contains(error)) {
      setState(() {
        errors.remove(error);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            keyboardType: TextInputType.emailAddress,
            onSaved: (newValue) => email = newValue ?? "",
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(error: emptyEmailError);
              } else if (emailValidatorRegExp.hasMatch(value)) {
                removeError(error: invalidEmailError);
              }
              return;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(error: emptyEmailError);
                return "";
              } else if (!emailValidatorRegExp.hasMatch(value)) {
                addError(error: invalidEmailError);
                return "";
              }
              return null;
            },
            decoration: const InputDecoration(
              labelText: "Email",
              hintText: "Enter your email",
              floatingLabelBehavior: FloatingLabelBehavior.always,
              suffixIcon: CustomSurffixIcon(svgIcon: "assets/icons/Mail.svg"),
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            obscureText: true,
            onSaved: (newValue) => password = newValue ?? "",
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(error: emptyPasswordError);
              } else if (value.length >= 8) {
                removeError(error: tooShortPasswordError);
              }
              password = value;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(error: emptyPasswordError);
                return "";
              } else if (value.length < 8) {
                addError(error: tooShortPasswordError);
                return "";
              }
              return null;
            },
            decoration: const InputDecoration(
              labelText: "Password",
              hintText: "Enter your password",
              floatingLabelBehavior: FloatingLabelBehavior.always,
              suffixIcon: CustomSurffixIcon(svgIcon: "assets/icons/Lock.svg"),
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            obscureText: true,
            onSaved: (newValue) => confirmPassword = newValue ?? "",
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(error: emptyPasswordError);
              } else if (value.isNotEmpty && password == confirmPassword) {
                removeError(error: notMatchPasswordError);
              }
              confirmPassword = value;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(error: emptyPasswordError);
                return "";
              } else if ((password != value)) {
                addError(error: notMatchPasswordError);
                return "";
              }
              return null;
            },
            decoration: const InputDecoration(
              labelText: "Confirm Password",
              hintText: "Re-enter your password",
              floatingLabelBehavior: FloatingLabelBehavior.always,
              suffixIcon: CustomSurffixIcon(svgIcon: "assets/icons/Lock.svg"),
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            onSaved: (newValue) => username = newValue ?? "",
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(error: emptyUsernameError);
              }
              username = value;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(error: emptyUsernameError);
              }
              return null;
            },
            decoration: const InputDecoration(
              labelText: "Username",
              hintText: "Enter your username",
              floatingLabelBehavior: FloatingLabelBehavior.always,
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            keyboardType: TextInputType.number,
            onSaved: (newValue) => age = int.parse(newValue ?? ''),
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(error: emptyUsernameError);
              }
              age = int.parse(value);
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(error: emptyUsernameError);
              }
              return null;
            },
            decoration: const InputDecoration(
              labelText: "Age",
              hintText: "Enter your age",
              floatingLabelBehavior: FloatingLabelBehavior.always,
            ),
          ),
          const SizedBox(height: 20),
          DropdownButtonFormField(
            items: genderOptions.map((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(value),
              );
            }).toList(),
            onSaved: (newValue) {
              gender = newValue ?? "male";
            },
            onChanged: (value) {
              gender = value ?? "male";
            },
            decoration: const InputDecoration(
              labelText: "gender",
              hintText: "Choose your gender",
              floatingLabelBehavior: FloatingLabelBehavior.always,
            ),
          ),
          const SizedBox(height: 20),
          FormError(errors: errors),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                _formKey.currentState!.save();
                // if all are valid then go to success screen
                await AuthService.firebase()
                    .createUser(email: email, password: password);

                String uid = AuthService.firebase().currentUser!.uid;

                await DBUserService().createDBUser(
                    uid: uid,
                    email: email,
                    password: password,
                    username: username,
                    gender: gender,
                    age: age);
                if (context.mounted) {
                  Navigator.pushNamedAndRemoveUntil(
                      context, HomeScreen.routeName, (_) => true);
                }
              }
            },
            child: const Text("Continue"),
          ),
        ],
      ),
    );
  }
}
