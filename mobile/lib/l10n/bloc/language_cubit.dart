import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class LanguageCubit extends Cubit<Locale> {
  LanguageCubit(Locale defaultLocale) : super(defaultLocale);

  void selectLanguage(Locale locale) {
    emit(locale);
  }
}
