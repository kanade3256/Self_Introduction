export interface TimelineEntry {
  id: string;
  period: string;
  title: string;
  kind: 'personal' | 'research' | 'development' | 'learning';
  summary: string;
  bullets: string[];
  tags: string[];
  startDate: Date;
  endDate?: Date;
  category: string;
  role: string;
  technologies: string[];
  achievements: string[];
  featured?: boolean;
  links?: {
    demo?: string;
    repo?: string;
    architecture?: string;
  };
}

export const timelineData: TimelineEntry[] = [
  {
    id: 'portfolio-site',
    period: '2025.09',
    title: 'ポートフォリオサイト 作成',
    kind: 'personal',
    summary: 'Astro + GitHub Pages で高速かつi18n対応のポートフォリオを構築。ダークテーマ／IntersectionObserverによる演出を実装。',
    bullets: [
      '静的生成とSEO最適化でLighthouse 90+達成',
      'GitHub ActionsでCI/CDを自動化',
      'モバイル〜デスクトップでのアクセシビリティ改善'
    ],
    tags: ['Astro', 'TypeScript', 'CI/CD'],
    startDate: new Date('2024-09-01'),
    category: '個人開発・フルスタック',
    role: 'フルスタック開発',
    technologies: ['Astro', 'TypeScript', 'GitHub Actions', 'HTML/CSS'],
    achievements: [
      'SEO最適化でLighthouse 90+達成',
      'CI/CD自動化パイプライン構築',
      'レスポンシブデザイン・アクセシビリティ実装'
    ],
    featured: false,
  },
  {
    id: 'walking-data-research',
    period: '2025.06 - 現在',
    title: '歩行データ時系列クラスタリング研究',
    kind: 'research',
    summary: 'MediaPipeで取得した歩行データをDTWとクラスタリングで分析し、特徴量設計から検証まで一貫して担当。',
    bullets: [
      '特徴量抽出・正規化パイプラインの構築',
      'K-means / 階層クラスタリングの比較評価',
      '研究発表向けビジュアライゼーションを実装'
    ],
    tags: ['Python', 'Research', 'DTW'],
    startDate: new Date('2025-06'),
    category: '研究・アカデミック',
    role: '研究員（データ分析・アルゴリズム実装）',
    technologies: ['Python', 'scikit-learn', 'pandas', 'numpy', 'matplotlib'],
    achievements: [
      'Feature engineering pipeline',
      'クラスタリング比較検証',
      'Academic presentation ready'
    ],
    featured: true,
  },
  {
    id: 'komeda-portal',
    period: '2025.02 - Now',
    title: 'Komeda Portal - バイトシフトDX',
    kind: 'development',
    summary: 'AWS Lambda + Secrets Manager + S3 + LINE リッチメニュー連携によるバイトシフト管理システム。クラウドで業務効率化を実現し、実装→運用→改善までの一連の経験を獲得。',
    bullets: [
      'Secrets Managerで安全な認証情報管理',
      '通知・承認フローを自動化し工数23%削減',
      'CloudWatchとSlackで運用監視ラインを構築'
    ],
    tags: ['AWS Lambda', 'LINE API', 'Serverless'],
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-08-31'),
    category: '実務・クラウドDX',
    role: 'フルスタック開発・運用',
    technologies: ['AWS Lambda', 'Secrets Manager', 'S3', 'LINE API', 'MySQL'],
    achievements: [
      'AWS Lambda × LINE API',
      'Secrets Manager / S3 設計',
      'ゼロダウン運用フロー'
    ],
    featured: true,
    links: {
      demo: 'https://demo.komeda-portal.com/',
    },
  },
  {
    id: 'lab-memo-app',
    period: '2023.10 - 2024.02',
    title: '研究室メモ共有アプリ',
    kind: 'personal',
    summary: 'Next.js + Firebase + Tailwind による研究室向けメモ共有システム。認証・ロール管理・リアルタイム同期・セキュリティルールを実装し、運用・セキュリティ・ユーザビリティまで意識。',
    bullets: [
      'Next.js 14 + Firebase',
      'RBAC & Security Rules',
      'UX検証で定着率向上'
    ],
    tags: ['Next.js', 'Firebase'],
    startDate: new Date('2023-10-01'),
    endDate: new Date('2024-02-29'),
    category: '個人開発・フルスタック',
    role: '個人開発（企画→設計→実装→運用）',
    technologies: ['Next.js', 'Firebase', 'Tailwind CSS', 'TypeScript', 'Firestore'],
    achievements: [
      'Next.js 14 + Firebase',
      'RBAC & Security Rules',
      'UX検証で定着率向上'
    ],
    featured: true,
    links: {
      repo: '#',
    },
  },
  {
    id: 'data-science-learning',
    period: '2023.04 - 現在',
    title: 'データサイエンス・機械学習の継続学習',
    kind: 'learning',
    summary: '実際の課題解決を通じてデータサイエンス・機械学習の実用的なスキルを習得。',
    bullets: [
      'Pythonとライブラリ群（pandas, scikit-learn）の習得',
      '統計解析・データ可視化手法の実践',
      '機械学習アルゴリズムの理論から実装まで'
    ],
    tags: ['Python', 'Data Science', 'Machine Learning'],
    startDate: new Date('2023-04-01'),
    category: '学習・スキル向上',
    role: '学習者',
    technologies: ['Python', 'pandas', 'scikit-learn', 'matplotlib', 'Jupyter'],
    achievements: [
      'データ分析パイプライン構築',
      '機械学習モデル開発・評価',
      '統計的手法による仮説検証'
    ],
    featured: false,
  },
];

export const timelineStats = [
  { value: '3', label: '商用運用プロダクト' },
  { value: '2', label: '研究テーマ' },
  { value: '5', label: '継続発表・登壇' },
  { value: '4+', label: 'チーム開発コラボ' },
];

export const ongoingFocus = [
  {
    title: '技術キャッチアップ',
    description: 'Serverlessアーキテクチャ、Observability、データ契約などの新潮流を検証し、ナレッジ共有を継続。',
  },
  {
    title: '個人プロジェクト',
    description: '業務課題を抽象化したプロトタイプでユーザー検証を重ねながら、アイデアから実装・運用まで一貫したサイクルを経験。',
  },
  {
    title: 'コミュニティ・発信',
    description: '勉強会・登壇・ブログでの知見共有と、メンタリング活動を通じた相互学習の促進。',
  },
];

// 年別にグループ化する関数
export function groupTimelineByYear(entries: TimelineEntry[]) {
  const grouped = entries.reduce((groups, entry) => {
    const year = entry.startDate.getFullYear().toString();
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(entry);
    return groups;
  }, {} as Record<string, TimelineEntry[]>);

  return Object.entries(grouped)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
    .map(([year, entries]) => ({
      year,
      subtitle: getYearSubtitle(year),
      entries: entries.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
    }));
}

function getYearSubtitle(year: string): string {
  switch (year) {
    case '2024':
      return 'クラウドDXと研究の深化';
    case '2023':
      return 'フルスタック基盤づくりと学びの強化';
    default:
      return '新たな挑戦と成長';
  }
}