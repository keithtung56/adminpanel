import 'package:firebase_database/firebase_database.dart';
import 'package:logger/logger.dart';
import 'package:moment_dart/moment_dart.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/services/auth/auth_exceptions.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/crud/user/db_user.dart';

class DBUserService {
  Future<void> createDBUser({
    required String uid,
    required String email,
    required String password,
    required String username,
    required String gender,
    required int age,
  }) async {
    await FirebaseDatabase.instance.ref("Users/$uid").set({
      'email': email,
      'password': password,
      'username': username,
      'age': age,
      'gender': gender,
      'created_time': Moment.now().format(dateDBFormat),
      'modified_time': Moment.now().format(dateDBFormat),
    });
  }

  Future<DBUser> getDBUserByUid(String uid) async {
    final snapshot = await FirebaseDatabase.instance.ref("Users/$uid").get();
    if (!snapshot.exists) {
      throw UserNotFound();
    }
    final val = snapshot.value as Map<dynamic, dynamic>;
    List<String> ordersId = [];

    if (val['orders'] != null) {
      var orders = val['orders'] as Map<dynamic, dynamic>;
      ordersId = orders.entries.map((e) => e.key as String).toList();
    }

    Logger().d(ordersId);
    return DBUser(
      uid: uid,
      email: val['email'],
      password: val['password'],
      username: val['username'],
      gender: val['gender'],
      age: val['age'],
      createdTime: val['created_time'],
      modifiedTime: val['modified_time'],
      ordersId: ordersId,
    );
  }

  Future<DBUser> getCurrentDBUser() async {
    var currentUser = AuthService.firebase().currentUser;
    if (currentUser == null) {
      throw UserNotLoggedInAuthException;
    }
    var uid = currentUser.uid;
    return await getDBUserByUid(uid);
  }

  Future<void> updateDBUser(String username, int age, String gender) async {
    var currentUser = AuthService.firebase().currentUser;
    if (currentUser == null) {
      throw UserNotLoggedInAuthException;
    }
    var uid = currentUser.uid;
    await FirebaseDatabase.instance
        .ref("Users/$uid")
        .update({'username': username, 'age': age, 'gender': gender});
  }
}

class UserNotFound implements Exception {}
