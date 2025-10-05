/**
 * GitHubユーザー名の形式をバリデーションする
 * 
 * GitHubユーザー名のルール:
 * - 1-39文字
 * - 英数字とハイフン(-)のみ使用可能
 * - ハイフンで始まったり終わったりできない
 * - 連続したハイフンは使用できない
 * 
 * @param {string} username - バリデーション対象のGitHubユーザー名
 * @returns {string} 'success' または エラーメッセージ
 */
export default function validateUsername(username) {
    // 空文字チェック
    if (!username || typeof username !== 'string') {
        return 'GitHubユーザー名が入力されていません'
    }

    // 前後の空白を除去
    const trimmedUsername = username.trim()

    // 長さチェック (1-39文字)
    if (trimmedUsername.length < 1 || trimmedUsername.length > 39) {
        return 'GitHubユーザー名は1文字以上39文字以下である必要があります'
    }

    // 使用可能文字のチェック (英数字とハイフンのみ)
    if (!/^[a-zA-Z0-9-]+$/.test(trimmedUsername)) {
        return 'GitHubユーザー名には英数字とハイフン(-)のみ使用できます'
    }

    // ハイフンで始まったり終わったりしていないかチェック
    if (trimmedUsername.startsWith('-') || trimmedUsername.endsWith('-')) {
        return 'GitHubユーザー名はハイフン(-)で始まったり終わったりできません'
    }

    // 連続したハイフンのチェック
    if (trimmedUsername.includes('--')) {
        return 'GitHubユーザー名に連続したハイフン(--)は使用できません'
    }

    return 'success'
}
