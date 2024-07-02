import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:shop_app/components/form_error.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class ForgotPasswordScreen extends StatefulWidget {
  static String routeName = "/forgot_password";

  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final List<String?> errors = [];
  String email = '';

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
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: grey,
        appBar: AppBar(
          title: Text(AppLocalizations.of(context)!.reset_password),
        ),
        body: Expanded(
            child: Container(
          color: white,
          padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
          alignment: Alignment.center,
          width: double.infinity,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Form(
                  key: _formKey,
                  child: TextFormField(
                    initialValue: email,
                    onSaved: (newValue) => email = newValue ?? "",
                    onChanged: (value) {
                      if (value.isNotEmpty) {
                        removeError(
                            error: AppLocalizations.of(context)!
                                .empty_email_error);
                      }
                      if (emailValidatorRegExp.hasMatch(value)) {
                        removeError(
                            error: AppLocalizations.of(context)!
                                .invalid_email_error);
                      }
                      email = value;
                      return;
                    },
                    validator: (value) {
                      if (value!.isEmpty) {
                        addError(
                            error: AppLocalizations.of(context)!
                                .empty_email_error);
                        return "";
                      }
                      if (!emailValidatorRegExp.hasMatch(value)) {
                        addError(
                            error: AppLocalizations.of(context)!
                                .invalid_email_error);
                      }
                      return null;
                    },
                    decoration: InputDecoration(
                      labelText: AppLocalizations.of(context)!.email,
                      hintText: AppLocalizations.of(context)!.enter_your_email,
                      floatingLabelBehavior: FloatingLabelBehavior.always,
                    ),
                  )),
              Container(
                alignment: Alignment.center,
                child: FormError(errors: errors),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () async {
                  if (_formKey.currentState!.validate()) {
                    try {
                      context.loaderOverlay.show();
                      await AuthService.firebase().sendResetPassword(email);
                      if (context.mounted) {
                        Fluttertoast.showToast(
                            msg: AppLocalizations.of(context)!.email_sent);
                      }
                    } catch (e) {
                      Fluttertoast.showToast(msg: e.toString());
                    } finally {
                      if (context.mounted) {
                        context.loaderOverlay.hide();
                      }
                    }
                  }
                },
                child: Text(AppLocalizations.of(context)!.send_reset_password),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                  onPressed: () {
                    if (context.mounted) {
                      Navigator.pop(context);
                    }
                  },
                  child: Text(AppLocalizations.of(context)!.back_to_login)),
            ],
          ),
        )));
  }
}
