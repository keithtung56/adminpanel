import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/services/crud/cart/db_cart.dart';
import 'package:shop_app/services/crud/cart/db_cart_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'components/cart_card.dart';
import 'components/check_out_card.dart';

class CartScreen extends StatefulWidget {
  static String routeName = "/cart";

  const CartScreen({super.key});

  @override
  State<CartScreen> createState() => _CartScreenState();
}

class _CartScreenState extends State<CartScreen> {
  late Stream<DBCart?> _cartStream1;
  late Stream<DBCart?> _cartStream2;
  @override
  void initState() {
    super.initState();

    _cartStream1 = DBCartService().getUserCartStream();
    _cartStream2 = DBCartService().getUserCartStream();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: grey,
      appBar: AppBar(
        backgroundColor: white,
        title: Column(
          children: [
            Text(
              AppLocalizations.of(context)!.cart,
            ),
          ],
        ),
      ),
      body: Expanded(
        child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: StreamBuilder(
                stream: _cartStream1,
                builder: (context, snapshot) {
                  switch (snapshot.hasData) {
                    case (true):
                      return ListView.builder(
                        itemCount: snapshot.data!.cartItems.length,
                        itemBuilder: (context, index) => Container(
                          padding: const EdgeInsets.symmetric(
                              vertical: 10, horizontal: 10),
                          decoration: const BoxDecoration(
                              color: white,
                              border: Border.symmetric(
                                  horizontal:
                                      BorderSide(width: 2, color: grey))),
                          child: Dismissible(
                            key: Key(
                                snapshot.data!.cartItems[index].uid.toString()),
                            direction: DismissDirection.endToStart,
                            onDismissed: (direction) async {
                              String uid = snapshot.data!.cartItems[index].uid;
                              await DBCartService().removeItemFromCart(uid);
                            },
                            background: Container(
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 20),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFE6E6),
                                borderRadius: BorderRadius.circular(15),
                              ),
                              child: Row(
                                children: [
                                  const Spacer(),
                                  SvgPicture.asset("assets/icons/Trash.svg"),
                                ],
                              ),
                            ),
                            child: CartCard(
                                cartItem: snapshot.data!.cartItems[index]),
                          ),
                        ),
                      );
                    default:
                      return const Loading();
                  }
                })),
      ),
      bottomNavigationBar: StreamBuilder(
          stream: _cartStream2,
          builder: (context, snapshot) {
            switch (snapshot.hasData) {
              case (true):
                if (snapshot.data != null) {
                  return CheckoutCard(cart: snapshot.data as DBCart);
                } else {
                  return const Loading();
                }
              default:
                return const Loading();
            }
          }),
    );
  }
}
