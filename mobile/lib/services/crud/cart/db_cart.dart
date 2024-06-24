import 'package:shop_app/services/crud/cart/db_cart_item.dart';

class DBCart {
  final String userId;
  final List<DBCartItem> cartItems;

  //not exist in DB
  final double total;
  const DBCart(
      {required this.userId, required this.cartItems, required this.total});
}
