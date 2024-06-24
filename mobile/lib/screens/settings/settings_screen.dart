import 'package:flutter/material.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/screens/language/language_screen.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

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
        body: ListView.builder(
            itemCount: choices.length,
            itemBuilder: (context, index) => Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                  child: TextButton(
                    style: TextButton.styleFrom(
                      foregroundColor: kPrimaryColor,
                      padding: const EdgeInsets.all(20),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15)),
                      backgroundColor: const Color(0xFFF5F6F9),
                    ),
                    onPressed: () {
                      Navigator.pushNamed(context, choices[index]['page']!);
                    },
                    child: Row(
                      children: [
                        const SizedBox(width: 20),
                        Expanded(child: Text(choices[index]['text']!)),
                        const Icon(Icons.arrow_forward_ios),
                      ],
                    ),
                  ),
                )));
  }
}
