import 'package:flutter/material.dart';
import 'package:shop_app/components/product_card.dart';

import 'package:shop_app/services/crud/product/db_product_service.dart';
import '../../services/crud/product/db_product.dart';
import '../products_details/products_details_screen.dart';

class ProductsScreen extends StatefulWidget {
  final String categoryId;
  final String categoryName;
  const ProductsScreen(
      {Key? key, required this.categoryId, required this.categoryName})
      : super(key: key);

  static String routeName = "/products";

  @override
  State<ProductsScreen> createState() => _ProductsScreenState();
}

class _ProductsScreenState extends State<ProductsScreen> {
  late Future<List<DBProduct>> _productsList;
  @override
  void initState() {
    super.initState();
    _productsList =
        DBProductService().getProductListByCategoryId(widget.categoryId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.categoryName),
      ),
      body: SafeArea(
        child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: FutureBuilder(
                future: _productsList,
                builder: (context, snapshot) {
                  switch (snapshot.connectionState) {
                    case (ConnectionState.done):
                      return GridView.builder(
                        itemCount: snapshot.data!.length,
                        gridDelegate:
                            const SliverGridDelegateWithMaxCrossAxisExtent(
                          maxCrossAxisExtent: 200,
                          childAspectRatio: 0.7,
                          mainAxisSpacing: 20,
                          crossAxisSpacing: 16,
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
                      return const CircularProgressIndicator();
                  }
                })),
      ),
    );
  }
}
