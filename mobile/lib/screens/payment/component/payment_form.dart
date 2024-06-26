import 'package:flutter/material.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:logger/logger.dart';
import 'package:shop_app/services/crud/user/db_user_service.dart';
import 'package:shop_app/services/stripe/payment_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../../../components/custom_surfix_icon.dart';
import '../../../components/form_error.dart';

class PaymentForm extends StatefulWidget {
  const PaymentForm({
    Key? key,
  }) : super(key: key);

  @override
  State<PaymentForm> createState() => _PaymentFormState();
}

class _PaymentFormState extends State<PaymentForm> {
  final _formKey = GlobalKey<FormState>();
  final List<String?> errors = [];
  String name = "";
  String email = "";
  String phone = "";
  String city = "";
  String country = "";
  String line1 = "";
  String line2 = "";
  String postalCode = "";
  String state = "";
  DBUserService dbUserService = DBUserService();
  @override
  void initState() {
    super.initState();
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
            onSaved: (newValue) => name = newValue ?? "",
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(
                    error: AppLocalizations.of(context)!.empty_name_error);
              }
              name = value;
              return;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(error: AppLocalizations.of(context)!.empty_name_error);
                return "";
              }
              return null;
            },
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.name,
              hintText: AppLocalizations.of(context)!.enter_your_name,
              floatingLabelBehavior: FloatingLabelBehavior.always,
              suffixIcon:
                  const CustomSurffixIcon(svgIcon: "assets/icons/User.svg"),
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            initialValue: name,
            onSaved: (newValue) => phone = newValue ?? "",
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(
                    error: AppLocalizations.of(context)!.empty_phone_error);
              }
              phone = value;
              return;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(
                    error: AppLocalizations.of(context)!.empty_phone_error);
                return "";
              }
              return null;
            },
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.phone,
              hintText: AppLocalizations.of(context)!.enter_your_phone,
              floatingLabelBehavior: FloatingLabelBehavior.always,
              suffixIcon:
                  const CustomSurffixIcon(svgIcon: "assets/icons/User.svg"),
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            onSaved: (newValue) => city = newValue ?? "",
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(
                    error: AppLocalizations.of(context)!.empty_city_error);
              }
              city = value;
              return;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(error: AppLocalizations.of(context)!.empty_city_error);
                return "";
              }
              return null;
            },
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.city,
              hintText: AppLocalizations.of(context)!.enter_your_city,
              floatingLabelBehavior: FloatingLabelBehavior.always,
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            onSaved: (newValue) => country = newValue ?? "",
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(
                    error: AppLocalizations.of(context)!.empty_country_error);
              }
              country = value;
              return;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(
                    error: AppLocalizations.of(context)!.empty_country_error);
                return "";
              }
              return null;
            },
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.country,
              hintText: AppLocalizations.of(context)!.enter_your_country,
              floatingLabelBehavior: FloatingLabelBehavior.always,
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            onSaved: (newValue) => line1 = newValue ?? "",
            onChanged: (value) {
              if (value.isNotEmpty) {
                removeError(
                    error: AppLocalizations.of(context)!
                        .empty_address_line1_error);
              }
              line1 = value;
              return;
            },
            validator: (value) {
              if (value!.isEmpty) {
                addError(
                    error: AppLocalizations.of(context)!
                        .empty_address_line1_error);
                return "";
              }
              return null;
            },
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.address1,
              hintText: AppLocalizations.of(context)!.enter_your_adress1,
              floatingLabelBehavior: FloatingLabelBehavior.always,
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            onSaved: (newValue) => line2 = newValue ?? "",
            onChanged: (value) {
              line2 = value;
              return;
            },
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.address2,
              hintText: AppLocalizations.of(context)!.enter_your_adress2,
              floatingLabelBehavior: FloatingLabelBehavior.always,
            ),
          ),
          const SizedBox(height: 20),
          TextFormField(
            onSaved: (newValue) => postalCode = newValue ?? "",
            onChanged: (value) {
              postalCode = value;
              return;
            },
            validator: (value) {
              return null;
            },
            decoration: InputDecoration(
              labelText: AppLocalizations.of(context)!.postal_code,
              hintText: AppLocalizations.of(context)!.entert_postal_code,
              floatingLabelBehavior: FloatingLabelBehavior.always,
            ),
          ),
          const SizedBox(height: 20),
          FormError(errors: errors),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: () async {
              if (_formKey.currentState!.validate()) {
                try {
                  context.loaderOverlay.show();
                  await StripeService().stripeMakePayment(
                    name: name,
                    email: email,
                    phone: phone,
                    city: city,
                    country: country,
                    line1: line1,
                    line2: line2,
                    postalCode: postalCode,
                    state: state,
                  );
                  if (context.mounted) {
                    Navigator.pop(context);
                  }
                } catch (e) {
                  Logger().d(e.toString());
                } finally {
                  if (context.mounted) {
                    context.loaderOverlay.hide();
                  }
                }
              }
            },
            child: Text(AppLocalizations.of(context)!.continue_text),
          ),
        ],
      ),
    );
  }
}
