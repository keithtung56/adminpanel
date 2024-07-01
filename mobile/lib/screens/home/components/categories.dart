import 'package:flutter/material.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/screens/products/products_screen.dart';
import 'package:shop_app/services/crud/category/db_category.dart';
import 'package:shop_app/services/crud/category/db_category_service.dart';

class Categories extends StatefulWidget {
  const Categories({Key? key}) : super(key: key);

  @override
  State<Categories> createState() => _CategoriesState();
}

class _CategoriesState extends State<Categories> {
  late Future<List<DBCategory>> _categoryList;

  @override
  void initState() {
    super.initState();
    _categoryList = DBCategoryService().getCategoryList();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<DBCategory>>(
      future: _categoryList,
      builder: (context, snapshot) {
        switch (snapshot.connectionState) {
          case (ConnectionState.done):
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: GridView.builder(
                itemCount: snapshot.data!.length,
                shrinkWrap: true,
                gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                  maxCrossAxisExtent: 340,
                  childAspectRatio: 0.8,
                  mainAxisSpacing: 0,
                  crossAxisSpacing: 0,
                ),
                scrollDirection: Axis.vertical,
                physics: const NeverScrollableScrollPhysics(),
                itemBuilder: (context, index) => CategoryCard(
                  imgUrl: snapshot.data![index].imgUrl,
                  text: snapshot.data![index].categoryName,
                  press: () {
                    Navigator.pushNamed(context, ProductsScreen.routeName,
                        arguments: {
                          'categoryId': snapshot.data![index].id,
                          'categoryName': snapshot.data![index].categoryName,
                        });
                  },
                ),
              ),
            );
          default:
            return const Loading();
        }
      },
    );
  }
}

class CategoryCard extends StatelessWidget {
  const CategoryCard({
    Key? key,
    required this.imgUrl,
    required this.text,
    required this.press,
  }) : super(key: key);

  final String imgUrl, text;
  final GestureTapCallback press;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: press,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(0),
            height: 170,
            width: 170,
            decoration: BoxDecoration(
              color: grey,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Image.network(imgUrl),
          ),
          const SizedBox(height: 10),
          Text(text, textAlign: TextAlign.center)
        ],
      ),
    );
  }
}
