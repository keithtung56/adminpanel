import 'package:flutter/material.dart';
import 'package:shop_app/screens/payment/component/payment_form.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../../constants.dart';

class PaymentScreen extends StatefulWidget {
  static String routeName = "/payment";

  const PaymentScreen({super.key});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(AppLocalizations.of(context)!.payment),
        ),
        body: SafeArea(
          child: SizedBox(
            width: double.infinity,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    const SizedBox(height: 16),
                    Text(AppLocalizations.of(context)!.payment_details,
                        style: headingStyle),
                    const SizedBox(height: 16),
                    const PaymentForm(),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
          ),
        ));
  }
}
