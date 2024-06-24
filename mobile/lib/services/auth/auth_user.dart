import 'package:firebase_auth/firebase_auth.dart' show User;
import 'package:flutter/foundation.dart';

@immutable
class AuthUser {
  final bool isEmailVerified;
  final String uid;
  final String? email;
  const AuthUser(this.isEmailVerified, this.uid, this.email);

  factory AuthUser.fromFirebase(User user) =>
      AuthUser(user.emailVerified, user.uid, user.email);
}
