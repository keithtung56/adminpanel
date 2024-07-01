import 'package:flutter/material.dart';
import '../../../constants.dart';

class LanguageMenu extends StatelessWidget {
  const LanguageMenu({
    Key? key,
    required this.text,
    required this.press,
  }) : super(key: key);

  final String text;
  final VoidCallback? press;
  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
        child: TextButton(
            style: TextButton.styleFrom(
              side: const BorderSide(
                color: grey,
                width: 1,
              ),
              backgroundColor: const Color.fromARGB(255, 255, 255, 255),
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(0),
                  bottomRight: Radius.circular(0),
                ),
              ),
            ),
            onPressed: press,
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Row(
                children: [
                  const SizedBox(width: 20),
                  Expanded(
                      child: Text(
                    text,
                    style: const TextStyle(color: black),
                  )),
                ],
              ),
            )));
  }
}
