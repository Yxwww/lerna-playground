# Fooling around with leara



## Learnings

### How does lerna conventional commit figure out exactly how to bump the versions

1. use lerna dependency graph to figure out which package is dirty
2. use `conventional-commit` to figure out the correct version and change log
    1. use `git-semver-tags` for figuring out the tags including latest tag
        - rebasing will erase the tags history. Annotated flags for the `Publish` commit such as `package-name@v0.0.1` will be detached
        - needs to reattach using `git tag -f {tag} main`
            - `git tag --sort=-creatordate` can sort tags by the time of creation
    2. use `git-raw-commits` to figure out the exact changes in each commit
        - when running git log for commits `from..to` is derived from the result of `git-semver-tags`


#### Rule of Thumb
- Do not rebase the `Publish` commits made from lerna
