import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'package:logger/logger.dart';
import 'package:shop_app/services/auth/auth_exceptions.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/crud/cart/db_cart_service.dart';
import 'package:shop_app/services/crud/order/db_order_service.dart';

class StripeService {
  Map<String, dynamic>? paymentIntent;

  Future<void> stripeMakePayment({
    required String name,
    required String email,
    required String phone,
    required String city,
    required String country,
    required String line1,
    required String line2,
    required String postalCode,
    required String state,
  }) async {
    try {
      final cart = await DBCartService().getUserCart();
      paymentIntent = await createPaymentIntent("${cart.total}", 'HKD');
      final email = AuthService.firebase().currentUser!.email;
      if (email == null) {
        throw UserNotLoggedInAuthException;
      }
      await Stripe.instance
          .initPaymentSheet(
              paymentSheetParameters: SetupPaymentSheetParameters(
                  billingDetails: BillingDetails(
                      name: name,
                      email: email,
                      phone: phone,
                      address: Address(
                        city: city,
                        country: country,
                        line1: line1,
                        line2: line2,
                        postalCode: postalCode,
                        state: state,
                      )),
                  paymentIntentClientSecret: paymentIntent![
                      'client_secret'], //Gotten from payment intent
                  style: ThemeMode.dark,
                  merchantDisplayName: 'Ikay'))
          .then((value) {});

      //STEP 3: Display Payment sheet
      await displayPaymentSheet();
    } catch (e) {
      Logger().d(e.toString());
      Fluttertoast.showToast(msg: e.toString());
    }
  }

  displayPaymentSheet() async {
    try {
      // 3. display the payment sheet.
      await Stripe.instance.presentPaymentSheet();
      await DBOrderService().createOrder();
      Fluttertoast.showToast(msg: 'Payment succesfully completed');
    } on Exception catch (e) {
      Logger().d(e.toString());
      if (e is StripeException) {
        Fluttertoast.showToast(
            msg: 'Error from Stripe: ${e.error.localizedMessage}');
      } else {
        Fluttertoast.showToast(msg: 'Unforeseen error: $e');
      }
    }
  }

//create Payment
  createPaymentIntent(String amount, String currency) async {
    try {
      //Request body
      Map<String, dynamic> body = {
        'amount': calculateAmount(amount),
        'currency': currency,
        "confirmation_method": "automatic",
      };

      //Make post request to Stripe
      var response = await http.post(
        Uri.parse('https://api.stripe.com/v1/payment_intents'),
        headers: {
          'Authorization': 'Bearer ${dotenv.env['STRIPE_SECRET']}',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body,
      );
      return json.decode(response.body);
    } catch (err) {
      throw Exception(err.toString());
    }
  }

//calculate Amount
  calculateAmount(String amount) {
    final calculatedAmount = (double.parse(amount)) * 100;
    return calculatedAmount.toStringAsFixed(0);
  }
}
