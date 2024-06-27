import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:shop_app/services/crud/video/db_video.dart';

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
    } catch (_) {
      return [];
    }
  }
}

class VideNotFound implements Exception {}
