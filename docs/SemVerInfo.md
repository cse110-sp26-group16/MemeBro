# Semantic Versioning Guide

## Why do we use Semantic Versioning?

The way you write your `CHANGELOG.md` ‘s updates show other developers how significant your update was to your product. This helps distinguish between a new feature, bug fixes, or a major update of your product. If you think of it in terms of npm package, semantic versioning helps others who use your package understand how much the package has changed and whether or not they need to alter their own code.

## The Semantic Versioning Format

| Code Status | Stage		| Rule	    | Example Version |
| :---        |    :----:   |    :----:     |			---: |
| First release     | New product      | Start with 1.0.0  | 1.0.0                                     |
| Backward compatible bug fixes  | Patch release       | Increment the third digit     | 1.0.1		     |
| Backward compatible new features   | Minor release       | Increment the middle digit and reset last digit to zero      | 1.1.0		     |
| Changes that break backward compatibility   | Major release       | Increment the first digit and reset middle and last digits to zero     | 2.0.0 |  


## Semantic Versioning Specifics

1. Software using Semantic Versioning MUST declare a public API. This API could be declared in the code itself or exist strictly in documentation. However it is done, it SHOULD be precise and comprehensive
2. A normal version number MUST take the form X.Y.Z where X, Y, and Z are non-negative integers, and MUST NOT contain leading zeroes. X is the major version, Y is the minor version, and Z is the patch version. Each element MUST increase numerically. For instance: 1.9.0 -> 1.10.0 -> 1.11.0.
3. Once a versioned package has been released, the contents of that version MUST NOT be modified. Any modifications MUST be released as a new version
4. Major version zero (0.y.z) is for initial development. Anything MAY change at any time. The public API SHOULD NOT be considered stable.
5. Version 1.0.0 defines the public API. The way in which the version number is incremented after this release is dependent on this public API and how it changes.
6. Patch version Z (x.y.Z | x > 0) MUST be incremented if only backward compatible bug fixes are introduced. A bug fix is defined as an internal change that fixes incorrect behavior.
7. Minor version Y (x.Y.z | x > 0) MUST be incremented if new, backward compatible functionality is introduced to the public API. It MUST be incremented if any public API functionality is marked as deprecated. It MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes. Patch version MUST be reset to 0 when minor version is incremented.
8. Major version X (X.y.z | X > 0) MUST be incremented if any backward incompatible changes are introduced to the public API. It MAY also include minor and patch level changes. Patch and minor versions MUST be reset to 0 when major version is incremented.
9. A pre-release version MAY be denoted by appending a hyphen and a series of dot separated identifiers immediately following the patch version. Identifiers MUST comprise only ASCII alphanumerics and hyphens [0-9A-Za-z-]. Identifiers MUST NOT be empty. Numeric identifiers MUST NOT include leading zeroes. Pre-release versions have a lower precedence than the associated normal version. A pre-release version indicates that the version is unstable and might not satisfy the intended compatibility requirements as denoted by its associated normal version. Examples: 1.0.0-alpha, 1.0.0-alpha.1, 1.0.0-0.3.7, 1.0.0-x.7.z.92, 1.0.0-x-y-z.--.
10. Build metadata MAY be denoted by appending a plus sign and a series of dot separated identifiers immediately following the patch or pre-release version. Identifiers MUST comprise only ASCII alphanumerics and hyphens [0-9A-Za-z-]. Identifiers MUST NOT be empty. Build metadata MUST be ignored when determining version precedence. Thus two versions that differ only in the build metadata, have the same precedence. Examples: 1.0.0-alpha+001, 1.0.0+20130313144700, 1.0.0-beta+exp.sha.5114f85, 1.0.0+21AF26D3----117B344092BD.
11. Precedence refers to how versions are compared to each other when ordered.
  - Precedence MUST be calculated by separating the version into major, minor, patch and pre-release identifiers in that order (Build metadata does not figure into precedence).
  - Precedence is determined by the first difference when comparing each of these identifiers from left to right as follows: Major, minor, and patch versions are always compared numerically.
      - Ex.  1.0.0 < 2.0.0 < 2.1.0 < 2.1.1.
  - When major, minor, and patch are equal, a pre-release version has lower precedence than a normal version:
      - Ex. 1.0.0-alpha < 1.0.0.


