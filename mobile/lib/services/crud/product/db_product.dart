import 'package:flutter/foundation.dart';

@immutable
class DBProduct {
  final String id;
  final String categoryId;
  final double price;
  final int stock;
  final String description;
  final String productName;
  final String createdTime;
  final String modifiedTime;
  final String imgUrl;

  const DBProduct({
    required this.id,
    required this.categoryId,
    required this.price,
    required this.stock,
    required this.description,
    required this.productName,
    required this.createdTime,
    required this.modifiedTime,
    required this.imgUrl,
  });
}
