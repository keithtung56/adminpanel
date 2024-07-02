import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../../../components/custom_surfix_icon.dart';
import '../../../components/form_error.dart';
import '../../../components/no_account_text.dart';
import '../../../constants.dart';

class ForgotPassForm extends StatefulWidget {
  const ForgotPassForm({super.key});

  @override
  State<ForgotPassForm> createState() => _ForgotPassFormState();
}

class _ForgotPassFormState extends State<ForgotPassForm> {
  final _formKey = GlobalKey<FormState>();
  List<String> errors = [];
  String? email;
  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            keyboardType: TextInputType.emailAddress,
            onSaved: (newValue) => email = newValue,
            onChanged: (value) {
              if (value.isNotEmpty &&
                  errors.contains(
                      AppLocalizations.of(context)!.empty_email_error)) {
                setState(() {
                  errors
                      .remove(AppLocalizations.of(context)!.empty_email_error);
                });
              } else if (emailValidatorRegExp.hasMatch(value) &&
                  errors.contains(
                      AppLocalizations.of(context)!.invalid_email_error)) {
                setState(() {
                  errors.remove(
                      AppLocalizations.of(context)!.invalid_email_error);
                });
              }
              return;
            },
            validator: (value) {
              if (value!.isEmpty &&
                  !errors.contains(
                      AppLocalizations.of(context)!.empty_email_error)) {
                setState(() {
                  errors.add(AppLocalizations.of(context)!.empty_email_error);
                });
              } else if (!emailValidatorRegExp.hasMatch(value) &&
                  !errors.contains(
                      AppLocalizations.of(context)!.invalid_email_error)) {
                setState(() {
                  errors.add(AppLocalizations.of(context)!.invalid_email_error);
                });
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
          const SizedBox(height: 8),
          FormError(errors: errors),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                // Do what you want to do
              }
            },
            child: const Text("Continue"),
          ),
          const SizedBox(height: 16),
          const NoAccountText(),
        ],
      ),
    );
  }
}
