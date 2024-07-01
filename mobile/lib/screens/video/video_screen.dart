import 'package:flutter/material.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/constants.dart';
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
  List<DBVideo>? _videoList;
  late PageController _pageController;

  @override
  void initState() {
    super.initState();
    _videoListFuture = DBVideoService().getVideoList();
    _pageController = PageController();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: grey,
      body: SafeArea(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 0),
              width: double.infinity,
              color: Colors.white, // Use your desired color
              child: Text(
                AppLocalizations.of(context)!.video,
                style: headingStyle,
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 10),
            Expanded(
              child: Container(
                  color: grey, //
                  padding:
                      const EdgeInsets.symmetric(vertical: 20, horizontal: 20),
                  child: Container(
                      padding: const EdgeInsets.symmetric(
                          vertical: 10, horizontal: 10),
                      color: white,
                      child: FutureBuilder<List<DBVideo>>(
                        future: _videoListFuture,
                        builder: (context, snapshot) {
                          switch (snapshot.connectionState) {
                            case ConnectionState.done:
                              if (snapshot.hasData) {
                                _videoList = snapshot.data;
                                return _videoList!.isNotEmpty
                                    ? PageView.builder(
                                        controller: _pageController,
                                        scrollDirection: Axis.vertical,
                                        itemCount: _videoList!.length,
                                        itemBuilder: (context, index) {
                                          return Column(
                                            children: [
                                              Text(
                                                _videoList![index].title,
                                                style: const TextStyle(
                                                  fontSize: 18,
                                                  color: Colors.black,
                                                  height: 1.5,
                                                ),
                                              ),
                                              const SizedBox(
                                                height: 10,
                                              ),
                                              Expanded(
                                                  child: AspectRatio(
                                                aspectRatio: 16 / 9,
                                                child: VideoPlayerWidget(
                                                  key: ValueKey<int>(index),
                                                  video: _videoList![index],
                                                ),
                                              ))
                                            ],
                                          );
                                        },
                                      )
                                    : Container();
                              } else if (snapshot.hasError) {
                                return const Center(
                                    child: Text("Error loading videos"));
                              }
                              return const Loading();
                            default:
                              return const Loading();
                          }
                        },
                      ))),
            ),
          ],
        ),
      ),
    );
  }
}
