import 'package:flutter/material.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/services/crud/order/db_order.dart';
import 'package:shop_app/services/crud/product/db_product.dart';
import 'package:shop_app/services/crud/product/db_product_service.dart';

import '../../../constants.dart';

class OrderProductCard extends StatefulWidget {
  const OrderProductCard({
    Key? key,
    required this.product,
  }) : super(key: key);

  final DBOrderProduct product;

  @override
  State<OrderProductCard> createState() => _OrderProductCardState();
}

class _OrderProductCardState extends State<OrderProductCard> {
  late Future<DBProduct?> _productDetails;

  @override
  void initState() {
    super.initState();

    _productDetails =
        DBProductService().getProductById(widget.product.productId);
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: _productDetails,
        builder: (context, snapshot) {
          switch (snapshot.connectionState) {
            case (ConnectionState.done):
              return Column(
                children: [
                  Row(
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
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              snapshot.data!.productName,
                              style: const TextStyle(
                                  color: Colors.black, fontSize: 13),
                              textDirection: TextDirection.ltr,
                              overflow: TextOverflow.visible,
                            ),
                            const SizedBox(height: 8),
                            ...widget.product.options.entries.map((entry) {
                              return Text(
                                '${entry.key}: ${entry.value}',
                                style: const TextStyle(
                                    color: Colors.black, fontSize: 13),
                              );
                            }).toList(),
                            Text.rich(
                              TextSpan(
                                text: "\$${snapshot.data!.price}",
                                style: const TextStyle(
                                    fontWeight: FontWeight.w600,
                                    color: kPrimaryColor),
                                children: [
                                  TextSpan(
                                    text: " x ${widget.product.quantity}",
                                    style:
                                        Theme.of(context).textTheme.bodyLarge,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              );
            default:
              return const Loading();
          }
        });
  }
}
