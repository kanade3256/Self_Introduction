---
title: "研究室メモ共有アプリ"
date: 2023-10-01
summary: "Next.js + Firebase + Tailwind による研究室向けメモ共有システム。認証・ロール管理・リアルタイム同期・セキュリティルールを実装し、研究室内での定着率向上を達成。"
category: "個人開発・フルスタック"
role: "個人開発（企画→設計→実装→運用）"
technologies: ["Next.js", "Firebase", "Tailwind CSS", "TypeScript", "Firestore", "Firebase Auth"]
tags: ["Next.js", "Firebase", "React", "TypeScript"]
achievements: ["5+ロール管理システム実装", "リアルタイム同期機能実現", "UX検証で研究室内利用率向上"]
period: "2023.10 - 2024.02"
status: "completed"
featured: true
cover: "/assets/projects/lab-memo-app-cover.jpg"
---
# 研究室メモ共有アプリ

大学研究室でのナレッジ共有効率化を目的としたリアルタイム協働アプリ。Next.js + Firebase の組み合わせで、認証からデータ管理、リアルタイム同期まで包括的に実装しました。

## プロジェクト概要

**目的**: 研究室内でのメモ・議事録・プロジェクト進捗の効率的共有  
**期間**: 2023.10 - 2024.02 (4ヶ月)  
**利用者**: 研究室メンバー約15名

## 主な機能・成果

### 機能実装
- **ロールベース認証**: 教授・院生・学部生で権限分離
- **リアルタイム協働編集**: Firestoreの変更監視でリアルタイム同期
- **プロジェクト管理**: カテゴリ別でのメモ分類・検索
- **レスポンシブUI**: モバイル・タブレット対応

### 成果・改善
- **利用定着率**: 導入後3ヶ月で研究室メンバーの80%が継続利用
- **情報共有効率**: 研究ミーティング準備時間を30%削減
- **データ整合性**: セキュリティルールで不正操作を完全防止

## 技術アーキテクチャ

### システム構成
```
Next.js (Frontend)
↓
Firebase Auth (認証)
↓
Firestore (リアルタイムDB)
↓
Firebase Security Rules (アクセス制御)
```

### 技術スタック
- **フロントエンド**: Next.js 14, TypeScript, Tailwind CSS
- **バックエンド**: Firebase (Firestore, Auth, Hosting)
- **状態管理**: React Hooks + Firebase SDK
- **スタイリング**: Tailwind CSS + カスタムコンポーネント

## 開発上の工夫・チャレンジ

### ロール管理システム
```typescript
// Firestore Security Rules例
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /memos/{memoId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && (resource == null || resource.data.author == request.auth.uid
        || get(/databases/{database}/documents/users/{request.auth.uid}).data.role == 'admin');
    }
  }
}
```

### パフォーマンス最適化
1. **データフェッチ戦略**
   - 無限スクロール対応でページネーション実装
   - Firestore複合インデックスでクエリ最適化

2. **リアルタイム同期の負荷制御**
   - `onSnapshot`の適切なunsubscribe管理
   - ユーザーが見ているページのデータのみ同期

### セキュリティ設計
- **認証フロー**: Firebase Authによる多要素認証サポート
- **データ保護**: Firestore Security Rulesで行レベルセキュリティ
- **XSS対策**: サニタイゼーション + CSP設定

## ユーザー体験向上の取り組み

### UX検証プロセス
1. **プロトタイプ段階**: 研究室内で3名にUsability Testing
2. **ベータ版**: 1週間の試用期間でフィードバック収集
3. **改善反映**: UI/UXの改良を2週間サイクルで実施

### 主な改善点
- **検索機能強化**: あいまい検索 + タグフィルタリング
- **モバイル最適化**: タッチ操作を前提としたUI再設計
- **通知機能**: 重要な更新をメール通知で連携

## 技術的学習・成長

**フルスタック開発スキル**
- Reactベースでのモダンフロントエンド開発
- Firebase活用したサーバーレス設計
- TypeScriptによる型安全な開発体験

**チームワーク・プロダクト開発**
- ユーザーフィードバックの収集と分析
- アジャイル開発プロセスでの反復改善
- ドキュメント整備とナレッジ共有

---

*このアプリは現在も研究室で継続利用されており、日々のナレッジ蓄積・共有の中核システムとして機能しています。*
