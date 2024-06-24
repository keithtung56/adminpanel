import 'package:flutter/material.dart';
import 'package:shop_app/screens/my-account/components/my_account_form.dart';
import 'package:shop_app/screens/sign_in/sign_in_screen.dart';
import 'package:shop_app/services/crud/user/db_user.dart';
import 'package:shop_app/services/crud/user/db_user_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../../constants.dart';

class MyAccountScreen extends StatefulWidget {
  static String routeName = "/my_account";

  const MyAccountScreen({super.key});

  @override
  State<MyAccountScreen> createState() => _MyAccountScreenState();
}

class _MyAccountScreenState extends State<MyAccountScreen> {
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
          title: Text(AppLocalizations.of(context)!.my_account),
        ),
        body: FutureBuilder(
            future: _currentUser,
            builder: (context, snapshot) {
              switch (snapshot.connectionState) {
                case (ConnectionState.done):
                  var currentUser = snapshot.data;
                  if (currentUser == null) {
                    Navigator.pushNamedAndRemoveUntil(
                        context, SignInScreen.routeName, (_) => true);
                  } else {
                    return SafeArea(
                      child: SizedBox(
                        width: double.infinity,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: SingleChildScrollView(
                            child: Column(
                              children: [
                                const SizedBox(height: 16),
                                Text(AppLocalizations.of(context)!.profile,
                                    style: headingStyle),
                                const SizedBox(height: 16),
                                MyAccountForm(currentUser: currentUser),
                                const SizedBox(height: 30),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  }

                  return const CircularProgressIndicator();

                default:
                  return const CircularProgressIndicator();
              }
            }));
  }
}
