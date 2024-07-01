import 'package:flutter/material.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/screens/my-account/my_account_screen.dart';
import 'package:shop_app/screens/my-orders/my_orders_screen.dart';
import 'package:shop_app/screens/settings/settings_screen.dart';
import 'package:shop_app/screens/sign_in/sign_in_screen.dart';
import 'package:shop_app/services/auth/auth_exceptions.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/crud/user/db_user.dart';
import 'package:shop_app/services/crud/user/db_user_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'components/profile_menu.dart';
import 'components/profile_pic.dart';

class ProfileScreen extends StatefulWidget {
  static String routeName = "/profile";

  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late Future<DBUser?> _currentUser;
  @override
  void initState() {
    super.initState();
    _currentUser = DBUserService().getCurrentDBUser();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: grey,
        body: SafeArea(
            child: Column(
          children: [
            Container(
              color: white,
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 10),
              child: Text(
                AppLocalizations.of(context)!.profile,
                style: headingStyle,
                textAlign: TextAlign.center,
              ),
            ),
            Expanded(
                child: Container(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
              child: FutureBuilder(
                  future: _currentUser,
                  builder: (context, snapshot) {
                    switch (snapshot.connectionState) {
                      case (ConnectionState.done):
                        if (snapshot.hasError) {
                          if (snapshot.error == UserNotLoggedInAuthException) {
                            WidgetsBinding.instance
                                .addPostFrameCallback((callback) {
                              if (context.mounted) {
                                Navigator.pushReplacementNamed(
                                    context, SignInScreen.routeName);
                              }
                            });

                            return const Loading();
                          }
                        }
                        return SingleChildScrollView(
                            padding: const EdgeInsets.symmetric(
                                vertical: 20, horizontal: 10),
                            child: Column(
                              children: [
                                Container(
                                    color: white,
                                    width: double.infinity,
                                    padding: const EdgeInsets.symmetric(
                                        horizontal: 0, vertical: 20),
                                    child: Column(
                                      children: [
                                        const Align(
                                          alignment: Alignment.center,
                                          child: ProfilePic(),
                                        ),
                                        const SizedBox(height: 20),
                                        Text(
                                          snapshot.data!.username,
                                          style: const TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      ],
                                    )),
                                const SizedBox(height: 20),
                                ProfileMenu(
                                  text:
                                      AppLocalizations.of(context)!.my_account,
                                  icon: "assets/icons/User Icon.svg",
                                  press: () => {
                                    Navigator.pushNamed(
                                        context, MyAccountScreen.routeName)
                                  },
                                ),
                                ProfileMenu(
                                  text: AppLocalizations.of(context)!.my_orders,
                                  icon: "assets/icons/Shop Icon.svg",
                                  press: () {
                                    Navigator.pushNamed(
                                        context, MyOrdersScreen.routeName);
                                  },
                                ),
                                ProfileMenu(
                                  text: AppLocalizations.of(context)!.settings,
                                  icon: "assets/icons/Settings.svg",
                                  press: () {
                                    Navigator.pushNamed(
                                        context, SettingsScreen.routeName);
                                  },
                                ),
                                ProfileMenu(
                                  text: AppLocalizations.of(context)!.logout,
                                  icon: "assets/icons/Log out.svg",
                                  press: () async {
                                    await AuthService.firebase().logOut();
                                    if (context.mounted) {
                                      Navigator.pushNamedAndRemoveUntil(context,
                                          SignInScreen.routeName, (_) => true);
                                    }
                                  },
                                ),
                              ],
                            ));
                      default:
                        return const Loading();
                    }
                  }),
            ))
          ],
        )));
  }
}
