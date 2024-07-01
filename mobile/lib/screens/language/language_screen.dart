import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/l10n/bloc/language_cubit.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:shop_app/screens/language/components/language_menu.dart';
import 'package:shop_app/services/language/language_preferences.dart';

const Color inActiveIconColor = Color(0xFFB6B6B6);

class LanguageScreen extends StatefulWidget {
  const LanguageScreen({super.key});

  static String routeName = "/language";

  @override
  State<LanguageScreen> createState() => _LanguageScreenState();
}

class _LanguageScreenState extends State<LanguageScreen> {
  @override
  Widget build(BuildContext context) {
    List<Map<String, dynamic>> choices = [
      {
        'text': "繁體中文",
        'press': () async {
          BlocProvider.of<LanguageCubit>(context)
              .selectLanguage(const Locale('zh'));
          LanguagePreference.saveUserLanguagePreference('zh');
        }
      },
      {
        'text': "English",
        'press': () async {
          BlocProvider.of<LanguageCubit>(context)
              .selectLanguage(const Locale('en'));
          LanguagePreference.saveUserLanguagePreference('en');
        }
      },
    ];
    return Scaffold(
        appBar: AppBar(title: Text(AppLocalizations.of(context)!.language)),
        body: Expanded(
            child: Container(
                color: grey,
                child: Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 0, vertical: 10),
                  child: ListView.builder(
                      itemCount: choices.length,
                      itemBuilder: (context, index) => LanguageMenu(
                            text: choices[index]['text']!,
                            press: choices[index]['press']!,
                          )),
                )))

        // ListView.builder(
        //     itemCount: choices.length,
        //     itemBuilder: (context, index) => Padding(
        //           padding:
        //               const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
        //           child: TextButton(
        //             style: TextButton.styleFrom(
        //               foregroundColor: kPrimaryColor,
        //               padding: const EdgeInsets.all(20),
        //               shape: RoundedRectangleBorder(
        //                   borderRadius: BorderRadius.circular(15)),
        //               backgroundColor: const Color(0xFFF5F6F9),
        //             ),
        //             onPressed: () {
        //               (choices[index]['function'] as Function)();
        //             },
        //             child: Row(
        //               children: [
        //                 const SizedBox(width: 20),
        //                 Expanded(child: Text(choices[index]['text'] as String)),
        //               ],
        //             ),
        //           ),
        //         ))

        );
  }
}
