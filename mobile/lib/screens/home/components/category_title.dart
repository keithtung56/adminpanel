import 'package:flutter/material.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:shop_app/constants.dart';

class CategoryTitle extends StatelessWidget {
  const CategoryTitle({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.all(20),
      padding: const EdgeInsets.symmetric(
        horizontal: 20,
        vertical: 16,
      ),
      decoration: BoxDecoration(
        color: const Color(0xFF4A3298),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text.rich(
        TextSpan(
          style: const TextStyle(color: white),
          children: [
            TextSpan(
              text: AppLocalizations.of(context)!.categories_title,
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
