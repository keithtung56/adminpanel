import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shop_app/screens/cart/cart_screen.dart';
import 'package:shop_app/screens/products_details/components/product_images.dart';
import 'package:shop_app/screens/sign_in/sign_in_screen.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/crud/cart/db_cart_service.dart';
import 'package:shop_app/services/crud/product/db_product.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'components/product_description.dart';
import 'components/top_rounded_container.dart';

class ProductDetailsScreen extends StatefulWidget {
  static String routeName = "/details";

  const ProductDetailsScreen({super.key});

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
      backgroundColor: const Color(0xFFF5F6F9),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
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
        actions: [
          Row(
            children: [
              Container(
                margin: const EdgeInsets.only(right: 20),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Row(
                  children: [
                    const Text(
                      "4.7",
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.black,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(width: 4),
                    SvgPicture.asset("assets/icons/Star Icon.svg"),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: ListView(
        children: [
          ProductImages(product: product),
          TopRoundedContainer(
            color: Colors.white,
            child: Column(
              children: [
                ProductDescription(
                  product: product,
                ),
                const TopRoundedContainer(
                  color: Color(0xFFF6F7F9),
                  child: Column(
                    children: [
                      // ColorDots(product: product),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: TopRoundedContainer(
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
                          quantity -= 1;
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
                          context, SignInScreen.routeName, (_) => true);
                    } else {
                      await DBCartService().addItemToCart(product.id, quantity);
                      if (context.mounted) {
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
