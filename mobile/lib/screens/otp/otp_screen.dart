import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:shop_app/components/form_error.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/screens/init_screen.dart';
import 'package:shop_app/screens/sign_in/sign_in_screen.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../../constants.dart';

class OtpScreen extends StatefulWidget {
  static String routeName = "/otp";

  const OtpScreen({super.key});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final List<String?> errors = [];
  late Future<void> _sendOtp;

  void addError({String? error}) {
    if (!errors.contains(error)) {
      setState(() {
        errors.add(error);
      });
    }
  }

  void removeError({String? error}) {
    if (errors.contains(error)) {
      setState(() {
        errors.remove(error);
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _sendOtp = AuthService.firebase().sendEmailVerification();
  }

  @override
  Widget build(BuildContext context) {
    final user = AuthService.firebase().currentUser;

    if (user == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.pushReplacementNamed(context, SignInScreen.routeName);
      });
    } else if (user.isEmailVerified) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.pushReplacementNamed(context, InitScreen.routeName);
      });
    }

    return Scaffold(
        backgroundColor: grey,
        appBar: AppBar(
          title: Text(AppLocalizations.of(context)!.otp),
        ),
        body: Expanded(
            child: Container(
          color: white,
          padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
          alignment: Alignment.center,
          width: double.infinity,
          child: FutureBuilder(
              future: _sendOtp,
              builder: (context, snapshot) {
                switch (snapshot.connectionState) {
                  case (ConnectionState.done):
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(AppLocalizations.of(context)!.sent_email_to),
                        Text(AuthService.firebase().currentUser!.email!),
                        Text(AppLocalizations.of(context)!.please_check_email),
                        Container(
                          alignment: Alignment.center,
                          child: FormError(errors: errors),
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: () async {
                            await FirebaseAuth.instance.currentUser!.reload();
                            if (AuthService.firebase()
                                    .currentUser!
                                    .isEmailVerified &&
                                context.mounted) {
                              Navigator.pushReplacementNamed(
                                  context, InitScreen.routeName);
                            } else {
                              if (context.mounted) {
                                addError(
                                    error: AppLocalizations.of(context)!
                                        .not_verified);
                              }
                            }
                          },
                          child:
                              Text(AppLocalizations.of(context)!.continue_text),
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: () async {
                            setState(() {
                              _sendOtp = AuthService.firebase()
                                  .sendEmailVerification();
                            });
                          },
                          child: Text(AppLocalizations.of(context)!.resend_opt),
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                            onPressed: () async {
                              await AuthService.firebase().logOut();
                              if (context.mounted) {
                                Navigator.pushReplacementNamed(
                                    context, SignInScreen.routeName);
                              }
                            },
                            child: Text(
                                AppLocalizations.of(context)!.back_to_login)),
                      ],
                    );
                  default:
                    return const Loading();
                }
              }),
        )));
  }
}
