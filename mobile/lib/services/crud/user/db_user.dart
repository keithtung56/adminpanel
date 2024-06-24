class DBUser {
  final String uid;
  final String email;
  final String password;
  final String username;
  final int age;
  final String gender;
  final String createdTime;
  final String modifiedTime;
  final List<String> ordersId;

  DBUser({
    required this.uid,
    required this.email,
    required this.password,
    required this.username,
    required this.age,
    required this.gender,
    required this.createdTime,
    required this.modifiedTime,
    required this.ordersId,
  });
}
