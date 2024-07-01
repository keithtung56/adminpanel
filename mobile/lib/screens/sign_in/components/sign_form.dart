import 'package:flutter/material.dart';
import 'package:shop_app/screens/init_screen.dart';
import 'package:shop_app/services/auth/auth_exceptions.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
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
                removeError(
                    error: AppLocalizations.of(context)!.empty_email_error);
              }
              if (emailValidatorRegExp.hasMatch(value)) {
                removeError(
                    error: AppLocalizations.of(context)!.invalid_email_error);
              }
              return;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(
                    error: AppLocalizations.of(context)!.empty_email_error);
                return "";
              } else if (!emailValidatorRegExp.hasMatch(value)) {
                addError(
                    error: AppLocalizations.of(context)!.invalid_email_error);
                return "";
              }
              return null;
            },
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.email,
              hintText: AppLocalizations.of(context)!.enter_your_email,
              floatingLabelBehavior: FloatingLabelBehavior.always,
              suffixIcon:
                  const CustomSurffixIcon(svgIcon: "assets/icons/Mail.svg"),
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            obscureText: true,
            onSaved: (newValue) => password = newValue ?? "",
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(
                    error: AppLocalizations.of(context)!.empty_password_error);
              }
              return;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(
                    error: AppLocalizations.of(context)!.empty_password_error);
                return "";
              }
              return null;
            },
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.password,
              hintText: AppLocalizations.of(context)!.enter_your_password,
              floatingLabelBehavior: FloatingLabelBehavior.always,
              suffixIcon:
                  const CustomSurffixIcon(svgIcon: "assets/icons/Lock.svg"),
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              const Spacer(),
              GestureDetector(
                onTap: () => Navigator.pushNamed(
                    context, ForgotPasswordScreen.routeName),
                child: Text(
                  AppLocalizations.of(context)!.forget_password,
                  style: const TextStyle(decoration: TextDecoration.underline),
                ),
              )
            ],
          ),
          FormError(errors: errors),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () async {
              removeError(error: AppLocalizations.of(context)!.user_not_found);
              removeError(error: AppLocalizations.of(context)!.wrong_password);
              removeError(error: AppLocalizations.of(context)!.failed_to_login);
              try {
                if (_formKey.currentState!.validate()) {
                  _formKey.currentState!.save();

                  KeyboardUtil.hideKeyboard(context);
                  await AuthService.firebase().logIn(
                    email: email,
                    password: password,
                  );
                  if (context.mounted) {
                    Navigator.pushNamedAndRemoveUntil(context,
                        InitScreen.routeName, (route) => route.isFirst);
                  }
                }
              } on UserNotFoundAuthException {
                if (context.mounted) {
                  addError(error: AppLocalizations.of(context)!.user_not_found);
                }
              } on WrongPasswordAuthException {
                if (context.mounted) {
                  addError(error: AppLocalizations.of(context)!.wrong_password);
                }
              } on GenericAuthException {
                if (context.mounted) {
                  addError(
                      error: AppLocalizations.of(context)!.failed_to_login);
                }
              }
            },
            child: Text(AppLocalizations.of(context)!.login),
          ),
        ],
      ),
    );
  }
}
