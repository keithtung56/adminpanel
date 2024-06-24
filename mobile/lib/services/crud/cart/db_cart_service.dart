import 'package:firebase_database/firebase_database.dart';
import 'package:shop_app/helper/count_total.dart';
import 'package:shop_app/services/auth/auth_exceptions.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/crud/cart/db_cart.dart';
import 'package:shop_app/services/crud/cart/db_cart_item.dart';
import 'package:collection/collection.dart';
import 'package:shop_app/services/crud/product/db_product_service.dart';

class DBCartService {
  Future<DBCart> getUserCart() async {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      throw UserNotLoggedInAuthException();
    }
    final snapshot = await FirebaseDatabase.instance.ref("Carts/$userId").get();
    final productsList = await DBProductService().getProductList();
    if (snapshot.exists) {
      final cart = snapshot.value as Map<dynamic, dynamic>;
      var cartItems = cart.entries.map((e) {
        return DBCartItem(productId: e.key, quantity: e.value['quantity']);
      }).toList();
      final total = countTotal(cartItems, productsList);
      return DBCart(userId: userId, cartItems: cartItems, total: total);
    }
    return DBCart(userId: userId, cartItems: [], total: 0);
  }

  Stream<DBCart?> getUserCartStream() {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      return Stream<DBCart?>.value(null);
    }

    return FirebaseDatabase.instance
        .ref("Carts/$userId")
        .onValue
        .asyncMap((event) async {
      if (event.snapshot.exists) {
        final val = event.snapshot.value as Map<dynamic, dynamic>;
        var cartItems = val.entries.map((e) {
          return DBCartItem(productId: e.key, quantity: e.value['quantity']);
        }).toList();
        final productsList = await DBProductService().getProductList();
        final total = countTotal(cartItems, productsList);
        return DBCart(userId: userId, cartItems: cartItems, total: total);
      }
      return DBCart(userId: userId, cartItems: [], total: 0);
    });
  }

  Future<void> addItemToCart(String productId, int quantity) async {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      throw UserNotLoggedInAuthException;
    }
    final currentCart = await getUserCart();

    DBCartItem? item = currentCart.cartItems
        .firstWhereOrNull((cartItem) => cartItem.productId == productId);
    if (item != null) {
      await FirebaseDatabase.instance.ref("Carts/$userId").update({
        productId: {
          'quantity': item.quantity + quantity,
        }
      });
    } else {
      await FirebaseDatabase.instance.ref("Carts/$userId").update({
        productId: {
          'quantity': quantity,
        }
      });
    }
  }

  Future<void> removeItemFromCart(String productId) async {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      throw UserNotLoggedInAuthException;
    }
    await FirebaseDatabase.instance
        .ref("Carts/$userId")
        .update({productId: {}});
  }

  Future<void> removeAllItemsFromCart() async {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      return;
    }
    await FirebaseDatabase.instance.ref("Carts/").update({userId: {}});
  }
}
