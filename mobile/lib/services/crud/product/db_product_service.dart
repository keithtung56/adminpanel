import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:shop_app/services/crud/product/db_product.dart';

class DBProductService {
  Future<List<DBProduct>> getProductList() async {
    final snapshot = await FirebaseDatabase.instance.ref("Products").get();
    if (!snapshot.exists) {
      return [];
    }
    try {
      final val = snapshot.value as Map<dynamic, dynamic>;
      var productsList = await Future.wait(val.entries.map((e) async {
        final val = e.value;
        final imgId = val['img_id'];
        final imageUrl = await FirebaseStorage.instance
            .ref("Images/Products/$imgId")
            .getDownloadURL();

        final optionsObj = val['options'] as Map<dynamic, dynamic>;
        final options = val['options'] != null
            ? optionsObj.entries.map((e) {
                final optionName = e.key;
                final optionChoice = e.value;
                return {'optionName': optionName, 'optionChoice': optionChoice};
              }).toList()
            : [] as List<Map<dynamic, dynamic>>;
        return DBProduct(
          id: e.key,
          categoryId: val['category_id'],
          price: (val['price'] as num).toDouble(),
          stock: val['stock'],
          description: val['description'],
          productName: val['product_name'],
          createdTime: val['created_time'],
          modifiedTime: val['modified_time'],
          imgUrl: imageUrl,
          options: options,
        );
      }).toList());
      return productsList;
    } catch (_) {
      return [];
    }
  }

  Future<List<DBProduct>> getProductListByCategoryId(String categoryId) async {
    var productList = await getProductList();
    return productList
        .where((product) => product.categoryId == categoryId)
        .toList();
  }

  Future<List<DBProduct>> getProductListBySearchString(
      String searchString) async {
    var productList = await getProductList();
    return productList
        .where((product) => product.productName
            .toLowerCase()
            .contains(searchString.toLowerCase()))
        .toList();
  }

  Future<DBProduct> getProductById(String id) async {
    final snapshot = await FirebaseDatabase.instance.ref("Products/$id").get();
    if (!snapshot.exists) {
      throw ProductNotFound;
    }
    final val = snapshot.value as Map<dynamic, dynamic>;
    final imgId = val['img_id'];
    final imageUrl = await FirebaseStorage.instance
        .ref("Images/Products/$imgId")
        .getDownloadURL();
    final optionsObj = val['options'] as Map<dynamic, dynamic>;
    final options = val['options'] != null
        ? optionsObj.entries.map((e) {
            final optionName = e.key;
            final optionChoice = e.value;
            return {'optionName': optionName, 'optionChoice': optionChoice};
          }).toList()
        : [] as List<Map<dynamic, dynamic>>;

    return DBProduct(
      id: id,
      categoryId: val['category_id'],
      price: (val['price'] as num).toDouble(),
      stock: val['stock'],
      description: val['description'],
      productName: val['product_name'],
      createdTime: val['created_time'],
      modifiedTime: val['modified_time'],
      imgUrl: imageUrl,
      options: options,
    );
  }
}

class ProductNotFound implements Exception {}
