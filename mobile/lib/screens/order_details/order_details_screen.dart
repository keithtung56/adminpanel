import 'package:flutter/material.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/screens/order_details/components/order_details_bottom_card.dart';
import 'package:shop_app/screens/order_details/components/order_product_card.dart';
import 'package:shop_app/services/crud/order/db_order.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class OrderProductDetailsScreen extends StatelessWidget {
  static String routeName = "/order_details";
  final DBOrder order;
  const OrderProductDetailsScreen({
    Key? key,
    required this.order,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: grey,
        appBar: AppBar(
          backgroundColor: white,
          title: Column(
            children: [
              Text(
                AppLocalizations.of(context)!.order_details,
                style: const TextStyle(color: Colors.black),
                textDirection: TextDirection.ltr,
              ),
            ],
          ),
        ),
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          child: ListView.builder(
              itemCount: order.products.length,
              itemBuilder: (context, index) => Container(
                    decoration: const BoxDecoration(
                        color: white,
                        border: Border.symmetric(
                            horizontal: BorderSide(width: 2, color: grey))),
                    padding: const EdgeInsets.symmetric(
                        vertical: 10, horizontal: 10),
                    child: OrderProductCard(product: order.products[index]),
                  )),
        ),
        bottomNavigationBar: OrderDetailsBottomCard(
          order: order,
        ));
  }
}
