import 'package:flutter/foundation.dart';

@immutable
class DBCategory {
  final String id;
  final String categoryName;
  final String modifiedTime;
  final String createdTime;
  final String imgUrl;

  const DBCategory(
      {required this.id,
      required this.categoryName,
      required this.createdTime,
      required this.modifiedTime,
      required this.imgUrl});
}
