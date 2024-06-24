import 'package:flutter/material.dart';
import 'package:shop_app/screens/order_details/order_details_screen.dart';
import 'package:shop_app/services/crud/order/db_order.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

import '../../../constants.dart';

class OrderCard extends StatelessWidget {
  const OrderCard({
    Key? key,
    required this.order,
  }) : super(key: key);

  final DBOrder order;

  @override
  Widget build(BuildContext context) {
    final totalQuantity = order.products.fold(0, (acc, cur) {
      return acc + cur.quantity;
    });
    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, OrderProductDetailsScreen.routeName,
            arguments: {
              'order': order,
            });
      },
      child: Container(
        margin: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: const Color.fromARGB(255, 255, 255, 255),
          border: Border.all(
            color: Colors.black,
            width: 1.0,
          ),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Row(
          children: [
            const SizedBox(width: 20),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  order.createdTime,
                  style: const TextStyle(color: Colors.black, fontSize: 13),
                  textDirection: TextDirection.ltr,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Text.rich(
                  TextSpan(
                    text:
                        "${AppLocalizations.of(context)!.total}: \$${order.total}",
                    style: const TextStyle(
                        fontWeight: FontWeight.w600, color: kPrimaryColor),
                  ),
                ),
                Text.rich(
                  TextSpan(
                      text:
                          "${AppLocalizations.of(context)!.total_quantity}: $totalQuantity",
                      style: Theme.of(context).textTheme.bodyMedium),
                ),
                const SizedBox(height: 8),
              ],
            )
          ],
        ),
      ),
    );
  }
}
