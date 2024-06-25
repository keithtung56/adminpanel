import 'package:flutter/foundation.dart';

@immutable
class DBProduct {
  final String id;
  final String categoryId;
  final double price;
  final String description;
  final String productName;
  final String createdTime;
  final String modifiedTime;
  final String imgUrl;
  final List<Map<String, List<String>>> options;

  const DBProduct({
    required this.id,
    required this.categoryId,
    required this.price,
    required this.description,
    required this.productName,
    required this.createdTime,
    required this.modifiedTime,
    required this.imgUrl,
    required this.options,
  });
}
