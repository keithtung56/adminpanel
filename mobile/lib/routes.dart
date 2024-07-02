import 'package:flutter/widgets.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:shop_app/auth_middle_ware.dart';
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
import 'package:shop_app/screens/video_upload/video_upload_screen.dart';
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
  InitScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: InitScreen())),
  SignInScreen.routeName: (context) =>
      const LoaderOverlay(child: SignInScreen()),
  SignUpScreen.routeName: (context) =>
      const LoaderOverlay(child: SignUpScreen()),
  ForgotPasswordScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: ForgotPasswordScreen())),
  OtpScreen.routeName: (context) => const LoaderOverlay(child: OtpScreen()),
  HomeScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: HomeScreen())),
  CartScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: CartScreen())),
  ProfileScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: ProfileScreen())),
  MyAccountScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: MyAccountScreen())),
  PaymentScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: PaymentScreen())),
  MyOrdersScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: MyOrdersScreen())),
  SettingsScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: SettingsScreen())),
  LanguageScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: LanguageScreen())),
  VideoScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: VideoScreen())),
  VideoUploadScreen.routeName: (context) =>
      const LoaderOverlay(child: AuthMiddleware(child: VideoUploadScreen())),
  ProductsScreen.routeName: (context) {
    final args =
        ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>;
    return LoaderOverlay(
        child: AuthMiddleware(
      child: ProductsScreen(
        categoryId: args['categoryId'],
        categoryName: args['categoryName'],
      ),
    ));
  },
  SearchProductsScreen.routeName: (context) {
    final args =
        ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>;
    return LoaderOverlay(
        child: AuthMiddleware(
      child: SearchProductsScreen(
        searchString: args['searchString'],
      ),
    ));
  },
  ProductDetailsScreen.routeName: (context) {
    return const LoaderOverlay(
        child: AuthMiddleware(child: ProductDetailsScreen()));
  },
  OrderProductDetailsScreen.routeName: (context) {
    final args =
        ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>;
    return LoaderOverlay(
        child: AuthMiddleware(
      child: OrderProductDetailsScreen(
        order: args['order'],
      ),
    ));
  },
};
