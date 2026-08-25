# Releases and deployments

## Production release

1. Merge the changes to release into `dev`.
2. In GitHub, open **Releases** and select **Draft a new release**.
3. Choose `dev` as the target, create a new tag following Semantic Versioning
   (for example `v1.2.3`), and publish the release.

Publishing the release starts the **Deploy** workflow automatically. The
workflow validates that the release tag is SemVer, checks out that exact tag,
builds the application image, and deploys it to the `production` GitHub
environment using the workflow's `1-tier` GCP defaults. The Docker image uses
the release tag (for example `diavrank/scaffold-meteor-vue:v1.2.3`).

Use an incremented version for each new release. The supported tag format is
`vMAJOR.MINOR.PATCH`, with an optional prerelease suffix such as
`v1.2.3-rc.1`.

## Manual branch deployment

The **Deploy** workflow can still be run manually from the Actions tab. Select
the branch or commit to deploy, choose the target environment and infrastructure
options, and leave `image_tag` blank to build an image tagged with the selected
environment and commit hash:

```
<environment>-<12-character-commit-sha>
```

For example, deploying a staging branch can create
`staging-a1b2c3d4e5f6`. This makes a branch build easy to identify and reuse
without affecting a production release tag. Set `image_tag` explicitly when a
custom Docker tag is needed, or disable `build_image` to redeploy an existing
image tag.
