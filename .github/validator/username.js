import { Octokit } from '@octokit/rest'

/**
 * GitHubユーザー名の形式をバリデーションし、ユーザーが実際に存在するかをチェックする
 * 
 * GitHubユーザー名のルール:
 * - 1-39文字
 * - 英数字とハイフン(-)のみ使用可能
 * - ハイフンで始まったり終わったりできない
 * - 連続したハイフンは使用できない
 * 
 * さらに、GitHub APIを使用してユーザーが実際に存在するかを確認
 * 
 * @param {string} username - バリデーション対象のGitHubユーザー名
 * @returns {Promise<string>} 'success' または エラーメッセージ
 */
export default async function validateUsername(username) {
    // 空文字チェック
    if (!username || typeof username !== 'string') {
        return 'GitHubユーザー名が入力されていません'
    }

    // 前後の空白を除去
    const trimmedUsername = username.trim()

    // GitHubユーザー名の形式チェック
    // - 1-39文字
    // - 英数字とハイフン(-)のみ
    // - ハイフンで始まったり終わったりしない
    // - 連続したハイフンは使用不可
    // cf. https://github.com/shinnn/github-username-regex
    const gitHubUserNameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
    const isValidFormat = gitHubUserNameRegex.test(trimmedUsername)

    if (!isValidFormat) {
        return 'ユーザー名が有効な形式ではありません（1-39文字、英数字とハイフンのみ、ハイフンは先頭・末尾・連続使用不可）'
    }

    // GitHub APIを使用してユーザーが存在するかチェック
    try {
        const octokit = new Octokit()

        const { data } = await octokit.users.getByUsername({
            username: trimmedUsername
        })

        // アカウントが削除されている場合などのチェック
        if (data.type !== 'User' && data.type !== 'Organization') {
            return `'${trimmedUsername}' は有効なGitHubユーザーアカウントではありません`
        }

        return 'success'
    } catch (error) {
        // ユーザーが見つからない場合
        if (error.status === 404) {
            return `GitHubユーザー '${trimmedUsername}' が見つかりません。ユーザー名を確認してください`
        }

        // その他のエラー
        return `GitHubユーザーの確認中にエラーが発生しました: ${error.message}`
    }
}
