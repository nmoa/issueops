import validator from 'validator'

/**
 * Validate the email address format.
 *
 * Uses validator.js to check whether the value is a valid email address.
 *
 * @param {string} email - The email address to validate.
 * @returns {string} 'success' or an error message.
 */
export default function validateEmail(email) {
    // Require a non-empty string.
    if (!email || typeof email !== 'string') {
        return 'Email address is required'
    }

    // Trim surrounding whitespace before validation.
    const trimmedEmail = email.trim()

    // Use validator.js for the email format check.
    if (!validator.isEmail(trimmedEmail)) {
        return 'Email address format is invalid (example: user@example.com)'
    }

    return 'success'
}
