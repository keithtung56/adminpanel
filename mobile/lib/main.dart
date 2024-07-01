import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/l10n/bloc/language_cubit.dart';
import 'package:shop_app/screens/init_screen.dart';
import 'package:shop_app/screens/sign_in/sign_in_screen.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/language/language_preferences.dart';
import 'routes.dart';
import 'theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  Stripe.publishableKey =
      "pk_test_51PSyNf083RgJSgD2RI9x35ZftuEMsmKkQGtX5FDijDbUBCxkxaFm4jcEnP750ZIrJFDTxHERXE6huwYWJFcQp9xx00sleqDDQe";
  await dotenv.load(fileName: "assets/.env");
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return FutureBuilder(
        future: AuthService.firebase().initialize(),
        builder: (context, snapshot) {
          switch (snapshot.connectionState) {
            case ConnectionState.done:
              var initRoute = SignInScreen.routeName;
              if (AuthService.firebase().currentUser != null) {
                initRoute = InitScreen.routeName;
              }
              return FutureBuilder(
                  future: LanguagePreference.getUserLanguagePreference(),
                  builder: (context, snapshot) {
                    switch (snapshot.connectionState) {
                      case ConnectionState.done:
                        return BlocProvider(
                          create: (context) =>
                              LanguageCubit(Locale(snapshot.data!)),
                          child: BlocBuilder<LanguageCubit, Locale>(
                              builder: (context, locale) {
                            return MaterialApp(
                              locale: locale,
                              debugShowCheckedModeBanner: false,
                              title: 'The Flutter Way - Template',
                              localizationsDelegates:
                                  AppLocalizations.localizationsDelegates,
                              supportedLocales:
                                  AppLocalizations.supportedLocales,
                              theme: AppTheme.lightTheme(context),
                              initialRoute: initRoute,
                              routes: routes,
                            );
                          }),
                        );
                      default:
                        return const MaterialApp(
                            home: Scaffold(
                          body: Loading(),
                        ));
                    }
                  });
            default:
              return const MaterialApp(
                  home: Scaffold(
                body: Loading(),
              ));
          }
        });
  }
}
