// Strapiのページネーションの型
interface PaginationType {
  /** 現在のページ */
  page: number;
  /** 1ページあたりのアイテム数 */
  pageSize: number;
  /** 総ページ数  */
  pageCount: number;
  /** 総アイテム数 */
  total: number;
}

// メタデータの型
interface Metadata {
  /** メタタイトル */
  metaTitle: string;
  /** メタディスクリプション */
  metaDescription: string;
}

// ブログ記事等のコンテンツの型
interface ArticleContent {
  id: number;
  contentTitle: string;
  contentText: string;
}

export { type PaginationType, type Metadata, type ArticleContent };
