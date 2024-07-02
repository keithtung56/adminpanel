import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/screens/init_screen.dart';
import 'package:shop_app/screens/sign_in/sign_in_screen.dart';
import 'package:shop_app/services/auth/auth_service.dart';

import '../../constants.dart';

class OtpScreen extends StatelessWidget {
  static String routeName = "/otp";

  const OtpScreen({super.key});
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
          title: const Text("OTP Verification"),
        ),
        body: Expanded(
            child: Container(
          color: white,
          padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 10),
          alignment: Alignment.center,
          width: double.infinity,
          child: FutureBuilder(
              future: AuthService.firebase().sendEmailVerification(),
              builder: (context, snapshot) {
                switch (snapshot.connectionState) {
                  case (ConnectionState.done):
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('We\'hv sent you a email, please check'),
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
                            }
                          },
                          child: const Text('Continue'),
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
                            child: const Text('Back to Login')),
                      ],
                    );
                  default:
                    return const Loading();
                }
              }),
        )));
  }
}
