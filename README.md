# 以下を実施してください

## eas build

`eas build --platform ios` は、ExpoプロジェクトをiOSアプリ（.ipaファイル）にビルドするコマンドです。

- プロジェクトのコンパイルと署名を行います。
- 最終的にApp Store Connectにアップロードできる`.ipa`ファイルを生成します。

---

## eas submit

`eas submit --platform ios` は、ビルド済みの`.ipa`ファイルをAppleのApp Store Connectにアップロードするコマンドです。

- `eas build`で作成したアプリを、TestFlightやApp Storeに公開する準備ができます。

---
