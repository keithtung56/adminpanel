import 'package:flutter/material.dart';
import '../../../constants.dart';

class SettingMenu extends StatelessWidget {
  const SettingMenu({
    Key? key,
    required this.text,
    required this.link,
  }) : super(key: key);

  final String text, link;

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
            onPressed: () {
              Navigator.pushNamed(context, link);
            },
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
                  const Icon(
                    Icons.arrow_forward_ios,
                    color: black,
                  ),
                ],
              ),
            )));
  }
}
