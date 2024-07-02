import 'package:flutter/material.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/components/product_card.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/services/crud/favorite/db_favorite.dart';
import 'package:shop_app/services/crud/favorite/db_favorite_service.dart';
import 'package:shop_app/services/crud/product/db_product.dart';
import 'package:shop_app/services/crud/product/db_product_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../products_details/products_details_screen.dart';

class FavoriteScreen extends StatefulWidget {
  const FavoriteScreen({super.key});

  @override
  State<FavoriteScreen> createState() => _FavoriteScreenState();
}

class _FavoriteScreenState extends State<FavoriteScreen> {
  late Future<DBFavorite> _userFavorite;
  @override
  void initState() {
    super.initState();
    _userFavorite = DBFavoriteService().getCurrentUserFavoriteList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: grey,
      body: SafeArea(
        child: Column(
          children: [
            Container(
              width: double.infinity,
              color: white,
              padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 10),
              child: Text(
                AppLocalizations.of(context)!.favorites,
                style: headingStyle,
                textAlign: TextAlign.center,
              ),
            ),
            Expanded(
              child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                  child: FutureBuilder(
                      future: _userFavorite,
                      builder: (context, snapshot) {
                        switch (snapshot.connectionState) {
                          case (ConnectionState.done):
                            return GridView.builder(
                                itemCount:
                                    snapshot.data!.favoriteProductsId.length,
                                gridDelegate:
                                    const SliverGridDelegateWithMaxCrossAxisExtent(
                                  maxCrossAxisExtent: 200,
                                  childAspectRatio: 0.7,
                                  mainAxisSpacing: 20,
                                  crossAxisSpacing: 16,
                                ),
                                itemBuilder: (context, index) => FutureBuilder(
                                    future: DBProductService().getProductById(
                                        snapshot
                                            .data!.favoriteProductsId[index]),
                                    builder: (context, snapshot2) {
                                      switch (snapshot2.connectionState) {
                                        case (ConnectionState.done):
                                          if (snapshot2.data != null) {
                                            return ProductCard(
                                              product:
                                                  snapshot2.data as DBProduct,
                                              onPress: () =>
                                                  Navigator.pushNamed(
                                                context,
                                                ProductDetailsScreen.routeName,
                                                arguments:
                                                    ProductDetailsArguments(
                                                        product: snapshot2.data
                                                            as DBProduct),
                                              ),
                                            );
                                          }
                                          return const Loading();
                                        default:
                                          return const Loading();
                                      }
                                    }));
                          default:
                            return const Loading();
                        }
                      })),
            )
          ],
        ),
      ),
    );
  }
}
