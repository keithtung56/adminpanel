import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:shop_app/constants.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:shop_app/services/crud/video/db_video.service.dart';

class VideoUploadScreen extends StatefulWidget {
  static String routeName = "/video_upload";

  const VideoUploadScreen({super.key});

  @override
  State<VideoUploadScreen> createState() => _VideoUploadScreenState();
}

class _VideoUploadScreenState extends State<VideoUploadScreen> {
  String title = '';

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: grey,
      appBar: AppBar(
        title: Text(
          AppLocalizations.of(context)!.video,
        ),
      ),
      body: SafeArea(
        child: Container(
            padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 30),
            width: double.infinity,
            color: Colors.white, // Use your desired color
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextFormField(
                  onChanged: (newValue) {
                    setState(() {
                      title = newValue;
                    });
                  },
                  decoration: const InputDecoration(
                    labelText: 'title',
                    hintText: 'enter video title',
                    floatingLabelBehavior: FloatingLabelBehavior.always,
                  ),
                ),
                const SizedBox(height: 40),
                ElevatedButton(
                    onPressed: () async {
                      try {
                        final xFile = await ImagePicker()
                            .pickVideo(source: ImageSource.gallery);
                        final file = File(xFile!.path);
                        if (context.mounted) {
                          context.loaderOverlay.show();
                        }

                        await DBVideoService().uploadVideo(title, file);
                        if (context.mounted) {
                          Navigator.pop(context);
                        }
                      } catch (_) {
                      } finally {
                        if (context.mounted) {
                          context.loaderOverlay.hide();
                        }
                      }
                    },
                    child: const Text('Select and Upload'))
              ],
            )),
      ),
    );
  }
}
