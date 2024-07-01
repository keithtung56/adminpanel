import 'package:flutter/widgets.dart';
import 'package:shop_app/screens/cart/cart_screen.dart';
import 'package:shop_app/screens/language/language_screen.dart';
import 'package:shop_app/screens/my-account/my_account_screen.dart';
import 'package:shop_app/screens/order_details/order_details_screen.dart';
import 'package:shop_app/screens/my-orders/my_orders_screen.dart';
import 'package:shop_app/screens/payment/payment_screen.dart';
import 'package:shop_app/screens/products/products_screen.dart';
import 'package:shop_app/screens/products/search_products_screen.dart';
import 'package:shop_app/screens/settings/settings_screen.dart';
import 'package:shop_app/screens/video/video_screen.dart';
import 'screens/products_details/products_details_screen.dart';
import 'screens/forgot_password/forgot_password_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/init_screen.dart';
import 'screens/otp/otp_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/sign_in/sign_in_screen.dart';
import 'screens/sign_up/sign_up_screen.dart';

// We use name route
// All our routes will be available here
final Map<String, WidgetBuilder> routes = {
  InitScreen.routeName: (context) => const InitScreen(),
  SignInScreen.routeName: (context) => const SignInScreen(),
  SignUpScreen.routeName: (context) => const SignUpScreen(),
  ForgotPasswordScreen.routeName: (context) => const ForgotPasswordScreen(),
  OtpScreen.routeName: (context) => const OtpScreen(),
  HomeScreen.routeName: (context) => const HomeScreen(),
  CartScreen.routeName: (context) => const CartScreen(),
  ProfileScreen.routeName: (context) => const ProfileScreen(),
  MyAccountScreen.routeName: (context) => const MyAccountScreen(),
  PaymentScreen.routeName: (context) => const PaymentScreen(),
  MyOrdersScreen.routeName: (context) => const MyOrdersScreen(),
  SettingsScreen.routeName: (context) => const SettingsScreen(),
  LanguageScreen.routeName: (context) => const LanguageScreen(),
  VideoScreen.routeName: (context) => const VideoScreen(),
  ProductsScreen.routeName: (context) {
    final args =
        ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>;
    return ProductsScreen(
      categoryId: args['categoryId'],
      categoryName: args['categoryName'],
    );
  },
  SearchProductsScreen.routeName: (context) {
    final args =
        ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>;
    return SearchProductsScreen(
      searchString: args['searchString'],
    );
  },
  ProductDetailsScreen.routeName: (context) {
    return const ProductDetailsScreen();
  },
  OrderProductDetailsScreen.routeName: (context) {
    final args =
        ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>;
    return OrderProductDetailsScreen(
      order: args['order'],
    );
  },
};
