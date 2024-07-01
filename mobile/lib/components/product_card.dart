import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:shop_app/components/loading.dart';
import 'package:shop_app/services/crud/favorite/db_favorite.dart';
import 'package:shop_app/services/crud/favorite/db_favorite_service.dart';
import 'package:shop_app/services/crud/product/db_product.dart';

import '../constants.dart';

class ProductCard extends StatefulWidget {
  const ProductCard({
    Key? key,
    this.width = 140,
    this.aspectRetio = 1,
    required this.product,
    required this.onPress,
  }) : super(key: key);

  final double width, aspectRetio;
  final DBProduct product;
  final VoidCallback onPress;

  @override
  State<ProductCard> createState() => _ProductCardState();
}

class _ProductCardState extends State<ProductCard> {
  late Stream<DBFavorite?> _userFavorites;
  @override
  void initState() {
    super.initState();
    _userFavorites = DBFavoriteService().getCurrentUserFavoriteListStream();
  }

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
        stream: _userFavorites,
        builder: (context, snapshot) {
          switch (snapshot.hasData) {
            case (true):
              return SizedBox(
                width: widget.width,
                child: GestureDetector(
                  onTap: widget.onPress,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AspectRatio(
                        aspectRatio: 1.02,
                        child: Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: kSecondaryColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Image.network(widget.product.imgUrl),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        widget.product.productName,
                        style: Theme.of(context).textTheme.bodyMedium,
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            "\$${widget.product.price}",
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: kPrimaryColor,
                            ),
                          ),
                          InkWell(
                            borderRadius: BorderRadius.circular(50),
                            onTap: () async {
                              if (snapshot.data!.favoriteProductsId
                                  .contains(widget.product.id)) {
                                await DBFavoriteService()
                                    .removeCurrentUserFavorite(
                                        widget.product.id);
                              } else {
                                await DBFavoriteService()
                                    .addCurrentUserFavorite(widget.product.id);
                              }
                            },
                            child: Container(
                              padding: const EdgeInsets.all(6),
                              height: 24,
                              width: 24,
                              decoration: BoxDecoration(
                                color: kSecondaryColor.withOpacity(0.1),
                                shape: BoxShape.circle,
                              ),
                              child: SvgPicture.asset(
                                "assets/icons/Heart Icon_2.svg",
                                colorFilter: ColorFilter.mode(
                                    snapshot.data!.favoriteProductsId
                                            .contains(widget.product.id)
                                        ? const Color(0xFFFF4848)
                                        : const Color(0xFFDBDEE4),
                                    BlendMode.srcIn),
                              ),
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
              );
            default:
              return const Loading();
          }
        });
  }
}
