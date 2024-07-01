import 'package:flutter/material.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/services/crud/cart/db_cart_item.dart';
import 'package:shop_app/services/crud/product/db_product.dart';
import 'package:shop_app/services/crud/product/db_product_service.dart';

import '../../../constants.dart';

class CartCard extends StatefulWidget {
  const CartCard({
    Key? key,
    required this.cartItem,
  }) : super(key: key);

  final DBCartItem cartItem;

  @override
  State<CartCard> createState() => _CartCardState();
}

class _CartCardState extends State<CartCard> {
  late Future<DBProduct?> _product;

  @override
  void initState() {
    super.initState();

    _product = DBProductService().getProductById(widget.cartItem.productId);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: _product,
        builder: (context, snapshot) {
          switch (snapshot.connectionState) {
            case (ConnectionState.done):
              return Row(
                children: [
                  SizedBox(
                    width: 88,
                    child: AspectRatio(
                      aspectRatio: 0.88,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF5F6F9),
                          borderRadius: BorderRadius.circular(15),
                        ),
                        child: Image.network(snapshot.data!.imgUrl),
                      ),
                    ),
                  ),
                  const SizedBox(width: 20),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        snapshot.data!.productName,
                        style:
                            const TextStyle(color: Colors.black, fontSize: 13),
                        textDirection: TextDirection.ltr,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),
                      ...widget.cartItem.options.entries.map((entry) {
                        return Text(
                          '${entry.key}: ${entry.value}',
                          style: const TextStyle(
                              color: Colors.black, fontSize: 13),
                          textDirection: TextDirection.ltr,
                          overflow: TextOverflow.ellipsis,
                        );
                      }).toList(),
                      const SizedBox(height: 8),
                      Text.rich(
                        TextSpan(
                          text: "\$${snapshot.data!.price}",
                          style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              color: kPrimaryColor),
                          children: [
                            TextSpan(
                                text: " x ${widget.cartItem.quantity}",
                                style: Theme.of(context).textTheme.bodyLarge),
                          ],
                        ),
                      )
                    ],
                  )
                ],
              );
            default:
              return const Loading();
          }
        });
  }
}
