import 'package:flutter/material.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/screens/language/language_screen.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:shop_app/screens/settings/components/setting_menu.dart';

const Color inActiveIconColor = Color(0xFFB6B6B6);

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  static String routeName = "/settings";

  @override
  Widget build(BuildContext context) {
    var choices = [
      {
        'text': AppLocalizations.of(context)!.language,
        'page': LanguageScreen.routeName
      },
    ];
    return Scaffold(
        appBar: AppBar(title: Text(AppLocalizations.of(context)!.settings)),
        body: Expanded(
            child: Container(
                color: grey,
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 5, vertical: 10),
                  child: ListView.builder(
                      itemCount: choices.length,
                      itemBuilder: (context, index) => SettingMenu(
                            text: choices[index]['text']!,
                            link: choices[index]['page']!,
                          )),
                ))));
  }
}
