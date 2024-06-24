import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shop_app/screens/payment/payment_screen.dart';
import 'package:shop_app/services/crud/cart/db_cart.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class CheckoutCard extends StatelessWidget {
  final DBCart cart;
  const CheckoutCard({
    required this.cart,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.symmetric(
          vertical: 16,
          horizontal: 20,
        ),
        // height: 174,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(30),
            topRight: Radius.circular(30),
          ),
          boxShadow: [
            BoxShadow(
              offset: const Offset(0, -15),
              blurRadius: 20,
              color: const Color(0xFFDADADA).withOpacity(0.15),
            )
          ],
        ),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    height: 40,
                    width: 40,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF5F6F9),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: SvgPicture.asset("assets/icons/receipt.svg"),
                  ),
                  const Spacer(),
                  SizedBox(
                    width: 100,
                    child: Expanded(
                        child: Text.rich(
                      TextSpan(
                        text:
                            "${AppLocalizations.of(context)!.total}: ${cart.total}\n",
                      ),
                    )),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () async {
                        if (cart.cartItems.isEmpty) {
                          return;
                        }
                        if (context.mounted) {
                          Navigator.pushNamed(context, PaymentScreen.routeName);
                        }
                      },
                      child: Text(AppLocalizations.of(context)!.check_out),
                    ),
                  ),
                ],
              )
            ],
          ),
        ));
  }
}
