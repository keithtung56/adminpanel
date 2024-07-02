import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/screens/cart/cart_screen.dart';
import 'package:shop_app/screens/products_details/components/product_images.dart';
import 'package:shop_app/screens/sign_in/sign_in_screen.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/crud/cart/db_cart_service.dart';
import 'package:shop_app/services/crud/product/db_product.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'components/product_description.dart';

class ProductDetailsScreen extends StatefulWidget {
  static String routeName = "/details";
  const ProductDetailsScreen({
    Key? key,
  }) : super(key: key);

  @override
  State<ProductDetailsScreen> createState() => _ProductDetailsScreenState();
}

class _ProductDetailsScreenState extends State<ProductDetailsScreen> {
  int quantity = 1;

  @override
  Widget build(BuildContext context) {
    final ProductDetailsArguments agrs =
        ModalRoute.of(context)!.settings.arguments as ProductDetailsArguments;
    final product = agrs.product;

    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      backgroundColor: grey,
      appBar: AppBar(
        backgroundColor: white,
        elevation: 0,
        leading: Padding(
          padding: const EdgeInsets.all(8.0),
          child: ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
              shape: const CircleBorder(),
              padding: EdgeInsets.zero,
              elevation: 0,
              backgroundColor: Colors.white,
            ),
            child: const Icon(
              Icons.arrow_back_ios_new,
              color: Colors.black,
              size: 20,
            ),
          ),
        ),
      ),
      body: ListView(
        children: [
          ProductImages(product: product),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 10),
            child: Column(
              children: [
                ProductDescription(
                  product: product,
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        color: Colors.white,
        child: SafeArea(
            child: SizedBox(
          height: 120,
          child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Column(children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          if (quantity - 1 > 0) {
                            quantity -= 1;
                          }
                        });
                      },
                      child: SvgPicture.asset(
                        "assets/icons/Minus Icon.svg",
                        height: 30,
                        width: 30,
                      ),
                    ),
                    const SizedBox(
                      width: 20,
                    ),
                    Text("$quantity",
                        style: Theme.of(context).textTheme.bodyLarge),
                    const SizedBox(
                      width: 20,
                    ),
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          quantity += 1;
                        });
                      },
                      child: SvgPicture.asset(
                        "assets/icons/Add Icon.svg",
                        height: 30,
                        width: 30,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 15),
                ElevatedButton(
                  onPressed: () async {
                    final userId = AuthService.firebase().currentUser?.uid;
                    if (userId == null) {
                      Navigator.pushNamedAndRemoveUntil(
                          context, SignInScreen.routeName, (_) => false);
                    } else {
                      context.loaderOverlay.show();
                      await DBCartService().addItemToCart(product.id, quantity);
                      if (context.mounted) {
                        context.loaderOverlay.hide();
                        Navigator.pushNamed(context, CartScreen.routeName);
                      }
                    }
                  },
                  child: Text(AppLocalizations.of(context)!.add_to_cart),
                ),
              ])),
        )),
      ),
    );
  }
}

class ProductDetailsArguments {
  final DBProduct product;

  ProductDetailsArguments({required this.product});
}
