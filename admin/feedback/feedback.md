# Team 16's Code Review of Team 19

## Who Reviewed And What?

- **Process & Agile Method:** Koji Nakazawa
- **Version Control & Commits:** Jennifer Zhu
- **CI/CD & Tooling:** Angelo Jas Sespene
- **Style Enforcement:** Alec Lichtenberger
- **Testing:** Yuval Pesok
- **Code Quality & Documentation:** Jordan Junaidi
- **Architecture & ADRs:** Tim Wu
- **AI Usage:** Roy Martinez
- **Product & UX:** Harvey Zhang
- **Technical Constraints Compliance:** Bowen Wu

---

# 1. Process & Agile Method
**Contributed by:** Koji Nakazawa

### Worked Well
- They have a solid setup for how the team works.
- `CONTRIBUTING.md` explains branch names, how to open issues, and how to do PRs.
- They also have meeting notes organized by week with sprint planning and retros, which makes it easy to see what they planned and what actually happened.
- Their issue and PR templates are actually useful.
- Branches tend to use issue numbers like `feat/10-frontend`, and PRs include a checklist and test steps, so you can tell what changed and why without digging through random commits.

### Improvement / Nice to Have
- A lot of PRs got merged without formal GitHub reviews.
- Some had comments but no actual approve/request changes.
- They should make at least one teammate leave a real review before merging.

### Custom Feedback
- Meeting docs are good early on but get spotty later.
- Week 8 planning still has placeholder names and some weeks are mostly empty.
- They wrote down a 24-hour PR review idea in their retro, which is good, but it seems inconsistent.
- They should incorporate Slack pings or rotational code review duties.

---

# 2. Version Control & Commits
**Contributed by:** Jennifer Zhu

### Worked Well
- Team 19 successfully uses a clean branching structure to isolate backend updates from frontend changes and different features within those areas.
- PRs are opened and closed for feature milestones, which clearly shows how the project evolved throughout the quarter.
- Additionally, there are commit messages following Conventional Commits with structural elements like `feat:`, `fix:`, `docs:`, etc.

### Improvement / Nice to Have
- There are some inconsistencies in the commit messages where some of them don’t follow Conventional Commits.
- This makes it harder to follow the commit history.

### Custom Feedback
- There are quite a few merge pull request messages in each branch, which clutters up the commit history.
- Team 19 should try to minimize merging `main` into their feature branches unless it’s absolutely needed to resolve a conflict.
- There are some repetitive commit messages back-to-back like “added formatting for MD files,” which can be confusing because it doesn’t help describe how these commits are different from each other.

---

# 3. CI/CD & Tooling
**Contributed by:** Angelo Jas Sespene

### Worked Well
- Team 19 successfully configured their automation workflows to trigger continuously across parallel development branches.
- This can be seen on both standard code pushes and incoming pull requests.
- This makes it easy to track the structural execution health of the program.
- If anyone updates the project, their system checks their code for errors each time.
- They established a native execution command for automated evaluation locally in their `package.json` file.
- I ran it locally and confirmed they have a fast 24-test suite that validates the core modules in the repo.
- This includes asset fetching, canvas rendering, and the error handler in milliseconds.

### Improvement / Nice to Have
- The GitHub Actions workflow block is labeled `lint`.
- However, in their `package.json` configurations, they don’t have ESLint or Stylelint dependencies from their workspace architecture.
- They only have Prettier layout matching, meaning they do not have any mechanical validation gates to block logic defects, broken variable scopes, or missing JSDocs requirements.

### Missing Verification Layer
- The repo has a well-built automated execution script that can pass all 24 core unit tests locally.
- However, it’s not included in the `ci.yml`, so it's not running in the cloud.
- This means that if someone writes broken code and submits a pull request, their automated system won’t catch it.
- They need to add `npm test` to their cloud configuration file so the system tests and checks before the pull request is allowed to be merged.

### False Security
- There is a big mismatch between what the automation says it is doing and what it is actually doing.
- Even though `LINT` is labeled as meaning that the code is being analyzed for logic errors, bad syntax, and possible bugs, the commands in the JSON file are only actually running Prettier.
- Prettier only checks spacing, commas, and formatting.
- This can give the false idea that their code logic is good even though it wasn’t checked thoroughly.

---

# 4. Style Enforcement
**Contributed by:** Alec Lichtenberger

### Worked Well
- Team 19 successfully explained decisions about the style guidelines they chose and why they did not choose other style formats or libraries.
- They created CI/CD workflows that checked for Prettier formatting upon pushes and PR requests on branches.

### Improvement / Nice to Have
- Add a pre-commit hook that will check style guidelines on each commit.
- This makes sure that trivial formatting issues are caught before pushing, potentially saving time and making sure that small errors do not leak into the codebase.

### Custom Feedback
- Style is properly enforced on all files already existing within the codebase.
- Solid Prettier guidelines are used, and the guidelines are pulled from style formats already used in the industry.

---

# 5. Testing
**Contributed by:** Yuval Pesok

### Worked Well
- Their core modules are set up to take their dependencies as inputs so the logic actually gets tested without needing a browser.
- They use fake information for their canvas, image, `FileReader`, fetch, and local storage.
- This allows them to test different functionalities such as meme drawing, image loading, export, and template caching all as plain functions.
- This is really cool because it seems like some of those things are probably really annoying to test since they all depend on the browser.
- It allows them to test without needing a running browser.
- They have really good coverage of a lot of weird cases on the files they test, not just obvious issues that might show up.
- They also run lots of tests for errors across their software like export errors, `FileReader` errors, and API response failures.
- They also have testing for refresh logic, fresh data, and stale data.
- Specific assertions in their testing make it obvious as to what is being tested.

### Improvement / Nice to Have
- Their CI doesn’t actually run any of the tests.
- Right now, their workflow only does a Prettier format check.
- Even though `npm test` exists, a broken test won't actually fail a PR.
- PRs with broken tests can still go through.
- Adding a test job in the workflow would be really good.

### Custom Feedback
- They have a lot of testing for the logic files, such as the export, image, meme, and templates files.
- However, their frontend files have zero tests (`upload`, `edit`, `result`, `templates` page).
- It would be good to test the user-facing behavior because those are what the users actually see and experience.
- Errors there could be costly as well.
- Right now, all of their tests are just unit tests with mock data.
- There are no actual end-to-end tests with a real user flow, such as uploading a photo, picking a template, adding text, and exporting.
- Even one E2E test can go a long way.
- Including this in the CI workflow would also be great.

---

# 6. Code Quality & Documentation
**Contributed by:** Jordan Junaidi

### Worked Well
- There are a lot of high-quality “why” comments across different files, such as in `src/export.js` and `src/image-loader.js`.
- These comments are effective because they explain certain decisions made and the tradeoffs of making those decisions.
- JSDocs are present in many of the files and usually explain the purposes of the functions and how they should be used.
- Some of the really strong examples, such as in `src/export.js` and `src/meme-canvas.js`, are very effective because they also document constraints, expected inputs, and design decisions.

### Improvement / Nice to Have
- JSDoc coverage is somewhat inconsistent across the frontend.
- In some files, every function is documented.
- In others, such as `src/frontend/scripts/upload.js` and `src/frontend/scripts/header.js`, there are no JSDoc comments at all.

### Custom Feedback
- Some JSDoc comments are not very helpful because they just restate what the function header already says.
- This can be improved by including more information about design decisions and use cases.
- Some functions have implementations that are harder to understand without clear documentation explaining them.
- For example, the `applyFilters()` function in `src/frontend/scripts/template-page.js` checks if `template.box_count < 4`, but it is unclear what that statement is checking in the context of the project.

---

# 7. Architecture & ADRs
**Contributed by:** Tim Wu

### Worked Well
- Team 19 has a very organized repository structure with a strong separation between documentation and implementation.
- The project clearly distinguishes `docs/` for research/design/process work and `src/` for application code.
- This improves maintainability and onboarding for new contributors.
- The backend architecture shows good experimentation by having three different prototype pipelines (`a`, `b`, and `c`) in `src/backend/pipelines/`.
- Before choosing the final pipeline, it is good to have competing implementations in isolation to prevent the team from contaminating the backend structure too early.

### Improvement / Nice to Have
- The repository does mention ADR usage and “living technical docs,” which is good from a software engineering point of view.
- However, the amount of ADRs is not really in line with the amount of big technical decisions in the repository.
- More specific ADRs would help explain decisions about pipeline choice, deployment architecture, backend service choice, and image-processing flow.
- This would help future contributors understand the tradeoffs and long-term implications.

### Custom Feedback
- The overall frontend architecture is good and well modularized.
- The main functions of the site (meme rendering, image loading, fetching templates, exporting) are broken up into their own files rather than one large script.
- This enhances the codebase’s extensibility and debugging.
- Further traceability between the docs and the implementation could make the architecture documentation even better.
- Architecture diagrams or ADRs could link directly to implementation modules to make it easier to connect design decisions to actual code.

---

# 8. AI Usage
**Contributed by:** Roy Martinez

### Worked Well
- The markdown file explaining why the team is using Claude Haiku 4.5 is very detailed and provides strong numerical details as well.
- It is nice that the team has another model to fall back onto for more complicated prompts and images.

### Improvement / Nice to Have
- I would suggest a text limit for users, as the difference between Sonnet and Haiku’s monthly cost will start to add up.

### Custom Feedback
- When users are able to upload their own photos rather than select from templates, will AI be used to detect if users are uploading inappropriate or hateful photos?
- Will certain words be restricted similar to how LLMs do not accept prompts that promote hate speech?
- I would review whether there will be any keywords or prompt-length thresholds used when deciding to switch from Haiku to Sonnet.
- I would also question whether users should be allowed to choose between Haiku or Sonnet as an option and whether that choice would be free or require some prerequisite, such as paid options or account creation.

---

# 9. Product & UX
**Contributed by:** Harvey Zhang

### Worked Well
- The team had clear personas and user stories that matched the goal of making memes fast and easy.
- The Figma shows a simple flow: upload a picture, browse templates, edit, then download.

### Improvement / Nice to Have
- Make sure the main flow takes very few clicks so it feels faster and more streamlined.

### Custom Feedback
- Consider adding lightweight onboarding or placeholder examples for first-time users.
- A preview before exporting could help users catch mistakes earlier.
- Mobile responsiveness should be prioritized since meme creation is often done casually on phones.
- Accessibility improvements like keyboard navigation and alt text could make the app more inclusive.

---

# 10. Technical Constraints Compliance
**Contributed by:** Bowen Wu

### Worked Well
- The frontend sticks to plain HTML, CSS, and JS the whole way through.
- Their tooling is really lightweight.
- The only dev dependency is Prettier.
- Tests run on Node’s built-in test runner instead of pulling in Jest or Vitest.
- They also commit to ES modules across the whole project and check in their lockfile, so anyone on the team can clone the repo and get going without a weird setup.

### Improvement / Nice to Have
- There’s a known mismatch where the backend Pipeline A files are written with CommonJS syntax even though the `package.json` says the project is ESM.
- This breaks running tests and the server in that folder.
- They flagged it as an issue already, but it’s worth bumping up the priority since it affects anyone trying to actually run that pipeline.

### Custom Feedback
- They have a `decisions/` folder set up for ADRs, but there’s only one in there so far.
- A lot of bigger architectural calls have already been made, such as going with Cloudflare, so writing a few more ADRs would be helpful.
- The backend folders are scaffolded out nicely, but they’re mostly empty `.gitkeep` placeholders right now.