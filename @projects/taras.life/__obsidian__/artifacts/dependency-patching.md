# Native npm dependency patches

## Purpose and safeguards

Use npm's native patches when a published dependency needs a small local change that is not yet available upstream. A patch is a version-specific diff against the published package, not a replacement package. npm applies registered patches during installation; editing `node_modules` alone is temporary and is not a patch.

The project's selected npm version is in root `package.json` (`packageManager`); Node is selected by `.node-version`. Use those versions locally, in CI, and in Cloudflare. npm 12 introduced the native workflow used here; an older npm may not apply the patch. Do not bypass patch failures or unused-patch checks merely to make an install succeed.

The root `package.json` registers patches in `patchedDependencies`. Commit that file, `package-lock.json`, and the generated files under `patches/` together. The lockfile records patch integrity: do not edit generated patch files by hand without updating npm's metadata. Add a behavior test for each important patch; checking that a string exists in a file is not enough.

Run commands below from the repository root, in PowerShell. Replace values in angle brackets; do not type the brackets. Do not inspect or copy large bundled files unnecessarily. Start by preserving uncommitted work (`git status`) and verifying `node --version` and `npm --version` against the project's selected versions.

## Create a patch for another package

1. Identify the exact installed package and version, and where the behavior used by the site lives. The published package may contain compiled output rather than source. Check its package README and entry points first. For example:

   ```powershell
   npm ls <package-name>
   npm patch ls
   ```

2. Prepare an editable copy. This works with scoped package names too:

   ```powershell
   npm patch add <package-name>@<installed-version>
   ```

   npm prints the temporary directory. This is a separate copy of the published package: previous edits in `node_modules` are not automatically included. Edit the relevant file **in that printed directory**, making the smallest intended change. Do not copy an entire previously edited file unless you have checked it contains no other changes.

3. Generate and register the patch, using the exact directory npm printed:

   ```powershell
   npm patch commit "<edit-directory-printed-by-npm>"
   npm patch ls
   git status --short
   ```

   Review the generated patch file and `package.json`/`package-lock.json` changes. A scoped package's generated patch can be in a scope subdirectory under `patches/`. Do not assume an edit to `node_modules` was captured; confirm the generated diff contains exactly the intended change. For a direct dependency, consider an exact version in `package.json` so updates are deliberate; keep the lockfile in sync using npm.

4. Add a focused behavior test and run the relevant tests. For behavior that must be protected in Cloudflare, ensure the check is explicitly part of `npm run build`, because Workers Builds runs independently of GitHub Actions. Commit the patch, manifest, lockfile, test, and any related changes together on a suitable branch, then verify a clean install of that commit as described below. Correct and recommit if verification fails.

## Current patch: AVIF Obsidian embeds

- Package: `@quartz-community/obsidian-flavored-markdown`, currently pinned to `2.3.1`.
- Patch: `patches/@quartz-community/obsidian-flavored-markdown@2.3.1.patch`.
- Reason: `![[image.avif]]` otherwise falls through as a note transclusion rather than becoming an image.
- Change in the published `dist/index.js`: add only `, ".avif"` to the image-extension array, after `".webp"`. Do not change the rest of the embed handling unless a new version requires a separately reviewed fix.
- Behavior check: `npm run verify:obsidian-embeds` runs `quartz/processors/obsidian-embeds.test.mjs`; `npm run build` runs it explicitly. It checks image classification, uppercase extension, dimensions and a note-transclusion control. It does not prove that an asset is copied, reachable, or displayed in a browser.

## Update a patched dependency

1. Preserve current work and identify the current patch and proposed new version. Review upstream release notes and check whether the fix is now included; do not assume the old compiled file still has the same structure. For the AVIF patch, test the new version's actual embed behavior **without the old patch**, ideally in a disposable checkout, not just whether its source mentions AVIF. Avoid pushing experimental changes: Cloudflare deploys on push.
2. If upstream contains the fix, remove the patch with `npm patch rm <package-name>@<old-version>` and deliberately update the dependency to the desired version. Keep the behavior test. Review npm's changes to the manifest, lockfile and patch file; then perform the clean-install verification below.
3. If the fix is still needed, rebase the existing patch with npm. For the current AVIF example, substitute the desired version:

   ```powershell
   npm patch update @quartz-community/obsidian-flavored-markdown@2.3.1 --to <new-version>
   ```

   **Not yet exercised in this project:** the exact update sequence and conflict handling have not been verified locally. Consult `npm patch update --help` for the installed npm version and follow its output; try this in a disposable checkout first. The intent is to update the patch; do not assume the command also installed the new dependency or changed the direct dependency's version. Update the direct dependency deliberately to the exact new version using npm, keeping the manifest and lockfile consistent. For example, if npm reports a successful rebase and the resulting metadata allows the install:

   ```powershell
   npm install --save-exact @quartz-community/obsidian-flavored-markdown@<new-version>
   ```

   If a step fails, stop and inspect the message and current `git diff` before retrying; do not suppress patch failures. If the patch no longer applies cleanly, review the new package's behavior and re-create or adapt the change using npm's patch workflow rather than forcing the old diff. Inspect the new patch: for AVIF it should still only add `".avif"` to the correct image list, unless there is a documented reason for more.
4. Check `npm patch ls`, the dependency version, the manifest, lockfile and patch diff. Review both tracked changes (`git diff`) and new/untracked files (`git status --short`); `git diff` alone does not show the contents of new files. Run the behavior test and the clean-install verification below. An updated patch is not proven to work until the new version has actually been installed and tested.

## Verify a clean installation and deployment

`npm ci` **deletes and replaces `node_modules` in the directory where it runs**. To protect local edits and prove that committed files are sufficient, first commit the changes on a suitable branch, then use a separate clone. A clone does not include uncommitted or untracked files, including new patch files.

```powershell
# From the original repository, after committing the changes to verify:
$repo = (Get-Location).Path
$testDir = Join-Path $env:TEMP "quartz-patch-verification"
if (Test-Path $testDir) { throw "Choose a different test directory: $testDir" }
git clone --no-hardlinks -- "$repo" "$testDir"
if ($LASTEXITCODE -ne 0) { throw "Clone failed; no installation was attempted." }
Push-Location $testDir
try {
    git log -1 --oneline   # Confirm this is the intended commit before proceeding.
    node --version
    npm --version
    # Stop here if the commit or tool versions are not what you expect.
} finally {
    Pop-Location
}
```

After confirming the commit and tool versions, enter the clone (`Set-Location $testDir`) and run these commands one at a time. **Stop and investigate if any command fails.** `npm ci` replaces `node_modules` in this clone only.

```powershell
npm ci
npm patch ls
npm run verify:obsidian-embeds
npm run check
npm test
npm run build
```

For another patch, also run its own behavior test. Confirm the intended package version and review any installation warnings. `npm patch ls` shows registration, while the behavior test checks what the installed package actually does; neither alone proves every end-to-end behavior. A successful CI clean install is another useful check, but Cloudflare deploys independently of CI.

After deployment, inspect Cloudflare Workers Builds logs for the selected Node/npm versions, clean dependency installation, relevant build-time tests and successful deployment. For AVIF, also open a real page with an AVIF embed and confirm the image displays; the transformer test alone does not check the final image URL or asset serving.

The temporary clone remains for inspection. Delete it only when no work in it needs to be kept; `Remove-Item -LiteralPath $testDir -Recurse -Force` permanently deletes that directory and its contents.
