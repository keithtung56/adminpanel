import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:shop_app/services/crud/category/db_category.dart';

class DBCategoryService {
  Future<List<DBCategory>> getCategoryList() async {
    final snapshot = await FirebaseDatabase.instance.ref("Categories").get();
    if (snapshot.exists) {
      final val = snapshot.value as Map<dynamic, dynamic>;
      var categoriesList = await Future.wait(val.entries.map((e) async {
        final val = e.value;
        final imgId = val['img_id'];

        final imageUrl = await FirebaseStorage.instance
            .ref("Images/Categories/$imgId")
            .getDownloadURL();
        return DBCategory(
          id: e.key,
          categoryName: val['category_name'],
          createdTime: val['created_time'],
          modifiedTime: val['modified_time'],
          imgUrl: imageUrl,
        );
      }).toList());

      return categoriesList;
    }
    return [];
  }

  Future<DBCategory> getCategoryById(String id) async {
    final snapshot =
        await FirebaseDatabase.instance.ref("Categories/$id").get();
    if (!snapshot.exists) {
      throw CategoryNotFound();
    }
    final val = snapshot.value as Map<dynamic, dynamic>;
    final imgId = val['img_id'];
    final imageUrl = await FirebaseStorage.instance
        .ref("Images/Categories/$imgId")
        .getDownloadURL();
    return DBCategory(
      id: id,
      categoryName: val['category_name'],
      createdTime: val['created_time'],
      modifiedTime: val['modified_time'],
      imgUrl: imageUrl,
    );
  }
}

class CategoryNotFound implements Exception {}
