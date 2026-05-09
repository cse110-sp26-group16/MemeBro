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
