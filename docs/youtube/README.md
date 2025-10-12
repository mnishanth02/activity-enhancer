# YouTube Video Scripts

This directory contains production-ready video scripts for the Activity Enhancer Chrome extension development series.

## 📋 Script Catalog

All scripts are tracked in `script-catalog.json` with comprehensive metadata including:
- Production status (draft → approved → recorded → edited → published)
- Technical details (complexity, duration, tech stack)
- Commit references and file coverage
- Recording and editing requirements

## 🎬 Available Scripts

### Phase 1: Popup Foundation (Draft)
**File:** `phase1-popup-foundation-20251012.md`  
**Duration:** 6-8 minutes  
**Status:** Draft (awaiting review)  
**Complexity:** High  

**Topics Covered:**
- Type-safe storage with WXT's `storage.defineItem` API
- Zod schema validation and runtime type safety
- Custom query param state management (nuqs-inspired)
- React component architecture and hooks
- Chrome tabs API integration
- Metrics tracking with auto-reset logic

**Stats:**
- 83 files created
- 10,754 lines added
- 5 feature commits
- 11 core implementation files

**Ready for Production:**
- ✅ Complete script with timestamps
- ✅ Screen recording checklist
- ✅ B-roll footage requirements (15-20 clips)
- ✅ Graphics specifications (5 diagrams)
- ✅ Editing markers and transitions
- ✅ SEO optimization guidance

## 🎥 Production Workflow

### 1. Script Review
- [ ] Technical accuracy verification
- [ ] Pacing check (target duration)
- [ ] Accessibility review (caption-friendly)
- [ ] Beginner-friendliness assessment

### 2. Pre-Production
- [ ] Create graphics (architecture diagrams, flowcharts)
- [ ] Prepare code examples and demos
- [ ] Set up recording environment (resolution, fonts)
- [ ] Test screen recording setup

### 3. Recording
- [ ] Record main narration (multiple takes)
- [ ] Capture screen recordings (code walkthrough)
- [ ] Record B-roll footage (terminal, browser, IDE)
- [ ] Record feature demos

### 4. Post-Production
- [ ] Edit to target duration
- [ ] Add graphics overlays
- [ ] Insert code highlighting and annotations
- [ ] Add background music (15% volume)
- [ ] Create thumbnail
- [ ] Generate captions

### 5. Publishing
- [ ] Upload to YouTube
- [ ] Add timestamps in description
- [ ] Set SEO tags and title
- [ ] Update script-catalog.json status

## 📊 Script Organization

Scripts are organized as:
- **Standalone:** Complete feature implementation (6-10 minutes)
- **Integrated:** Chapter in larger series (3-5 minutes)

Organization decision based on:
- Feature complexity (files changed, lines added)
- Existing script structure
- Content relatedness
- User preference

## 🔗 Git Integration

Each script is tracked with git tags:
```bash
git tag -l "youtube-*"
# youtube-script-phase1-foundation-20251012
```

To reference specific implementation:
```bash
git checkout youtube-script-phase1-foundation-20251012
```

## 📝 Script Template Structure

All scripts follow this format:

```markdown
---
script_type: "feature-focused"
feature_name: "[Feature Name]"
target_duration: "X-Y minutes"
complexity_level: "low|medium|high"
---

# [Title]

## INTRO (0:00-0:30)
[Hook, context, learning objectives]

## PART 1-N: [Topic] (timestamps)
[Content with code examples, demos, insights]

## OUTRO (last 30s)
[Key takeaways, next steps, CTA]

## SCREEN RECORDING CHECKLIST
- [ ] Scene 1
- [ ] Scene 2

## B-ROLL FOOTAGE
- Clip 1
- Clip 2

## GRAPHICS NEEDED
1. Diagram 1
2. Diagram 2

## EDITING MARKERS
- [HIGHLIGHT: code]
- [ZOOM: details]
```

## 🚀 Quick Start

### Generate New Script
Follow the instructions in `.github/prompts/feature-youtube-script.prompt.md`

### Review Existing Script
1. Open script file from catalog
2. Check production status
3. Follow checklists for recording/editing

### Update Production Status
Edit `script-catalog.json`:
```json
{
  "production_status": {
    "script_approved": true,
    "recording_complete": false,
    "editing_complete": false,
    "published": false
  }
}
```

## 📚 Resources

- **WXT Documentation:** https://wxt.dev
- **Zod Documentation:** https://zod.dev
- **Chrome Extensions API:** https://developer.chrome.com/docs/extensions
- **React Hook Form:** https://react-hook-form.com

## 🤝 Contributing

When creating new scripts:
1. Follow the feature-youtube-script prompt instructions
2. Update script-catalog.json with metadata
3. Create git tag for version tracking
4. Include all production checklists

## 📧 Feedback

Questions or suggestions? Open an issue or discussion in the repository.

---

**Last Updated:** October 12, 2025  
**Total Scripts:** 1  
**Scripts Published:** 0  
**Scripts In Production:** 1
