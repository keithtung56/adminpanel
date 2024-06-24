import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:shop_app/components/product_card.dart';
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
      body: SafeArea(
        child: Column(
          children: [
            Text(
              AppLocalizations.of(context)!.favorites,
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 20),
            FutureBuilder(
                future: _userFavorite,
                builder: (context, snapshot) {
                  switch (snapshot.connectionState) {
                    case (ConnectionState.done):
                      return Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: GridView.builder(
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
                                      snapshot.data!.favoriteProductsId[index]),
                                  builder: (context, snapshot2) {
                                    switch (snapshot2.connectionState) {
                                      case (ConnectionState.done):
                                        if (snapshot2.data != null) {
                                          Logger().d(snapshot2.data);
                                          return ProductCard(
                                            product:
                                                snapshot2.data as DBProduct,
                                            onPress: () => Navigator.pushNamed(
                                              context,
                                              ProductDetailsScreen.routeName,
                                              arguments:
                                                  ProductDetailsArguments(
                                                      product: snapshot2.data
                                                          as DBProduct),
                                            ),
                                          );
                                        }
                                        return const Center(
                                          child: CircularProgressIndicator(),
                                        );
                                      default:
                                        return const Center(
                                          child: CircularProgressIndicator(),
                                        );
                                    }
                                  })),
                        ),
                      );
                    default:
                      return const Center(
                        child: CircularProgressIndicator(),
                      );
                  }
                })
          ],
        ),
      ),
    );
  }
}
