import 'package:flutter/material.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/screens/my-orders/components/order_card.dart';
import 'package:shop_app/services/crud/order/db_order.dart';
import 'package:shop_app/services/crud/order/db_order_service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class MyOrdersScreen extends StatefulWidget {
  static String routeName = "/my_orders";

  const MyOrdersScreen({super.key});

  @override
  State<MyOrdersScreen> createState() => _MyOrdersScreenState();
}

class _MyOrdersScreenState extends State<MyOrdersScreen> {
  late Future<List<DBOrder>> _currentUserOrders;
  @override
  void initState() {
    super.initState();
    _currentUserOrders = DBOrderService().getCurrentUserOrders();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.my_orders),
      ),
      backgroundColor: grey,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
          child: FutureBuilder(
            future: _currentUserOrders,
            builder: (context, snapshot) {
              switch (snapshot.connectionState) {
                case ConnectionState.done:
                  return ListView.builder(
                    itemCount: snapshot.data!.length,
                    itemBuilder: (context, index) {
                      DBOrder order = snapshot.data![index];
                      return OrderCard(order: order);
                    },
                  );
                default:
                  return const Loading();
              }
            },
          ),
        ),
      ),
    );
  }
}
