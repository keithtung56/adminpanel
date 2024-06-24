import 'package:firebase_database/firebase_database.dart';
import 'package:logger/logger.dart';
import 'package:moment_dart/moment_dart.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/services/auth/auth_exceptions.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/crud/cart/db_cart_item.dart';
import 'package:shop_app/services/crud/cart/db_cart_service.dart';
import 'package:shop_app/services/crud/order/db_order.dart';
import 'package:shop_app/services/crud/product/db_product_service.dart';
import 'package:shop_app/services/crud/user/db_user_service.dart';
import 'package:uuid/uuid.dart';

class DBOrderService {
  Future<DBOrder> getOrderById(String id) async {
    final snapshot = await FirebaseDatabase.instance.ref("Orders/$id").get();
    if (!snapshot.exists) {
      throw OrderNotFound;
    }
    final val = snapshot.value as Map<dynamic, dynamic>;
    final productsObj = val['products'] as Map<dynamic, dynamic>;
    final productsList = productsObj.entries.map((e) {
      return DBOrderProduct(
        price: (e.value['price'] as num).toDouble(),
        quantity: e.value['quantity'],
        id: e.key,
      );
    }).toList();
    return DBOrder(
      id: id,
      orderName: val['order_name'],
      createdTime: val['created_time'],
      modifiedTime: val['modified_time'],
      status: val['status'],
      total: (val['total'] as num).toDouble(),
      products: productsList,
    );
  }

  Future<void> createOrder() async {
    final randomId = const Uuid().v1();
    final cart = await DBCartService().getUserCart();
    if (cart.cartItems.isEmpty) {
      return;
    }
    await FirebaseDatabase.instance.ref("Orders/$randomId").update({
      'total': cart.total,
      'created_time': Moment.now().format(dateDBFormat),
      'modified_time': Moment.now().format(dateDBFormat),
      'status': 'paid',
      'order_name': "Order2",
      'user': cart.userId,
    });
    await FirebaseDatabase.instance.ref("Users/${cart.userId}/orders").update({
      randomId: "",
    });
    for (DBCartItem item in cart.cartItems) {
      final product = await DBProductService().getProductById(item.productId);
      await FirebaseDatabase.instance.ref("Orders/$randomId/products").update({
        item.productId: {
          'quantity': item.quantity,
          'price': product.price,
        }
      });
    }
    await DBCartService().removeAllItemsFromCart();
  }

  Future<List<DBOrder>> getCurrentUserOrders() async {
    try {
      final userId = AuthService.firebase().currentUser?.uid;
      if (userId == null) {
        throw UserNotLoggedInAuthException();
      }
      final user = await DBUserService().getCurrentDBUser();

      return Future.wait(user.ordersId.map((orderId) async {
        return await getOrderById(orderId);
      }).toList());
    } on OrderNotFound {
      Logger().d("getCurrentUserOrders: Order not found");
      return [];
    } catch (e) {
      Logger().d("unknown error: ${e.toString()}");
      return [];
    }
  }
}

class OrderNotFound implements Exception {}
