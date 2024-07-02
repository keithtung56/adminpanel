import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_svg/svg.dart';
import 'package:logger/logger.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/constants.dart';
import 'package:shop_app/screens/video/components/video_player.dart';
import 'package:shop_app/screens/video_upload/video_upload_screen.dart';
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
                color: Colors.white,
                child: Stack(
                  children: [
                    Align(
                      alignment: Alignment.center,
                      child: Text(
                        AppLocalizations.of(context)!.video,
                        style: headingStyle,
                        textAlign: TextAlign.center,
                      ),
                    ),
                    Align(
                      alignment: Alignment.centerRight,
                      child: InkWell(
                        onTap: () {
                          Navigator.pushNamed(
                            context,
                            VideoUploadScreen.routeName,
                          ).then((_) {
                            setState(() {
                              _videoListFuture =
                                  DBVideoService().getVideoList();
                            });
                          });
                        },
                        child: Container(
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.symmetric(horizontal: 10),
                          child: SvgPicture.asset(
                            "assets/icons/UploadIcon.svg",
                            colorFilter: const ColorFilter.mode(
                              black,
                              BlendMode.srcIn,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                )),
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
                      child: RefreshIndicator(
                        onRefresh: () async {
                          setState(() {
                            _videoListFuture = DBVideoService().getVideoList();
                          });
                        },
                        child: FutureBuilder<List<DBVideo>>(
                          future: _videoListFuture,
                          builder: (context, snapshot) {
                            Logger().d(snapshot.data);
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
                                  return const Center(child: Text(""));
                                }
                                return const Loading();
                              default:
                                return const Loading();
                            }
                          },
                        ),
                      ))),
            ),
          ],
        ),
      ),
    );
  }
}
