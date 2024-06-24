import 'package:flutter/material.dart';
import 'package:shop_app/screens/init_screen.dart';
import 'package:shop_app/services/auth/auth_exceptions.dart';
import 'package:shop_app/services/auth/auth_service.dart';

import '../../../components/custom_surfix_icon.dart';
import '../../../components/form_error.dart';
import '../../../constants.dart';
import '../../../helper/keyboard.dart';
import '../../forgot_password/forgot_password_screen.dart';

class SignForm extends StatefulWidget {
  const SignForm({super.key});

  @override
  State<SignForm> createState() => _SignFormState();
}

class _SignFormState extends State<SignForm> {
  final _formKey = GlobalKey<FormState>();
  String email = '';
  String password = '';
  bool? remember = false;
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
              }
              if (emailValidatorRegExp.hasMatch(value)) {
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
              }
              return;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(error: emptyPasswordError);
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
          Row(
            children: [
              Checkbox(
                value: remember,
                activeColor: kPrimaryColor,
                onChanged: (value) {
                  setState(() {
                    remember = value;
                  });
                },
              ),
              const Text("Remember me"),
              const Spacer(),
              GestureDetector(
                onTap: () => Navigator.pushNamed(
                    context, ForgotPasswordScreen.routeName),
                child: const Text(
                  "Forgot Password",
                  style: TextStyle(decoration: TextDecoration.underline),
                ),
              )
            ],
          ),
          FormError(errors: errors),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () async {
              removeError(error: 'user not found');
              removeError(error: 'wrong password');
              removeError(error: 'failed to login');
              try {
                if (_formKey.currentState!.validate()) {
                  _formKey.currentState!.save();

                  KeyboardUtil.hideKeyboard(context);
                  await AuthService.firebase()
                      .logIn(email: email, password: password);
                  if (context.mounted) {
                    Navigator.pushNamedAndRemoveUntil(
                        context, InitScreen.routeName, (_) => true);
                  }
                }
              } on UserNotFoundAuthException {
                addError(error: 'user not found');
              } on WrongPasswordAuthException {
                addError(error: 'wrong password');
              } on GenericAuthException {
                addError(error: 'failed to login');
              }
            },
            child: const Text("Login"),
          ),
        ],
      ),
    );
  }
}
