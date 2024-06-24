import 'package:flutter/material.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/services/crud/user/db_user.dart';
import 'package:shop_app/services/crud/user/db_user_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../../../components/custom_surfix_icon.dart';
import '../../../components/form_error.dart';

class MyAccountForm extends StatefulWidget {
  final DBUser currentUser;
  const MyAccountForm({
    Key? key,
    required this.currentUser,
  }) : super(key: key);

  @override
  State<MyAccountForm> createState() => _MyAccountFormState();
}

class _MyAccountFormState extends State<MyAccountForm> {
  final _formKey = GlobalKey<FormState>();
  final List<String?> errors = [];
  String username = "";
  String gender = "";
  int age = 0;
  DBUserService dbUserService = DBUserService();
  @override
  void initState() {
    super.initState();
    username = widget.currentUser.username;
    age = widget.currentUser.age;

    gender = widget.currentUser.gender;
  }

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
            initialValue: username,
            onSaved: (newValue) => username = newValue ?? "",
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(error: "");
              }
              username = value;
              return;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(error: "");
                return "";
              }
              return null;
            },
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.username,
              hintText: AppLocalizations.of(context)!.enter_your_username,
              floatingLabelBehavior: FloatingLabelBehavior.always,
              suffixIcon:
                  const CustomSurffixIcon(svgIcon: "assets/icons/User.svg"),
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            initialValue: "$age",
            keyboardType: TextInputType.number,
            onSaved: (newValue) => age = int.parse(newValue ?? "0"),
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(error: "");
              }
              age = int.parse(value);
              return;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(error: "");
                return "";
              }
              return null;
            },
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.age,
              hintText: AppLocalizations.of(context)!.enter_your_age,
              floatingLabelBehavior: FloatingLabelBehavior.always,
            ),
          ),
          const SizedBox(height: 20),
          DropdownButtonFormField(
            value: gender,
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
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.gender,
              hintText: AppLocalizations.of(context)!.select_your_gender,
              floatingLabelBehavior: FloatingLabelBehavior.always,
            ),
          ),
          FormError(errors: errors),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                await DBUserService().updateDBUser(username, age, gender);
                if (context.mounted) {
                  Navigator.pop(context);
                }
              }
            },
            child: Text((AppLocalizations.of(context)!.continue_text)),
          ),
        ],
      ),
    );
  }
}
