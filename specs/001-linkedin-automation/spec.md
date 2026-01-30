# Feature Specification: LinkedIn Post Automation

**Feature Branch**: `001-linkedin-automation`  
**Created**: 2026-01-29  
**Status**: Draft  
**Input**: User description: "please implement feature based on @linkedinautomation.md"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Flywheel images organized by topic/post (Priority: P1)

When the Content Flywheel generates images for a topic (hero, social, inline), those images are saved in a content folder structure that clearly associates them with the topic or post they belong to, so the user can find and reuse them later (e.g. when publishing to LinkedIn or editing content).

**Why this priority**: Without organized storage, images from different flywheel runs mix together and cannot be reliably matched to the correct post or topic.

**Independent Test**: Run the Content Flywheel workflow for a topic; verify that generated images are stored under a path that identifies the topic/post (e.g. a folder or naming convention that ties images to the same slug or date-topic as the linkedin/post content). Confirm images can be located for a given post.

**Acceptance Scenarios**:

1. **Given** the flywheel has generated content and images for a topic, **When** assets are written to the repo, **Then** images are stored in a location that designates which topic/post they belong to (e.g. by topic slug or post identifier).
2. **Given** multiple flywheel runs for different topics, **When** a user looks for images for a specific post, **Then** they can identify the correct images for that post without ambiguity.

---

### User Story 2 - Auto-publish LinkedIn posts on merge (Priority: P2)

When a pull request that contains changes in the LinkedIn content area is merged to the main branch, the system automatically publishes the new or updated LinkedIn post(s) to LinkedIn, including an associated image (the one produced by the flywheel for that topic/post), using the LinkedIn developer app.

**Why this priority**: Delivers the core automation value—content goes from merged PR to live LinkedIn with minimal manual steps.

**Independent Test**: Merge a PR that adds or updates markdown under the LinkedIn content path; verify that the corresponding post and image are published to LinkedIn (via the configured developer app) without manual posting.

**Acceptance Scenarios**:

1. **Given** a PR that adds or updates files under the LinkedIn content folder, **When** the PR is merged to main, **Then** a workflow runs that detects the change and publishes the post(s) and associated image(s) to LinkedIn.
2. **Given** a flywheel-generated post with an associated image (from the same topic), **When** the post is published to LinkedIn, **Then** the post appears on LinkedIn with the correct image attached.
3. **Given** no changes in the LinkedIn content folder in a merge, **When** the merge completes, **Then** no LinkedIn publish action is triggered.

---

### Edge Cases

- What happens when a post has no associated image (e.g. image generation failed or was skipped)? System should publish the post without an image or use a defined fallback behavior.
- What happens when the LinkedIn API returns an error (rate limit, auth failure, content rejection)? Workflow should report the failure clearly and optionally retry or allow manual retry.
- What happens when multiple LinkedIn posts are merged in one PR? System should publish each new/updated post (and its image) or define a clear rule (e.g. one post per merge, or batch publish).
- What happens if the same post file is merged again with no content change? System should avoid duplicate posts (idempotent behavior or skip).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST store flywheel-generated images in a content location that designates the topic or post they belong to (e.g. folder or naming that ties images to a topic slug or post identifier).
- **FR-002**: System MUST allow users (or downstream automation) to resolve which images belong to a given LinkedIn post (e.g. by shared topic slug, date, or post identifier).
- **FR-003**: When a merge to the main branch introduces or changes files under the defined LinkedIn content path, the system MUST trigger an automated publish flow.
- **FR-004**: The publish flow MUST send the post content (derived from the merged markdown) and an associated image (from the same topic/post when available) to LinkedIn via the LinkedIn developer app.
- **FR-005**: System MUST use credentials or configuration for the LinkedIn developer app that are kept secure (e.g. secrets) and not exposed in repository content.
- **FR-006**: System MUST handle the case when no image is available for a post (publish without image or use a defined fallback).
- **FR-007**: System MUST report publish success or failure (e.g. workflow status, logs) so operators can correct failures.
- **FR-008**: System MUST avoid publishing duplicate posts for the same content when the publish flow is re-run or the same merge is re-processed (idempotent or skip logic).

### Key Entities

- **LinkedIn post (content)**: A markdown file under the LinkedIn content path representing one post; has metadata (e.g. title, date, slug) and body text used for the LinkedIn post.
- **Post image**: An image asset (hero, social, or inline) generated for the same topic as the post; must be associable with the post (e.g. by slug/date) for attachment when publishing.
- **Topic/post folder or identifier**: A way to group images and posts (e.g. folder per topic slug, or naming convention) so that “this post” maps to “these images.”

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can locate the images for a given LinkedIn post within one minute using the repository structure or naming.
- **SC-002**: A merged PR that adds or updates LinkedIn content results in the corresponding post (and image when available) being published to LinkedIn within five minutes of merge, without manual posting.
- **SC-003**: Publish failures (e.g. LinkedIn API errors) are visible in the automation logs or status so that 100% of failures can be identified and addressed.
- **SC-004**: Re-running the publish workflow for the same merged content does not create duplicate posts on LinkedIn (idempotent or skip).

## Assumptions

- The LinkedIn content path and the flywheel image path are defined and consistent (e.g. `content/linkedin/` for posts; images may live under a topic-scoped path or alongside content).
- The LinkedIn developer app is already created and the organization has the necessary OAuth or API access; the feature integrates with it rather than creating the app.
- “Publish” means creating or updating a post on LinkedIn with the post text and optional image; exact LinkedIn API (e.g. UGC post, share) is an implementation choice.
- One markdown file in the LinkedIn content folder corresponds to one LinkedIn post (or the mapping is clearly defined).
