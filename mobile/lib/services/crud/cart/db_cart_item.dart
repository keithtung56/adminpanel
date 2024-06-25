class DBCartItem {
  //in case same product,different options
  final String uid;

  final String productId;
  final int quantity;
  final Map<dynamic, dynamic> options;

  const DBCartItem(
      {required this.uid,
      required this.productId,
      required this.quantity,
      required this.options});
}
