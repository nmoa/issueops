/**
 * メールアドレスの形式をバリデーションする
 * 
 * RFC 5322に準拠した基本的なメールアドレス形式をチェック
 * 
 * @param {string} email - バリデーション対象のメールアドレス
 * @returns {string} 'success' または エラーメッセージ
 */
export default function validateEmail(email) {
    // 空文字チェック
    if (!email || typeof email !== 'string') {
        return 'メールアドレスが入力されていません'
    }

    // 前後の空白を除去
    const trimmedEmail = email.trim()

    // 基本的なメールアドレス形式のチェック
    // ローカル部@ドメイン部の形式
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!emailRegex.test(trimmedEmail)) {
        return 'メールアドレスの形式が正しくありません（例: user@example.com）'
    }

    // @が1つだけ含まれているかチェック
    const atCount = (trimmedEmail.match(/@/g) || []).length
    if (atCount !== 1) {
        return 'メールアドレスには@を1つだけ含める必要があります'
    }

    // ローカル部とドメイン部に分割
    const [localPart, domainPart] = trimmedEmail.split('@')

    // ローカル部のチェック
    if (localPart.length === 0 || localPart.length > 64) {
        return 'メールアドレスのローカル部（@の前）は1文字以上64文字以下である必要があります'
    }

    // ドメイン部のチェック
    if (domainPart.length === 0 || domainPart.length > 253) {
        return 'メールアドレスのドメイン部（@の後）は1文字以上253文字以下である必要があります'
    }

    // ドメイン部にドットが含まれているかチェック
    if (!domainPart.includes('.')) {
        return 'メールアドレスのドメイン部には少なくとも1つのドット(.)が必要です'
    }

    // ドメイン部がドットで始まったり終わったりしていないかチェック
    if (domainPart.startsWith('.') || domainPart.endsWith('.')) {
        return 'メールアドレスのドメイン部はドット(.)で始まったり終わったりできません'
    }

    // 連続したドットのチェック
    if (domainPart.includes('..')) {
        return 'メールアドレスのドメイン部に連続したドット(..)は使用できません'
    }

    return 'success'
}
