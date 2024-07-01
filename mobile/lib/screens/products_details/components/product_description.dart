import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/services/crud/favorite/db_favorite.dart';
import 'package:shop_app/services/crud/favorite/db_favorite_service.dart';
import 'package:shop_app/services/crud/product/db_product.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import '../../../constants.dart';

class ProductDescription extends StatefulWidget {
  const ProductDescription({
    Key? key,
    required this.product,
  }) : super(key: key);

  final DBProduct product;
  final int maxLinesForDescription = 3;

  @override
  State<ProductDescription> createState() => _ProductDescriptionState();
}

class _ProductDescriptionState extends State<ProductDescription> {
  bool showAllDescription = false;
  late Stream<DBFavorite?> _userFavorites;
  @override
  void initState() {
    super.initState();
    _userFavorites = DBFavoriteService().getCurrentUserFavoriteListStream();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
        color: white,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                widget.product.productName,
                style: Theme.of(context).textTheme.titleLarge,
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                '${AppLocalizations.of(context)!.stock}: ${widget.product.stock}',
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ),
            Align(
              alignment: Alignment.centerRight,
              child: Container(
                  padding: const EdgeInsets.all(16),
                  width: 48,
                  decoration: const BoxDecoration(
                    color: Color(0xFFF5F6F9),
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(20),
                      bottomLeft: Radius.circular(20),
                    ),
                  ),
                  child: StreamBuilder(
                      stream: _userFavorites,
                      builder: (context, snapshot) {
                        switch (snapshot.hasData) {
                          case (true):
                            return InkWell(
                                onTap: () async {
                                  if (snapshot.data!.favoriteProductsId
                                      .contains(widget.product.id)) {
                                    await DBFavoriteService()
                                        .removeCurrentUserFavorite(
                                            widget.product.id);
                                  } else {
                                    await DBFavoriteService()
                                        .addCurrentUserFavorite(
                                            widget.product.id);
                                  }
                                },
                                child: SvgPicture.asset(
                                  "assets/icons/Heart Icon_2.svg",
                                  colorFilter: ColorFilter.mode(
                                      snapshot.data!.favoriteProductsId
                                              .contains(widget.product.id)
                                          ? const Color(0xFFFF4848)
                                          : const Color(0xFFDBDEE4),
                                      BlendMode.srcIn),
                                  height: 16,
                                ));
                          default:
                            return const Loading();
                        }
                      })),
            ),
            Padding(
              padding: const EdgeInsets.only(
                left: 20,
                right: 64,
              ),
              child: Text(
                widget.product.description,
                maxLines:
                    showAllDescription ? null : widget.maxLinesForDescription,
              ),
            ),
            Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 12,
                ),
                child: LayoutBuilder(builder: (context, constraints) {
                  final span = TextSpan(text: widget.product.description);
                  final tp = TextPainter(
                      text: span,
                      maxLines: widget.maxLinesForDescription,
                      textDirection: TextDirection.ltr);
                  tp.layout(maxWidth: MediaQuery.of(context).size.width);
                  if (tp.didExceedMaxLines) {
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          showAllDescription = !showAllDescription;
                        });
                      },
                      child: Row(
                        children: [
                          Text(
                            showAllDescription
                                ? AppLocalizations.of(context)!.hide_details
                                : AppLocalizations.of(context)!.show_details,
                            style: const TextStyle(
                                fontWeight: FontWeight.w600,
                                color: kPrimaryColor),
                          ),
                          const SizedBox(width: 5),
                          Icon(
                            showAllDescription
                                ? Icons.arrow_back_ios
                                : Icons.arrow_forward_ios,
                            size: 12,
                            color: kPrimaryColor,
                          )
                        ],
                      ),
                    );
                  }
                  return const Text("");
                }))
          ],
        ));
  }
}
