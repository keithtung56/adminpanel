import 'dart:io';

import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:logger/logger.dart';
import 'package:moment_dart/moment_dart.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/services/auth/auth_service.dart';
import 'package:shop_app/services/crud/video/db_video.dart';
import 'package:uuid/uuid.dart';

class DBVideoService {
  Future<List<DBVideo>> getVideoList() async {
    final snapshot = await FirebaseDatabase.instance.ref("Videos").get();
    if (!snapshot.exists) {
      return [];
    }
    try {
      final val = snapshot.value as Map<dynamic, dynamic>;
      var videoList = await Future.wait(val.entries.map((e) async {
        final val = e.value;
        final videoFileId = val['video_file_id'];
        final videoUrl = await FirebaseStorage.instance
            .ref("Videos/$videoFileId")
            .getDownloadURL();

        return DBVideo(
          title: val['title'],
          url: videoUrl,
          uploadUserId: val['upload_user_id'],
          createdTime: val['created_time'],
          modifiedTime: val['modified_time'],
        );
      }).toList());
      return videoList;
    } catch (e) {
      Logger().d(e.toString());
      return [];
    }
  }

  Future<void> uploadVideo(String title, File file) async {
    try {
      final dBVideoRandomId = const Uuid().v1();
      final storageVideoFileRandomId = const Uuid().v1();

      await FirebaseStorage.instance
          .ref("Videos/$storageVideoFileRandomId")
          .putFile(file, SettableMetadata(contentType: 'video/mp4'));

      await FirebaseDatabase.instance.ref("Videos/$dBVideoRandomId").update({
        'title': title,
        'video_file_id': storageVideoFileRandomId,
        'upload_user_id': AuthService.firebase().currentUser!.uid,
        'created_time': Moment.now().format(dateDBFormat),
        'modified_time': Moment.now().format(dateDBFormat),
      });
    } catch (_) {}
  }
}

class VideNotFound implements Exception {}
