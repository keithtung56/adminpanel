import 'package:collection/collection.dart';
import 'package:shop_app/services/crud/cart/db_cart_item.dart';
import 'package:shop_app/services/crud/product/db_product.dart';

double countTotal(List<DBCartItem> cartItems, List<DBProduct> productsList) {
  var total = cartItems.fold(0.0, (acc, carItem) {
    var product = productsList
        .firstWhereOrNull((product) => product.id == carItem.productId);
    if (product == null) {
      return acc;
    }
    return acc + carItem.quantity * product.price;
  });
  return total;
}
