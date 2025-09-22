import { timelineData, type TimelineEntry } from '../src/data/timeline.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateProjectMarkdown(entry: TimelineEntry): string {
  const frontmatter = `---
title: "${entry.title}"
date: ${entry.startDate.toISOString().split('T')[0]}
tags: ${JSON.stringify(entry.tags)}
category: "${entry.category}"
role: "${entry.role}"
technologies: ${JSON.stringify(entry.technologies)}
achievements: ${JSON.stringify(entry.achievements)}
featured: ${entry.featured || false}
summary: "${entry.summary}"${entry.links ? `
links:${entry.links.demo ? `
  demo: "${entry.links.demo}"` : ''}${entry.links.repo ? `
  repo: "${entry.links.repo}"` : ''}${entry.links.architecture ? `
  architecture: "${entry.links.architecture}"` : ''}` : ''}
---`;

  const content = `
# ${entry.title}

${entry.summary}

## 実績・成果

${entry.bullets.map(bullet => `- ${bullet}`).join('\n')}

## 技術スタック

${entry.technologies.map(tech => `- **${tech}**`).join('\n')}

## 期間

**${entry.period}**

## 詳細

このプロジェクトは${entry.kind === 'development' ? '実務開発' : entry.kind === 'research' ? '研究活動' : entry.kind === 'personal' ? '個人開発' : '学習活動'}として取り組みました。

### 主な成果

${entry.achievements.map(achievement => `- ${achievement}`).join('\n')}

### 学んだこと

${entry.kind === 'development' ? 
  `実務レベルでの開発・運用を通じて、スケーラブルなシステムアーキテクチャの設計と、継続的な改善プロセスの重要性を学びました。` :
  entry.kind === 'research' ?
  `研究活動を通じて、仮説設定から検証まで一貫したアプローチと、客観的な評価手法の重要性を学びました。` :
  entry.kind === 'personal' ?
  `個人プロジェクトを通じて、企画から実装・運用まで一人称で実行する力と、ユーザーフィードバックを活かした改善力を培いました。` :
  `継続的な学習を通じて、理論と実践を結びつける重要性と、新しい技術を実際のプロジェクトに適用する応用力を身につけました。`
}
`;

  return frontmatter + content;
}

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function generateProjectFiles() {
  const projectsDir = path.join(__dirname, '../src/content/projects');
  
  // プロジェクトディレクトリが存在することを確認
  ensureDirectoryExists(projectsDir);

  // 既存のファイルをクリア（バックアップを取る場合はここでバックアップ処理を追加）
  const existingFiles = fs.readdirSync(projectsDir).filter(file => file.endsWith('.md'));
  existingFiles.forEach(file => {
    const backupPath = path.join(projectsDir, `${file}.backup`);
    const originalPath = path.join(projectsDir, file);
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, backupPath);
      console.log(`Backed up: ${file} -> ${file}.backup`);
    }
  });

  // developmentまたはresearchまたはfeaturedのエントリーからプロジェクトファイルを生成
  const projectEntries = timelineData.filter(entry => 
    entry.kind === 'development' || 
    entry.kind === 'research' || 
    entry.featured === true
  );

  projectEntries.forEach(entry => {
    const filename = `${entry.id}.md`;
    const filepath = path.join(projectsDir, filename);
    const content = generateProjectMarkdown(entry);
    
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`✅ Generated: ${filename}`);
  });

  console.log(`\n🎉 Generated ${projectEntries.length} project files successfully!`);
  console.log(`📁 Project files location: ${projectsDir}`);
}

// スクリプトが直接実行された場合に実行
console.log('🚀 Starting project generation...');
try {
  generateProjectFiles();
} catch (error) {
  console.error('❌ Error generating project files:', error);
  process.exit(1);
}

export { generateProjectFiles };