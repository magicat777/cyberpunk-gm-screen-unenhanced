# Pull Request: Resolve Footer Conflicts in Documentation Pages

## Summary
- Resolved conflicts between standardized footers and detailed content in documentation pages
- Standardized HTML structure with consistent header, navigation and footer across all pages
- Created workflow automation scripts to prevent future sync issues between src/frontend and docs

## Implementation Details

### 1. Conflict Resolution
This PR resolves the merge conflicts in the HTML pages located in the `pages` directory. The conflicts arose because of differences between:
- Detailed page content with rich information
- Standardized footer structure with consistent navigation links

I resolved these conflicts by ensuring both versions were properly synchronized, keeping both the detailed content and the standardized footer structure.

### 2. Workflow Improvements
To prevent similar issues in the future, I created two utility scripts:
- `merge-content-preserving-structure.sh`: Bash script for merging content between HTML files while preserving structure
- `merge_content.py`: Python implementation of the same functionality with better error handling

These scripts extract the content from the main section of HTML files while preserving the surrounding structure, ensuring consistent headers and footers.

### 3. File Synchronization
All HTML pages in both the `src/frontend/pages` and `docs/pages` directories now contain identical content, resolving any prior conflicts:
- about.html
- attributions.html
- feedback.html
- help.html
- license.html
- privacy.html
- shortcuts.html

## Test Plan
- Verified all pages render correctly with their detailed content
- Confirmed standardized footer is present on all pages
- Tested all navigation links between pages
- Validated HTML structure is consistent across all files
- Confirmed proper synchronization between src/frontend and docs directories

## Related Issues
This PR resolves the merge conflicts that were preventing the merge of improvements to the documentation pages.