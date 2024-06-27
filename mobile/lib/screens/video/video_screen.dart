import 'package:flutter/material.dart';
import 'package:shop_app/screens/video/components/video_player.dart';
import 'package:shop_app/services/crud/video/db_video.dart';
import 'package:shop_app/services/crud/video/db_video.service.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';

class VideoScreen extends StatefulWidget {
  static String routeName = "/video";

  const VideoScreen({super.key});

  @override
  State<VideoScreen> createState() => _VideoScreenState();
}

class _VideoScreenState extends State<VideoScreen> {
  late Future<List<DBVideo>> _videoListFuture;
  int _currentIndex = 0;
  List<DBVideo>? _videoList;

  @override
  void initState() {
    super.initState();
    _videoListFuture = DBVideoService().getVideoList();
  }

  void _showNextVideo() {
    if (_videoList != null && _currentIndex < _videoList!.length - 1) {
      setState(() {
        _currentIndex++;
      });
    }
  }

  void _showPreviousVideo() {
    if (_videoList != null && _currentIndex > 0) {
      setState(() {
        _currentIndex--;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.profile),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10),
          child: FutureBuilder<List<DBVideo>>(
              future: _videoListFuture,
              builder: (context, snapshot) {
                switch (snapshot.connectionState) {
                  case ConnectionState.done:
                    if (snapshot.hasData) {
                      _videoList = snapshot.data;
                      return _videoList!.isNotEmpty
                          ? Column(
                              children: [
                                Expanded(
                                  child: Card(
                                    child: AspectRatio(
                                      aspectRatio:
                                          16 / 9, // Adjust this value as needed
                                      child: VideoPlayerWidget(
                                        key: ValueKey<int>(
                                            _currentIndex), // Ensure widget rebuilds
                                        video: _videoList![_currentIndex],
                                      ),
                                    ),
                                  ),
                                ),
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceAround,
                                  children: [
                                    FloatingActionButton(
                                      onPressed: _showPreviousVideo,
                                      child: const Text("prev"),
                                    ),
                                    FloatingActionButton(
                                      onPressed: _showNextVideo,
                                      child: const Text("next"),
                                    ),
                                  ],
                                )
                              ],
                            )
                          : Container();
                    } else if (snapshot.hasError) {
                      return const Center(child: Text("Error loading videos"));
                    }
                    return const Center(child: CircularProgressIndicator());
                  default:
                    return const Center(child: CircularProgressIndicator());
                }
              }),
        ),
      ),
    );
  }
}
