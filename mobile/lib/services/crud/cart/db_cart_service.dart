import 'package:firebase_database/firebase_database.dart';
import 'package:logger/logger.dart';
import 'package:shop_app/helper/count_total.dart';
import 'package:shop_app/services/auth/auth_exceptions.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/crud/cart/db_cart.dart';
import 'package:shop_app/services/crud/cart/db_cart_item.dart';
import 'package:collection/collection.dart';
import 'package:shop_app/services/crud/product/db_product_service.dart';
import 'package:uuid/uuid.dart';

class DBCartService {
  Future<DBCart> getUserCart() async {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      throw UserNotLoggedInAuthException();
    }
    final snapshot = await FirebaseDatabase.instance.ref("Carts/$userId").get();
    final productsList = await DBProductService().getProductList();
    if (!snapshot.exists) {
      return DBCart(userId: userId, cartItems: [], total: 0);
    }
    final cart = snapshot.value as Map<dynamic, dynamic>;
    var cartItems = cart.entries.map((e) {
      return DBCartItem(
        uid: e.key,
        productId: e.value['product_id'],
        quantity: e.value['quantity'],
        options: e.value['options'] as Map<dynamic, dynamic>,
      );
    }).toList();
    final total = countTotal(cartItems, productsList);
    return DBCart(userId: userId, cartItems: cartItems, total: total);
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
          return DBCartItem(
            uid: e.key,
            productId: e.value['product_id'],
            quantity: e.value['quantity'],
            options: e.value['options'],
          );
        }).toList();
        final productsList = await DBProductService().getProductList();
        final total = countTotal(cartItems, productsList);
        return DBCart(userId: userId, cartItems: cartItems, total: total);
      }
      return DBCart(userId: userId, cartItems: [], total: 0);
    });
  }

  Future<void> addItemToCart(
      String productId, int quantity, Map<dynamic, dynamic> options) async {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      throw UserNotLoggedInAuthException;
    }
    Logger().d(options);
    final currentCart = await getUserCart();
    DBCartItem? item = currentCart.cartItems.firstWhereOrNull(
      (cartItem) =>
          cartItem.productId == productId &&
          const DeepCollectionEquality().equals(cartItem.options, options),
    );
    if (item != null) {
      await FirebaseDatabase.instance.ref("Carts/$userId").update({
        item.uid: {
          'product_id': productId,
          'quantity': item.quantity + quantity,
          'options': options,
        }
      });
    } else {
      final randomId = const Uuid().v1();
      await FirebaseDatabase.instance.ref("Carts/$userId").update({
        randomId: {
          'product_id': productId,
          'quantity': quantity,
          'options': options,
        }
      });
    }
  }

  Future<void> removeItemFromCart(String uid) async {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      throw UserNotLoggedInAuthException;
    }
    await FirebaseDatabase.instance.ref("Carts/$userId").update({uid: {}});
  }

  Future<void> removeAllItemsFromCart() async {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      return;
    }
    await FirebaseDatabase.instance.ref("Carts/").update({userId: {}});
  }
}
