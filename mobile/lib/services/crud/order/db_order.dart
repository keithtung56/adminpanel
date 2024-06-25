import 'package:flutter/foundation.dart';

@immutable
class DBOrder {
  final String id;
  final String createdTime;
  final String modifiedTime;
  final String status;
  final double total;
  final List<DBOrderProduct> products;

  const DBOrder(
      {required this.id,
      required this.createdTime,
      required this.modifiedTime,
      required this.status,
      required this.total,
      required this.products});
}

class DBOrderProduct {
  final double price;
  final int quantity;
  final String id;
  final String productId;
  final Map<dynamic, dynamic> options;

  const DBOrderProduct({
    required this.price,
    required this.quantity,
    required this.id,
    required this.productId,
    required this.options,
  });
}
