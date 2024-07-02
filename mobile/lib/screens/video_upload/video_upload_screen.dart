import 'dart:io';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:shop_app/components/form_error.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/services/crud/video/db_video.service.dart';

class VideoUploadScreen extends StatefulWidget {
  static String routeName = "/video_upload";

  const VideoUploadScreen({super.key});

  @override
  State<VideoUploadScreen> createState() => _VideoUploadScreenState();
}

class _VideoUploadScreenState extends State<VideoUploadScreen> {
  final _formKey = GlobalKey<FormState>();
  String title = '';
  final List<String?> errors = [];

  @override
  void initState() {
    super.initState();
  }

  void addError({String? error}) {
    if (!errors.contains(error)) {
      setState(() {
        errors.add(error);
      });
    }
  }

  void removeError({String? error}) {
    if (errors.contains(error)) {
      setState(() {
        errors.remove(error);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: grey,
      appBar: AppBar(
        title: Text(
          AppLocalizations.of(context)!.upload_video,
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
                Form(
                    key: _formKey,
                    child: TextFormField(
                      onChanged: (newValue) {
                        if (newValue.isNotEmpty) {
                          removeError(
                              error: AppLocalizations.of(context)!
                                  .empty_video_title_error);
                        }
                        setState(() {
                          title = newValue;
                        });
                      },
                      validator: (value) {
                        if (value!.isEmpty) {
                          addError(
                              error: AppLocalizations.of(context)!
                                  .empty_video_title_error);
                          return '';
                        }
                        return null;
                      },
                      decoration: InputDecoration(
                        labelText: AppLocalizations.of(context)!.video_title,
                        hintText:
                            AppLocalizations.of(context)!.enter_video_title,
                        floatingLabelBehavior: FloatingLabelBehavior.always,
                      ),
                    )),
                FormError(errors: errors),
                const SizedBox(height: 40),
                ElevatedButton(
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
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
                      }
                    },
                    child:
                        Text(AppLocalizations.of(context)!.select_and_upload))
              ],
            )),
      ),
    );
  }
}
