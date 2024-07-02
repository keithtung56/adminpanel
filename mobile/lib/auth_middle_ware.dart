import 'package:flutter/widgets.dart';
import 'package:shop_app/screens/otp/otp_screen.dart';
import 'package:shop_app/screens/sign_in/sign_in_screen.dart';
import 'package:shop_app/services/auth/auth_service.dart';

class AuthMiddleware extends StatelessWidget {
  final Widget child;

  const AuthMiddleware({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final user = AuthService.firebase().currentUser;

    if (user == null) {
      // If the user is not logged in, navigate to SignInScreen.
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.pushReplacementNamed(context, SignInScreen.routeName);
      });
    } else if (!user.isEmailVerified) {
      // If the user is logged in but not verified, navigate to OtpScreen.
      WidgetsBinding.instance.addPostFrameCallback((_) {
        Navigator.pushReplacementNamed(context, OtpScreen.routeName);
      });
    }

    // If the user is logged in and verified, display the child widget.
    return child;
  }
}
