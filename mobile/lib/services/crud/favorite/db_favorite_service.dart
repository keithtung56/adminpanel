import 'package:firebase_database/firebase_database.dart';
import 'package:logger/logger.dart';
import 'package:shop_app/services/auth/auth_exceptions.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/crud/favorite/db_favorite.dart';

class DBFavoriteService {
  Future<DBFavorite> getCurrentUserFavoriteList() async {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      throw UserNotLoggedInAuthException();
    }
    final snapshot =
        await FirebaseDatabase.instance.ref("Favorites/$userId").get();

    if (snapshot.exists) {
      final val = snapshot.value as Map<dynamic, dynamic>;

      var favoriteProductsId = val.keys.map((e) => e.toString()).toList();
      Logger().d('getCurrentUserFavoriteList finish');
      return DBFavorite(userId: userId, favoriteProductsId: favoriteProductsId);
    }
    Logger().d('getCurrentUserFavoriteList finish');
    return DBFavorite(userId: userId, favoriteProductsId: []);
  }

  Stream<DBFavorite?> getCurrentUserFavoriteListStream() {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      throw UserNotLoggedInAuthException();
    }

    return FirebaseDatabase.instance
        .ref("Favorites/$userId")
        .onValue
        .map((event) {
      if (event.snapshot.exists) {
        final val = event.snapshot.value as Map<dynamic, dynamic>;
        var favoriteProductsId = val.keys.map((e) => e.toString()).toList();
        return DBFavorite(
            userId: userId, favoriteProductsId: favoriteProductsId);
      }
      return DBFavorite(userId: userId, favoriteProductsId: []);
    });
  }

  Future<void> addCurrentUserFavorite(String productId) async {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      throw UserNotLoggedInAuthException();
    }
    await FirebaseDatabase.instance.ref("Favorites/$userId/").update({
      productId: '',
    });
  }

  Future<void> removeCurrentUserFavorite(String productId) async {
    final userId = AuthService.firebase().currentUser?.uid;
    if (userId == null) {
      throw UserNotLoggedInAuthException();
    }
    await FirebaseDatabase.instance.ref("Favorites/$userId/").update({
      productId: {},
    });
  }

  Future<bool> productIsFavorite(String productId) async {
    final favoriteList = await getCurrentUserFavoriteList();
    return favoriteList.favoriteProductsId.any((id) => id == productId);
  }
}
