import 'package:flutter/material.dart';
import 'package:shop_app/screens/my-account/my_account_screen.dart';
import 'package:shop_app/screens/my-orders/my_orders_screen.dart';
import 'package:shop_app/screens/settings/settings_screen.dart';
import 'package:shop_app/screens/sign_in/sign_in_screen.dart';
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
        appBar: AppBar(
          title: Text(AppLocalizations.of(context)!.profile),
        ),
        body: FutureBuilder(
            future: _currentUser,
            builder: (context, snapshot) {
              switch (snapshot.connectionState) {
                case (ConnectionState.done):
                  return SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(vertical: 20),
                    child: Column(
                      children: [
                        const ProfilePic(),
                        const SizedBox(height: 20),
                        Text(
                          snapshot.data!.username,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 20),
                        ProfileMenu(
                          text: AppLocalizations.of(context)!.my_account,
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
                        // ProfileMenu(
                        //   text: "Help Center",
                        //   icon: "assets/icons/Question mark.svg",
                        //   press: () {},
                        // ),
                        ProfileMenu(
                          text: AppLocalizations.of(context)!.logout,
                          icon: "assets/icons/Log out.svg",
                          press: () async {
                            await AuthService.firebase().logOut();
                            if (context.mounted) {
                              Navigator.pushNamedAndRemoveUntil(
                                  context, SignInScreen.routeName, (_) => true);
                            }
                          },
                        ),
                      ],
                    ),
                  );
                default:
                  return const CircularProgressIndicator();
              }
            }));
  }
}
