import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:shop_app/constants.dart';

import 'components/categories.dart';
import 'components/category_title.dart';
import 'components/home_header.dart';

class HomeScreen extends StatelessWidget {
  static String routeName = "/home";

  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: grey,
        body: SafeArea(
          child: CustomScrollView(
            slivers: [
              const SliverAppBar(
                pinned: true,
                flexibleSpace: Padding(
                  padding: EdgeInsets.symmetric(vertical: 5),
                  child: HomeHeader(),
                ), // Your HomeHeader widget
              ),
              SliverList(
                delegate: SliverChildListDelegate(
                  [
                    const Expanded(
                      child: Column(
                        children: [
                          CategoryTitle(),
                          Categories(),
                        ],
                      ),
                    )
                  ],
                ),
              ),
            ],
          ),
        ));
  }
}
