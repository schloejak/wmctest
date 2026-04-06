# Publishing Guide

## Before Publishing

### 1. Update Package Information

Edit `package.json`:
- Change `@yourusername/angular-auth-template` to your actual npm package name
- Update `author` field
- Update `repository.url` with your GitHub repository
- Ensure version follows semantic versioning

Example:
```json
{
  "name": "@your-npm-username/angular-auth-template",
  "version": "1.0.0",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/angular-auth-template.git"
  }
}
```

### 2. Test Locally

```bash
# Build the library
npm run build:lib

# Check the dist folder
ls -la dist/

# Test in another project (optional)
npm pack
# This creates a .tgz file you can install in another project
```

### 3. Ensure .npmignore is Correct

The `.npmignore` file controls what gets published. Current config excludes:
- Source files (except the compiled ones)
- Tests
- Development config files
- IDE files

## Publishing Steps

### First Time Setup

1. Create an npm account at https://www.npmjs.com/signup

2. Login via CLI:
```bash
npm login
```

3. Verify you're logged in:
```bash
npm whoami
```

### Publishing

1. Update version (if needed):
```bash
# For bug fixes
npm version patch    # 1.0.0 -> 1.0.1

# For new features
npm version minor    # 1.0.0 -> 1.1.0

# For breaking changes
npm version major    # 1.0.0 -> 2.0.0
```

2. Build the library:
```bash
npm run build:lib
```

3. Publish:
```bash
# For scoped packages (recommended)
npm publish --access public

# For unscoped packages
npm publish
```

### Post-Publishing

1. Verify on npm:
   - Visit https://www.npmjs.com/package/YOUR-PACKAGE-NAME
   - Check that README displays correctly
   - Verify version number

2. Tag the release on GitHub:
```bash
git tag v1.0.0
git push origin v1.0.0
```

3. Create a GitHub release with the changelog

## Updating the Package

When making updates:

1. Make your changes
2. Update CHANGELOG.md
3. Bump version: `npm version [patch|minor|major]`
4. Build: `npm run build:lib`
5. Publish: `npm publish`
6. Push to git: `git push && git push --tags`

## Scoped vs Unscoped Packages

### Scoped (Recommended)
- Format: `@username/package-name`
- Must use `--access public` flag for free accounts
- Helps avoid name conflicts
- Example: `@mycompany/angular-auth`

### Unscoped
- Format: `package-name`
- Must be globally unique
- Example: `angular-auth-template`

## Package Naming Guidelines

1. Use lowercase
2. No spaces (use hyphens)
3. Keep it descriptive
4. Avoid trademarked names
5. Check availability: https://www.npmjs.com/package/YOUR-PACKAGE-NAME

## Common Issues

### "Package name already exists"
- Choose a different name or use a scoped package
- Check: `npm search your-package-name`

### "You do not have permission to publish"
- Make sure you're logged in: `npm whoami`
- For scoped packages, use `--access public`

### "No README data found"
- Ensure README.md exists in the root
- Check .npmignore isn't excluding it

## CI/CD Publishing (Optional)

### GitHub Actions Example

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build:lib
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add your npm token to GitHub Secrets as `NPM_TOKEN`.

## Best Practices

1. Always test locally before publishing
2. Use semantic versioning
3. Keep a detailed CHANGELOG.md
4. Include comprehensive README
5. Add examples and documentation
6. Test the package in a fresh project after publishing
7. Respond to issues and PRs promptly
8. Consider using a pre-release version for testing: `1.0.0-beta.1`

## Pre-release Versions

For testing before official release:

```bash
npm version prerelease --preid=beta
npm publish --tag beta
```

Users can then install with:
```bash
npm install @your-username/package-name@beta
```

## Unpublishing (Use Carefully!)

You can only unpublish within 72 hours:

```bash
# Unpublish a specific version
npm unpublish @your-username/package-name@1.0.0

# Unpublish entire package (dangerous!)
npm unpublish @your-username/package-name --force
```

⚠️ **Warning**: Unpublishing can break projects that depend on your package!

## Resources

- npm documentation: https://docs.npmjs.com/
- Semantic Versioning: https://semver.org/
- npm package guidelines: https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry
