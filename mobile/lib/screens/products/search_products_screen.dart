import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/components/product_card.dart';
import 'package:shop_app/constants.dart';

import 'package:shop_app/services/crud/product/db_product_service.dart';
import '../../services/crud/product/db_product.dart';
import '../products_details/products_details_screen.dart';

class SearchProductsScreen extends StatefulWidget {
  final String searchString;
  const SearchProductsScreen({
    Key? key,
    required this.searchString,
  }) : super(key: key);

  static String routeName = "/search-products";

  @override
  State<SearchProductsScreen> createState() => _SearchProductsScreenState();
}

class _SearchProductsScreenState extends State<SearchProductsScreen> {
  late Future<List<DBProduct>> _productsList;

  @override
  void initState() {
    super.initState();
    _productsList =
        DBProductService().getProductListBySearchString(widget.searchString);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Search Result"),
      ),
      body: SafeArea(
          child: Expanded(
              child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 5),
        child: Container(
          color: grey,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: FutureBuilder(
                future: _productsList,
                builder: (context, snapshot) {
                  Logger().d(snapshot.data);
                  switch (snapshot.connectionState) {
                    case (ConnectionState.done):
                      if (snapshot.data!.isEmpty) {
                        return Container();
                      }
                      return GridView.builder(
                        itemCount: snapshot.data!.length,
                        gridDelegate:
                            const SliverGridDelegateWithMaxCrossAxisExtent(
                          maxCrossAxisExtent: 200,
                          childAspectRatio: 0.65,
                          mainAxisSpacing: 0,
                          crossAxisSpacing: 10,
                        ),
                        itemBuilder: (context, index) => ProductCard(
                          product: snapshot.data![index],
                          onPress: () => Navigator.pushNamed(
                            context,
                            ProductDetailsScreen.routeName,
                            arguments: ProductDetailsArguments(
                                product: snapshot.data![index]),
                          ),
                        ),
                      );
                    default:
                      return const Loading();
                  }
                }),
          ),
        ),
      ))),
    );
  }
}
