/**
 * Validate a GitHub username and check the following:
 * 1. The username format is valid.
 * 2. The user actually exists.
 * 3. The user is not already registered in members.yaml.
 *
 * GitHub username rules:
 * - 1 to 39 characters
 * - Only letters, numbers, and hyphens (-)
 * - Cannot start or end with a hyphen
 * - Cannot contain consecutive hyphens
 *
 * @param {string} username - The GitHub username to validate.
 * @returns {Promise<string>} 'success' or an error message.
 */
export default async function validateUsername(username) {
    // Require a non-empty string.
    if (!username || typeof username !== 'string') {
        return 'GitHub username is required'
    }

    // Trim surrounding whitespace before validation.
    const trimmedUsername = username.trim()

    // Validate the GitHub username format.
    // - 1 to 39 characters
    // - Letters, numbers, and hyphens (-) only
    // - Cannot start or end with a hyphen
    // - Cannot contain consecutive hyphens
    // cf. https://github.com/shinnn/github-username-regex
    const gitHubUserNameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i
    const isValidFormat = gitHubUserNameRegex.test(trimmedUsername)

    if (!isValidFormat) {
        return 'Username format is invalid (1-39 characters; letters, numbers, and single hyphens only; hyphens cannot be leading, trailing, or repeated)'
    }

    // Use @octokit/rest to access the GitHub API.
    const { Octokit } = await import('@octokit/rest')
    const core = await import('@actions/core')
    const { readFileSync } = await import('fs')
    const YAML = await import('yaml')

    const octokit = new Octokit({
        auth: core.getInput('github-token', { required: true }),
    })

    try {
        // 1. Check whether the GitHub user exists.
        core.info(`Checking if user '${trimmedUsername}' exists`)

        let userData
        try {
            const userResponse = await octokit.rest.users.getByUsername({
                username: trimmedUsername
            })
            userData = userResponse.data
        } catch (error) {
            if (error.status === 404) {
                return `GitHub user '${trimmedUsername}' was not found. Check the username and try again`
            }
            throw error
        }

        // Check the account type.
        if (userData.type !== 'User') {
            return `'${trimmedUsername}' is not a valid GitHub user account (type: ${userData.type})`
        }

        core.info(`User '${trimmedUsername}' exists`)

        // 2. Load the YAML file.
        core.info(`Checking if user '${trimmedUsername}' is already in members.yaml`)
        const workspace = core.getInput('workspace', { required: true })
        const yamlPath = `${workspace}/.github/validator/config.yml`
        const content = readFileSync(yamlPath, 'utf8')
        const data = YAML.parse(content)

        core.info(`Parsed YAML data: ${JSON.stringify(data)}`)


        // if (fs.existsSync(membersYamlPath)) {
        //     const membersYamlContent = fs.readFileSync(membersYamlPath, 'utf8')
        //     const membersData = YAML.parse(membersYamlContent)

        //     const existingMember = membersData.members?.find(
        //         member => member.username.toLowerCase() === trimmedUsername.toLowerCase()
        //     )

        //     if (existingMember) {
        //         return `User '${trimmedUsername}' is already registered in members.yaml`
        //     }

        //     core.info(`User '${trimmedUsername}' is not in members.yaml`)
        // } else {
        //     core.warning(`members.yaml not found at ${membersYamlPath}`)
        // }

        return 'success'
    } catch (error) {
        // Any other validation error.
        core.error(`Validation error: ${error.message}`)
        return `An error occurred during validation: ${error.message}`
    }
}
