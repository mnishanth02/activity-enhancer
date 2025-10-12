# Feature YouTube Script Generator - Usage Guide

## Quick Start

This prompt generates focused YouTube scripts for individual features during development. It's designed to work seamlessly with your development workflow.

## Basic Usage

### 1. Auto-detect Latest Feature (Recommended)

```bash
# Just run the prompt - it will analyze your recent commits and detect the latest feature
# Works best after completing a feature and making several related commits
```

### 2. Specify Feature Name

```bash
FEATURE_NAME="useCurrentDomain hook implementation"
# Use when you want to focus on a specific feature by name
```

### 3. Analyze Specific Commit Range

```bash
COMMIT_RANGE="abc123..def456"
# Use when you want to analyze a specific range of commits
```

### 4. Control Script Organization

```bash
SCRIPT_ORGANIZATION_PREFERENCE="standalone"  # Creates separate file
SCRIPT_ORGANIZATION_PREFERENCE="integrated"  # Adds to main script
SCRIPT_ORGANIZATION_PREFERENCE="auto"        # Let system decide (default)
```

## Configuration Options

| Variable | Default | Description |
|----------|---------|-------------|
| `FEATURE_NAME` | auto-detect | Specific feature to focus on |
| `COMMIT_RANGE` | auto-detect | Specific commit range to analyze |
| `SCRIPT_ORGANIZATION_PREFERENCE` | auto | How to organize the script |
| `COMMIT_DEPTH` | 10 | How many recent commits to analyze |

## Output Structure

The prompt generates:

1. **Feature Script** (`docs/youtube/feature-YYYYMMDD-[feature-name].md`)
   - Complete video script (3-7 minutes)
   - Production notes and checklists
   - Specific commit references and code examples

2. **Script Catalog** (`docs/youtube/script-catalog.json`)
   - Metadata for all generated scripts
   - Production tracking
   - Easy reference for future updates

3. **Git Integration**
   - Commits the generated files
   - Tags the state for future reference
   - Maintains clean development history

## Best Practices

### When to Run

- ✅ After completing a feature implementation
- ✅ After fixing a complex bug with multiple commits
- ✅ After adding significant functionality
- ✅ Before merging a feature branch

### When NOT to Run

- ❌ After single-line fixes
- ❌ After only configuration changes
- ❌ During active development (incomplete features)
- ❌ For purely documentation commits

### Script Organization Guidelines

**Standalone Scripts** (separate files):

- Complex features (>5 files changed)
- New major functionality
- Features that could be standalone tutorials
- When you want focused, shareable content

**Integrated Scripts** (added to main script):

- Small enhancements to existing features
- Bug fixes with interesting solutions
- Incremental improvements
- Related functionality additions

## Example Workflow

```bash
# 1. Complete feature development
git add .
git commit -m "feat: implement user authentication with JWT tokens"

# 2. Run script generator (using Copilot Agent)
# The prompt will auto-detect the authentication feature and generate a focused script

# 3. Review generated script
# Edit docs/youtube/feature-YYYYMMDD-user-authentication.md as needed

# 4. Record video using the script
# Follow the screen recording checklist in the generated script

# 5. Repeat for next feature
```

## Integration with Development Process

### Sprint-based Development

- Generate scripts at end of each sprint for completed features
- Use for demo preparation and documentation
- Share with team for knowledge transfer

### Feature Branch Workflow

- Run before merging feature branches
- Include script generation in PR checklist
- Use for code review discussions

### Release Preparation

- Generate scripts for all features in upcoming release
- Compile into release announcement content
- Create comprehensive feature overview videos

## Script Content Structure

Each generated script includes:

1. **Feature Overview** (0:00-0:30)
   - Problem solved
   - Key technologies used
   - Learning objectives

2. **Implementation Deep Dive** (0:30-[END-0:30])
   - Planning and setup
   - Core implementation
   - Integration and testing
   - Refinements and polish

3. **Wrap-up** (Last 0:30)
   - Key takeaways
   - Next steps
   - Call to action

4. **Production Notes**
   - Screen recording checklist
   - B-roll footage needs
   - Graphics requirements
   - Editing markers

## Troubleshooting

### "No features detected"

- Ensure you have feat: commits in recent history
- Try specifying FEATURE_NAME manually
- Increase COMMIT_DEPTH to analyze more commits

### "Script too short/long"

- Complexity auto-detection usually handles this
- Manually adjust the generated script length
- Consider splitting complex features into multiple scripts

### "Existing script conflicts"

- Review script catalog to see existing content
- Use SCRIPT_ORGANIZATION_PREFERENCE to control behavior
- Manually organize scripts in docs/youtube/ folder

## File Structure

After running the prompt multiple times, your structure will look like:

```text
docs/youtube/
├── script-catalog.json              # Index of all scripts
├── feature-20251012-authentication.md
├── feature-20251015-ui-components.md
├── feature-20251018-state-management.md
└── main-script.md                   # Optional integrated script
```
