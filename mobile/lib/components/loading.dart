import 'package:flutter/material.dart';

class Loading extends StatelessWidget {
  const Loading({super.key});

  @override
  Widget build(BuildContext context) {
    return const Expanded(
        child: SizedBox(
      width: double.infinity,
      child: Align(
        alignment: Alignment.center,
        child: CircularProgressIndicator(),
      ),
    ));
  }
}
