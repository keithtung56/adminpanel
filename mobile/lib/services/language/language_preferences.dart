import 'package:shared_preferences/shared_preferences.dart';

class LanguagePreference {
  static Future<void> saveUserLanguagePreference(String language) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString('language', language);
  }

  static Future<String> getUserLanguagePreference() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String language = prefs.getString('language') ??
        'en'; // default to 'en' if no preference is saved

    return language;
  }
}
