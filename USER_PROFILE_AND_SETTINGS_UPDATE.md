# User Profile and Settings Panel Update

## Overview
This update adds comprehensive user profile management, converts the Settings & Utilities to a proper draggable panel, and adds file save/load functionality to the Notes panel.

## Features Implemented

### 1. User Profile Management System

#### File: `src/js/user-profile-manager.js`
A complete profile management system that saves:
- **Theme preferences** - Selected cyberpunk theme
- **Sound settings** - Enabled state and volume level
- **Panel layouts** - Complete panel positions and states

#### Profile Features:
- Create multiple user profiles
- Switch between profiles instantly
- Export profiles to JSON files
- Import profiles from files
- Delete unwanted profiles
- Default profile that cannot be deleted
- Automatic saving of current settings

#### Profile Data Structure:
```javascript
{
  name: "Profile Name",
  theme: "neon-synthwave",
  soundEnabled: true,
  soundVolume: 0.5,
  layout: { /* panel layout data */ },
  createdAt: "ISO timestamp",
  lastModified: "ISO timestamp"
}
```

### 2. Settings & Utilities Panel Upgrade

#### Converted from Dialog to Full Panel
The Settings & Utilities is now a proper draggable panel with:
- **Drag/drop** functionality
- **Minimize/maximize** capability
- **Proper close button**
- **Resizable** (default 600x500px)

#### Four Organized Tabs:

**General Tab:**
- Theme selector button
- Sound enable/disable toggle
- Volume slider with real-time adjustment
- Auto-save layout option

**User Profiles Tab:**
- Current profile display
- Profile list with load/delete options
- Create new profile button
- Import/export profile buttons
- Visual indication of active profile

**Performance Tab:**
- Toggle performance mode button
- Open performance monitor button

**Utilities Tab:**
- Debug panel launcher
- Export campaign data
- Import campaign data
- Clear all data (with confirmation)

### 3. Notes Panel File Management

#### File: `src/js/notes-file-manager.js`
Complete file management system for notes:

**Save Options:**
- **Text (.txt)** - Plain text without formatting
- **HTML (.html)** - Full formatting with cyberpunk styling
- **Markdown (.md)** - Markdown format with basic conversion

**Load Options:**
- Supports .txt, .md, and .html files
- Preserves formatting when loading HTML
- Converts text/markdown to editable content

**UI Integration:**
- Save button (📥) in notes toolbar
- Load button (📤) in notes toolbar
- Format selection dropdown on save
- Status messages for operations

### 4. CSS Styling Updates

#### File: `src/styles/enhanced-panels-fixed.css`
Added comprehensive styling for:
- User profile manager UI
- Profile list items with hover effects
- Active profile highlighting
- Danger buttons for delete operations
- Notes file action buttons

## Technical Implementation

### Integration Points

1. **Theme Manager Integration**
   - Profiles save and restore theme selections
   - Seamless theme switching on profile load

2. **Sound Manager Integration**
   - Volume and enabled state saved per profile
   - Instant audio settings update on profile switch

3. **Panel System Integration**
   - Complete layout capture and restore
   - Panel states preserved (minimized, positions, sizes)

4. **Local Storage Usage**
   - `cyberpunk-user-profiles` - All profile data
   - `cyberpunk-current-profile` - Active profile name
   - Existing storage keys preserved

### File Operations

**Save Operations:**
- Uses Blob API for file creation
- Automatic filename generation with timestamps
- Proper MIME types for each format

**Load Operations:**
- FileReader API for file reading
- Format detection by file extension
- Error handling for invalid files

## Usage Instructions

### Creating a User Profile
1. Click Settings (⚙️) in header
2. Go to "User Profiles" tab
3. Click "Create New Profile"
4. Enter a unique name
5. Current settings are saved to the profile

### Switching Profiles
1. Open Settings panel
2. Go to "User Profiles" tab
3. Click "Load" next to desired profile
4. All settings instantly applied

### Exporting/Importing Profiles
**Export:**
1. Click "Export Current" to save active profile
2. File downloads as JSON

**Import:**
1. Click "Import Profile"
2. Select a .json profile file
3. Profile added to list

### Saving Notes to File
1. Open a Notes panel
2. Click the save icon (📥)
3. Choose format (Text, HTML, or Markdown)
4. File downloads automatically

### Loading Notes from File
1. Open a Notes panel
2. Click the load icon (📤)
3. Select a .txt, .md, or .html file
4. Content loads into editor

## File Structure Changes

### New Files Added:
- `src/js/user-profile-manager.js` - Profile management system
- `src/js/notes-file-manager.js` - File operations for notes

### Modified Files:
- `cyberpunk-gm-screen.html` - Updated showSettingsDialog function
- `src/styles/enhanced-panels-fixed.css` - Added profile and file UI styles
- `src/js/notes-text-editor.js` - Added file save/load buttons

### Script Load Order:
```html
<script src="src/js/user-profile-manager.js"></script>
<script src="src/js/notes-file-manager.js"></script>
<script src="src/js/night-city-map.js"></script>
```

## Benefits

1. **Personalization** - Each user can have their preferred setup
2. **Portability** - Export profiles to share or backup
3. **Efficiency** - Quick switching between different configurations
4. **Data Preservation** - Notes can be saved externally
5. **Professional Workflow** - Proper file management for campaigns

## Future Enhancements

1. **Cloud Sync** - Optional cloud storage for profiles
2. **Profile Templates** - Pre-made profiles for different play styles
3. **Auto-backup** - Scheduled profile backups
4. **Profile Sharing** - Community profile exchange
5. **Advanced File Formats** - PDF export, RTF support

## Testing Checklist

- [x] Settings panel opens as draggable panel
- [x] All tabs in settings panel functional
- [x] Profile creation works
- [x] Profile switching applies all settings
- [x] Profile export/import functional
- [x] Notes file save in all formats
- [x] Notes file load preserves content
- [x] Panel behaviors (drag/minimize/close) work
- [x] Sound settings update in real-time
- [x] Theme changes save to profile