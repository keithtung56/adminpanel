// File generated by FlutterFire CLI.
// ignore_for_file: type=lint
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      throw UnsupportedError(
        'DefaultFirebaseOptions have not been configured for web - '
        'you can reconfigure this by running the FlutterFire CLI again.',
      );
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for macos - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyBmFFYkz6pyznrGclQuHdoNvpZdkLV1ygo',
    appId: '1:714031355581:android:af1c31d1e5391c65f249d4',
    messagingSenderId: '714031355581',
    projectId: 'e-commerce-app-3c455',
    databaseURL: 'https://e-commerce-app-3c455-default-rtdb.asia-southeast1.firebasedatabase.app',
    storageBucket: 'e-commerce-app-3c455.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyBhTkkWAdPVfo_qJDBEn1yFACiazKcz3AY',
    appId: '1:714031355581:ios:4de9bcbecd6f9b11f249d4',
    messagingSenderId: '714031355581',
    projectId: 'e-commerce-app-3c455',
    databaseURL: 'https://e-commerce-app-3c455-default-rtdb.asia-southeast1.firebasedatabase.app',
    storageBucket: 'e-commerce-app-3c455.appspot.com',
    iosClientId: '714031355581-sgmmnq13j405tr9agqr02r3dhrk09a84.apps.googleusercontent.com',
    iosBundleId: 'com.example.demoApp',
  );

}