/**
 * Enhanced Notes Text Editor Implementation
 * Provides a feature-rich text editor for the Cyberpunk GM Screen notes panel
 * 
 * Features:
 * - Rich text formatting (bold, italic, underline, headings, etc.)
 * - Code syntax highlighting
 * - File import/export
 * - Local storage with multiple note documents
 * - Keyboard shortcuts
 * - Markdown support
 * - Table creation/editing
 * - Image insertion
 * - Full screen mode
 */

// Initialize global vars
let notesEditorInstances = [];
let currentNoteId = 'default-note';

/**
 * Create an enhanced notes panel with advanced text editing capabilities
 * @returns {HTMLElement} The panel DOM element
 */
function createEnhancedNotesPanel() {
    console.log('Creating enhanced notes panel with advanced editor');
    
    try {
        // Try to use the standard panel creation function
        const createPanelFunc = (typeof createPanel === 'function') ? createPanel : window.createPanel;
        const panel = createPanelFunc('Notes');
        
        if (!panel) {
            console.error('Panel creation failed - createPanel returned null or undefined');
            throw new Error('Panel creation failed');
        }
        
        const content = panel.querySelector('.panel-content');
        if (!content) {
            console.error('Could not find .panel-content in Notes Panel');
            throw new Error('Panel-content not found');
        }
        
        // Make the notes panel larger by default
        panel.style.width = '500px';
        panel.style.height = '400px';
        panel.style.resize = 'both';
        panel.style.overflow = 'hidden';
        
        // Add resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.bottom = '0';
        resizeHandle.style.right = '0';
        resizeHandle.style.width = '15px';
        resizeHandle.style.height = '15px';
        resizeHandle.style.cursor = 'nwse-resize';
        resizeHandle.style.background = 'linear-gradient(135deg, transparent 50%, rgba(0, 204, 255, 0.5) 50%)';
        resizeHandle.style.zIndex = '100';
        panel.appendChild(resizeHandle);
        
        // Generate a unique ID for this panel
        const panelId = panel.id || `notes-panel-${Date.now()}`;
        panel.id = panelId;
        
        // Add styles for the enhanced editor
        addEditorStyles(panelId);
        
        // Create the editor UI
        content.innerHTML = createEditorHtml(panelId);
        
        // Initialize the editor functionality
        initializeEditor(panel, panelId);
        
        // Try to load saved notes
        loadNotesList(panelId);
        loadCurrentNote(panelId);
        
        console.log('Enhanced notes panel fully initialized');
        return panel;
    }
    catch (error) {
        console.error('Error creating enhanced notes panel:', error);
        return createFallbackNotesPanel(error);
    }
}

/**
 * Add the required CSS styles for the enhanced editor
 * @param {string} panelId - Unique panel identifier
 */
function addEditorStyles(panelId) {
    const styleId = `notes-editor-styles-${panelId}`;
    
    // Check if styles are already added
    if (document.getElementById(styleId)) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* Editor container */
        .enhanced-notes-container {
            display: flex;
            flex-direction: column;
            height: 100%;
            font-family: var(--font-content, 'Segoe UI', Tahoma, sans-serif);
            overflow: hidden; /* Ensure content doesn't overflow */
        }
        
        /* Resize handle styles */
        .panel .resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 15px;
            height: 15px;
            cursor: nwse-resize;
            background: linear-gradient(135deg, transparent 50%, rgba(0, 204, 255, 0.5) 50%);
            z-index: 100;
        }
        
        /* Notes selector and management */
        .notes-document-bar {
            display: flex;
            background-color: rgba(20, 20, 35, 0.95);
            border-bottom: 1px solid var(--theme-secondary, #ff00aa);
            padding: 5px;
            align-items: center;
        }
        
        .notes-selector {
            flex: 1;
            background-color: rgba(30, 30, 45, 0.9);
            color: var(--theme-text-primary, #e0e0e0);
            border: 1px solid var(--theme-primary, #00ccff);
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 12px;
            margin-right: 5px;
        }
        
        .notes-document-button {
            background-color: rgba(40, 40, 60, 0.9);
            color: var(--theme-text-primary, #e0e0e0);
            border: 1px solid var(--theme-primary, #00ccff);
            border-radius: 3px;
            padding: 3px 6px;
            font-size: 12px;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .notes-document-button:hover {
            background-color: rgba(60, 60, 90, 0.9);
        }
        
        /* Main toolbar */
        .enhanced-notes-toolbar {
            background-color: rgba(25, 25, 40, 0.95);
            border-bottom: 1px solid var(--theme-primary, #00ccff);
            padding: 5px;
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
        }
        
        .toolbar-group {
            display: flex;
            gap: 3px;
            border-right: 1px solid rgba(200, 200, 255, 0.2);
            padding-right: 5px;
            margin-right: 2px;
        }
        
        .toolbar-group:last-child {
            border-right: none;
        }
        
        .editor-button {
            background-color: rgba(40, 40, 60, 0.9);
            color: var(--theme-text-primary, #e0e0e0);
            border: 1px solid var(--theme-primary, #00ccff);
            border-radius: 3px;
            padding: 3px 6px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
            min-width: 24px;
            text-align: center;
        }
        
        .editor-button:hover {
            background-color: rgba(60, 60, 90, 0.9);
        }
        
        .editor-button.active {
            background-color: rgba(0, 120, 170, 0.6);
        }
        
        .editor-button img {
            width: 14px;
            height: 14px;
            vertical-align: middle;
        }
        
        .editor-button[disabled] {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        /* Format dropdown */
        .format-dropdown {
            position: relative;
            display: inline-block;
        }
        
        .format-dropdown-content {
            display: none;
            position: absolute;
            background-color: rgba(25, 25, 40, 0.95);
            border: 1px solid var(--theme-primary, #00ccff);
            border-radius: 3px;
            min-width: 150px;
            z-index: 1000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .format-dropdown-content button {
            width: 100%;
            text-align: left;
            padding: 6px 10px;
            background: none;
            border: none;
            color: var(--theme-text-primary, #e0e0e0);
            font-size: 12px;
            cursor: pointer;
        }
        
        .format-dropdown-content button:hover {
            background-color: rgba(60, 60, 90, 0.9);
        }
        
        .format-dropdown.open .format-dropdown-content {
            display: block;
        }
        
        /* Main editor area */
        .enhanced-notes-editor {
            flex: 1;
            background-color: rgba(15, 15, 25, 0.9);
            border: none;
            color: var(--theme-text-primary, #e0e0e0);
            padding: 10px;
            font-size: 14px;
            line-height: 1.4;
            outline: none;
            overflow-y: auto;
        }
        
        .enhanced-notes-editor[contenteditable="true"] {
            cursor: text;
        }
        
        /* Editor fullscreen mode */
        .notes-editor-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            background-color: rgba(10, 10, 20, 0.97) !important;
        }
        
        /* Footer */
        .enhanced-notes-footer {
            padding: 5px;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: rgba(200, 200, 255, 0.7);
            border-top: 1px solid rgba(200, 200, 255, 0.2);
            background-color: rgba(20, 20, 35, 0.9);
        }
        
        .word-count {
            color: rgba(180, 180, 220, 0.8);
        }
        
        .notes-status {
            text-align: right;
            min-width: 100px;
        }
        
        /* Text styling */
        .enhanced-notes-editor b, .enhanced-notes-editor strong {
            color: var(--theme-primary, #00ccff);
        }
        
        .enhanced-notes-editor i, .enhanced-notes-editor em {
            color: #ffcc00;
        }
        
        .enhanced-notes-editor u {
            text-decoration-color: var(--theme-primary, #00ccff);
        }
        
        .enhanced-notes-editor h1, .enhanced-notes-editor h2, .enhanced-notes-editor h3 {
            color: var(--theme-primary, #00ccff);
            border-bottom: 1px solid rgba(0, 204, 255, 0.3);
            margin-top: 10px;
            margin-bottom: 10px;
        }
        
        .enhanced-notes-editor h1 {
            font-size: 1.5em;
        }
        
        .enhanced-notes-editor h2 {
            font-size: 1.3em;
        }
        
        .enhanced-notes-editor h3 {
            font-size: 1.1em;
        }
        
        .enhanced-notes-editor a {
            color: #55aaff;
            text-decoration: underline;
        }
        
        .enhanced-notes-editor blockquote {
            border-left: 3px solid var(--theme-primary, #00ccff);
            margin-left: 5px;
            padding-left: 10px;
            color: rgba(200, 200, 255, 0.8);
            font-style: italic;
        }
        
        .enhanced-notes-editor code {
            font-family: monospace;
            background-color: rgba(30, 30, 45, 0.9);
            padding: 2px 4px;
            border-radius: 3px;
            color: #ff5555;
        }
        
        .enhanced-notes-editor pre {
            font-family: monospace;
            background-color: rgba(30, 30, 45, 0.9);
            padding: 8px;
            border-radius: 3px;
            border-left: 2px solid #ff5555;
            color: #f0f0f0;
            white-space: pre-wrap;
            margin: 10px 0;
        }
        
        .enhanced-notes-editor table {
            border-collapse: collapse;
            width: 100%;
            margin: 10px 0;
        }
        
        .enhanced-notes-editor th {
            background-color: rgba(0, 150, 200, 0.2);
            border: 1px solid rgba(0, 204, 255, 0.5);
            padding: 5px;
            color: var(--theme-primary, #00ccff);
        }
        
        .enhanced-notes-editor td {
            border: 1px solid rgba(200, 200, 255, 0.2);
            padding: 5px;
        }
        
        .enhanced-notes-editor tr:nth-child(even) {
            background-color: rgba(40, 40, 60, 0.3);
        }
        
        /* Image styling */
        .enhanced-notes-editor img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 10px auto;
            border: 1px solid var(--theme-primary, #00ccff);
            border-radius: 3px;
        }
        
        /* Dialog */
        .notes-dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .notes-dialog {
            background-color: rgba(30, 30, 45, 0.95);
            border: 1px solid var(--theme-primary, #00ccff);
            border-radius: 4px;
            box-shadow: 0 0 20px rgba(0, 180, 255, 0.3);
            width: 350px;
            max-width: 90%;
        }
        
        .notes-dialog-header {
            background-color: rgba(20, 20, 35, 0.95);
            border-bottom: 1px solid var(--theme-primary, #00ccff);
            padding: 10px 15px;
            font-size: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .notes-dialog-close {
            background: none;
            border: none;
            color: var(--theme-text-primary, #e0e0e0);
            font-size: 18px;
            cursor: pointer;
        }
        
        .notes-dialog-content {
            padding: 15px;
        }
        
        .notes-dialog-footer {
            border-top: 1px solid rgba(200, 200, 255, 0.2);
            padding: 10px 15px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }
        
        .notes-dialog input, .notes-dialog select, .notes-dialog textarea {
            background-color: rgba(40, 40, 60, 0.9);
            color: var(--theme-text-primary, #e0e0e0);
            border: 1px solid var(--theme-primary, #00ccff);
            border-radius: 3px;
            padding: 5px 8px;
            width: 100%;
            margin-bottom: 10px;
        }
        
        .notes-dialog label {
            display: block;
            margin-bottom: 5px;
            color: var(--theme-primary, #00ccff);
        }
        
        .notes-dialog-button {
            background-color: rgba(40, 40, 60, 0.9);
            color: var(--theme-text-primary, #e0e0e0);
            border: 1px solid var(--theme-primary, #00ccff);
            border-radius: 3px;
            padding: 5px 12px;
            cursor: pointer;
        }
        
        .notes-dialog-button:hover {
            background-color: rgba(60, 60, 90, 0.9);
        }
        
        .notes-dialog-button.primary {
            background-color: rgba(0, 120, 170, 0.6);
        }
    `;
    
    document.head.appendChild(style);
}

/**
 * Create the HTML structure for the notes editor
 * @param {string} panelId - Unique panel identifier
 * @returns {string} HTML for editor
 */
function createEditorHtml(panelId) {
    return `
        <div class="enhanced-notes-container">
            <!-- Document selector and management -->
            <div class="notes-document-bar">
                <select id="notes-selector-${panelId}" class="notes-selector" aria-label="Select note document">
                    <option value="default-note">Default Note</option>
                </select>
                <button id="new-note-${panelId}" class="notes-document-button" title="Create new note" aria-label="Create new note">New</button>
                <button id="rename-note-${panelId}" class="notes-document-button" title="Rename current note" aria-label="Rename note">Rename</button>
                <button id="delete-note-${panelId}" class="notes-document-button" title="Delete current note" aria-label="Delete note">Delete</button>
            </div>
            
            <!-- Main formatting toolbar -->
            <div class="enhanced-notes-toolbar" role="toolbar" aria-label="Text formatting">
                <!-- Save button - positioned first for importance -->
                <div class="toolbar-group" style="background-color: rgba(0, 120, 170, 0.2); padding: 3px; border-radius: 3px;">
                    <button id="save-note-${panelId}" class="editor-button primary" title="Save Note (Ctrl+S)" aria-label="Save Note" style="background-color: rgba(0, 150, 200, 0.4);">💾 Save</button>
                </div>
                
                <!-- Text style group -->
                <div class="toolbar-group">
                    <button id="format-bold-${panelId}" class="editor-button" data-command="bold" title="Bold (Ctrl+B)" aria-label="Bold"><strong>B</strong></button>
                    <button id="format-italic-${panelId}" class="editor-button" data-command="italic" title="Italic (Ctrl+I)" aria-label="Italic"><em>I</em></button>
                    <button id="format-underline-${panelId}" class="editor-button" data-command="underline" title="Underline (Ctrl+U)" aria-label="Underline"><u>U</u></button>
                    <button id="format-strike-${panelId}" class="editor-button" data-command="strikethrough" title="Strikethrough" aria-label="Strikethrough"><s>S</s></button>
                </div>
                
                <!-- Format group -->
                <div class="toolbar-group">
                    <div class="format-dropdown">
                        <button id="format-dropdown-${panelId}" class="editor-button" aria-haspopup="true" aria-expanded="false">
                            Format ▾
                        </button>
                        <div class="format-dropdown-content">
                            <button data-command="formatBlock" data-value="p">Paragraph</button>
                            <button data-command="formatBlock" data-value="h1">Heading 1</button>
                            <button data-command="formatBlock" data-value="h2">Heading 2</button>
                            <button data-command="formatBlock" data-value="h3">Heading 3</button>
                            <button data-command="formatBlock" data-value="pre">Code Block</button>
                            <button data-command="formatBlock" data-value="blockquote">Quote</button>
                        </div>
                    </div>
                </div>
                
                <!-- Lists group -->
                <div class="toolbar-group">
                    <button id="format-bullet-${panelId}" class="editor-button" data-command="insertUnorderedList" title="Bullet List" aria-label="Bullet List">•</button>
                    <button id="format-number-${panelId}" class="editor-button" data-command="insertOrderedList" title="Numbered List" aria-label="Numbered List">1.</button>
                    <button id="format-indent-${panelId}" class="editor-button" data-command="indent" title="Indent" aria-label="Indent">→</button>
                    <button id="format-outdent-${panelId}" class="editor-button" data-command="outdent" title="Outdent" aria-label="Outdent">←</button>
                </div>
                
                <!-- Insert group -->
                <div class="toolbar-group">
                    <button id="insert-link-${panelId}" class="editor-button" title="Insert Link (Ctrl+K)" aria-label="Insert Link">🔗</button>
                    <button id="insert-image-${panelId}" class="editor-button" title="Insert Image" aria-label="Insert Image">🖼️</button>
                    <button id="insert-table-${panelId}" class="editor-button" title="Insert Table" aria-label="Insert Table">📊</button>
                    <button id="insert-hr-${panelId}" class="editor-button" data-command="insertHorizontalRule" title="Insert Horizontal Line" aria-label="Insert Horizontal Line">―</button>
                </div>
                
                <!-- Utility group -->
                <div class="toolbar-group">
                    <button id="clear-format-${panelId}" class="editor-button" data-command="removeFormat" title="Clear Formatting" aria-label="Clear Formatting">T×</button>
                    <button id="undo-${panelId}" class="editor-button" data-command="undo" title="Undo (Ctrl+Z)" aria-label="Undo">↩️</button>
                    <button id="redo-${panelId}" class="editor-button" data-command="redo" title="Redo (Ctrl+Y/Ctrl+Shift+Z)" aria-label="Redo">↪️</button>
                </div>
                
                <!-- Actions group -->
                <div class="toolbar-group">
                    <button id="export-${panelId}" class="editor-button" title="Export Note" aria-label="Export Note">↓</button>
                    <button id="import-${panelId}" class="editor-button" title="Import Note" aria-label="Import Note">↑</button>
                    <button id="fullscreen-${panelId}" class="editor-button" title="Toggle Fullscreen (F11)" aria-label="Toggle Fullscreen">⛶</button>
                </div>
            </div>
            
            <!-- Main editor area -->
            <div id="notes-editor-${panelId}" class="enhanced-notes-editor" contenteditable="true" spellcheck="true" role="textbox" aria-multiline="true" aria-label="Notes content"></div>
            
            <!-- Footer with status -->
            <div class="enhanced-notes-footer">
                <div class="word-count" id="word-count-${panelId}">0 words</div>
                <div class="notes-status" id="notes-status-${panelId}" aria-live="polite">Ready</div>
            </div>
            
            <!-- Hidden file input for imports -->
            <input type="file" id="file-import-${panelId}" style="display: none;" accept=".txt,.html,.md,.json">
        </div>
    `;
}

/**
 * Initialize all editor functionality
 * @param {HTMLElement} panel - The panel DOM element
 * @param {string} panelId - Unique panel identifier
 */
function initializeEditor(panel, panelId) {
    // Get references to key elements
    const editor = document.getElementById(`notes-editor-${panelId}`);
    const statusElement = document.getElementById(`notes-status-${panelId}`);
    const wordCountElement = document.getElementById(`word-count-${panelId}`);
    const notesSelector = document.getElementById(`notes-selector-${panelId}`);
    const fileImportInput = document.getElementById(`file-import-${panelId}`);
    
    // Store editor reference in global object
    notesEditorInstances.push({
        panelId: panelId,
        editor: editor,
        statusElement: statusElement,
        wordCountElement: wordCountElement,
        currentNoteId: 'default-note'
    });
    
    // Initialize the format dropdown
    const formatDropdown = panel.querySelector('.format-dropdown');
    const formatDropdownButton = document.getElementById(`format-dropdown-${panelId}`);
    
    formatDropdownButton.addEventListener('click', () => {
        formatDropdown.classList.toggle('open');
        formatDropdownButton.setAttribute('aria-expanded', formatDropdown.classList.contains('open'));
    });
    
    // Close the dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!formatDropdown.contains(e.target)) {
            formatDropdown.classList.remove('open');
            formatDropdownButton.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Handle toolbar button clicks
    panel.querySelectorAll('.editor-button[data-command]').forEach(button => {
        button.addEventListener('click', () => {
            const command = button.getAttribute('data-command');
            const value = button.getAttribute('data-value') || '';
            
            document.execCommand(command, false, value);
            editor.focus();
            updateWordCount(editor, wordCountElement);
        });
    });
    
    // Handle dropdown option clicks
    panel.querySelectorAll('.format-dropdown-content button').forEach(button => {
        button.addEventListener('click', () => {
            const command = button.getAttribute('data-command');
            const value = button.getAttribute('data-value') || '';
            
            document.execCommand(command, false, value);
            formatDropdown.classList.remove('open');
            formatDropdownButton.setAttribute('aria-expanded', 'false');
            editor.focus();
        });
    });
    
    // Special button handlers
    
    // Insert link
    document.getElementById(`insert-link-${panelId}`).addEventListener('click', () => {
        showLinkDialog(editor, panelId);
    });
    
    // Insert image
    document.getElementById(`insert-image-${panelId}`).addEventListener('click', () => {
        showImageDialog(editor, panelId);
    });
    
    // Insert table
    document.getElementById(`insert-table-${panelId}`).addEventListener('click', () => {
        showTableDialog(editor, panelId);
    });
    
    // Export note
    document.getElementById(`export-${panelId}`).addEventListener('click', () => {
        showExportDialog(editor, panelId);
    });
    
    // Import note
    document.getElementById(`import-${panelId}`).addEventListener('click', () => {
        fileImportInput.click();
    });
    
    // Handle file import
    fileImportInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            importFile(file, editor, statusElement, panelId);
        }
    });
    
    // Fullscreen toggle
    document.getElementById(`fullscreen-${panelId}`).addEventListener('click', () => {
        panel.classList.toggle('notes-editor-fullscreen');
        if (panel.classList.contains('notes-editor-fullscreen')) {
            updateStatus(statusElement, 'Fullscreen mode enabled - Press F11 or ESC to exit', 'info');
        } else {
            updateStatus(statusElement, 'Fullscreen mode disabled', 'info');
        }
    });
    
    // Notes management
    document.getElementById(`new-note-${panelId}`).addEventListener('click', () => {
        createNewNote(panelId);
    });
    
    document.getElementById(`rename-note-${panelId}`).addEventListener('click', () => {
        showRenameDialog(panelId);
    });
    
    document.getElementById(`delete-note-${panelId}`).addEventListener('click', () => {
        showDeleteConfirmation(panelId);
    });
    
    // Save button handler
    document.getElementById(`save-note-${panelId}`).addEventListener('click', () => {
        saveCurrentNote(panelId);
        
        // Visual feedback on button
        const saveButton = document.getElementById(`save-note-${panelId}`);
        const originalText = saveButton.innerHTML;
        saveButton.innerHTML = '✓ Saved!';
        saveButton.style.backgroundColor = 'rgba(0, 200, 100, 0.5)';
        
        // Reset button after a short delay
        setTimeout(() => {
            saveButton.innerHTML = originalText;
            saveButton.style.backgroundColor = 'rgba(0, 150, 200, 0.4)';
        }, 1500);
    });
    
    // Handle note selection changes
    notesSelector.addEventListener('change', () => {
        saveCurrentNote(panelId); // Save current note before switching
        
        // Update the current note ID both globally and for this specific editor instance
        currentNoteId = notesSelector.value;
        
        // Find the editor instance and update its current note ID
        const editorInstance = getEditorInstance(panelId);
        if (editorInstance) {
            editorInstance.currentNoteId = currentNoteId;
            console.log(`Switching to note ID: ${currentNoteId} for panel: ${panelId}`);
        }
        
        // Load the selected note
        loadCurrentNote(panelId);
    });
    
    // Content change events for auto-save and word count
    let autoSaveTimeout;
    editor.addEventListener('input', () => {
        updateWordCount(editor, wordCountElement);
        
        // Auto-save with debounce
        clearTimeout(autoSaveTimeout);
        updateStatus(statusElement, 'Typing...', 'info');
        
        autoSaveTimeout = setTimeout(() => {
            saveCurrentNote(panelId);
        }, 1500);
    });
    
    // Keyboard shortcuts
    editor.addEventListener('keydown', (e) => {
        // Ctrl+S for save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveCurrentNote(panelId);
        }
        
        // Ctrl+B for bold
        if (e.ctrlKey && e.key === 'b') {
            e.preventDefault();
            document.execCommand('bold', false, null);
        }
        
        // Ctrl+I for italic
        if (e.ctrlKey && e.key === 'i') {
            e.preventDefault();
            document.execCommand('italic', false, null);
        }
        
        // Ctrl+U for underline
        if (e.ctrlKey && e.key === 'u') {
            e.preventDefault();
            document.execCommand('underline', false, null);
        }
        
        // Ctrl+K for link
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            showLinkDialog(editor, panelId);
        }
        
        // F11 for fullscreen
        if (e.key === 'F11') {
            e.preventDefault();
            panel.classList.toggle('notes-editor-fullscreen');
        }
        
        // ESC to exit fullscreen
        if (e.key === 'Escape' && panel.classList.contains('notes-editor-fullscreen')) {
            panel.classList.remove('notes-editor-fullscreen');
        }
    });
    
    // Initialize word count
    updateWordCount(editor, wordCountElement);
}

/**
 * Update the status message with auto-clear
 * @param {HTMLElement} statusElement - Status display element
 * @param {string} message - Status message to display
 * @param {string} type - Message type (info, success, error)
 * @param {number} [timeout=3000] - Auto-clear timeout in ms
 */
function updateStatus(statusElement, message, type = 'info', timeout = 3000) {
    statusElement.textContent = message;
    
    // Set color based on message type
    switch (type) {
        case 'error':
            statusElement.style.color = '#ff5555';
            break;
        case 'success':
            statusElement.style.color = '#55ff55';
            break;
        default:
            statusElement.style.color = 'rgba(200, 200, 255, 0.7)';
    }
    
    // Auto-clear status after timeout
    if (timeout > 0) {
        setTimeout(() => {
            statusElement.textContent = 'Ready';
            statusElement.style.color = 'rgba(200, 200, 255, 0.7)';
        }, timeout);
    }
}

/**
 * Update the word count display
 * @param {HTMLElement} editor - Editor element
 * @param {HTMLElement} countElement - Word count display element
 */
function updateWordCount(editor, countElement) {
    const text = editor.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    
    countElement.textContent = `${words} words, ${chars} chars`;
}

/**
 * Save the current note to localStorage
 * @param {string} panelId - Unique panel identifier
 */
function saveCurrentNote(panelId) {
    const editorInstance = getEditorInstance(panelId);
    if (!editorInstance) {
        console.error(`Could not find editor instance for panel ${panelId}`);
        return;
    }
    
    const { editor, statusElement } = editorInstance;
    const selector = document.getElementById(`notes-selector-${panelId}`);
    if (!selector) {
        console.error(`Could not find notes selector for panel ${panelId}`);
        return;
    }
    
    // Get the note ID from the selector (or use the current note ID from the editor instance)
    const noteId = selector.value || editorInstance.currentNoteId || 'default-note';
    
    if (!noteId) {
        console.error('No note ID found for saving');
        updateStatus(statusElement, 'Error: No note ID found', 'error');
        return;
    }
    
    console.log(`Saving note: ${noteId} for panel: ${panelId}`);
    
    try {
        // Get the current content from the editor
        const content = editor.innerHTML;
        
        // Get all saved notes data
        let notesData = JSON.parse(localStorage.getItem('cyberpunk-notes-data') || '{}');
        
        // Get the note title from the selector or use existing title if available
        const selectedIndex = selector.selectedIndex;
        let noteTitle;
        
        if (selectedIndex >= 0) {
            noteTitle = selector.options[selectedIndex].text;
        } else if (notesData[noteId] && notesData[noteId].title) {
            noteTitle = notesData[noteId].title;
        } else {
            noteTitle = noteId === 'default-note' ? 'Default Note' : `Note ${Date.now()}`;
        }
        
        console.log(`Saving note "${noteTitle}" with content length: ${content.length}`);
        
        // Update the content for this note
        notesData[noteId] = {
            title: noteTitle,
            content: content,
            lastModified: new Date().toISOString()
        };
        
        // Save back to localStorage
        localStorage.setItem('cyberpunk-notes-data', JSON.stringify(notesData));
        
        // Verify save was successful by reading it back
        try {
            const savedData = JSON.parse(localStorage.getItem('cyberpunk-notes-data') || '{}');
            if (savedData[noteId] && savedData[noteId].content === content) {
                console.log(`Verified saved content for "${noteTitle}" (length: ${savedData[noteId].content.length})`);
                updateStatus(statusElement, 'Note saved', 'success');
            } else {
                console.warn('Save verification failed - content mismatch or missing');
                updateStatus(statusElement, 'Save verification failed', 'error');
            }
        } catch (verifyError) {
            console.error('Error verifying saved data:', verifyError);
            updateStatus(statusElement, 'Note saved (verify failed)', 'warning');
        }
    } catch (error) {
        console.error('Error saving note:', error);
        updateStatus(statusElement, 'Error saving note: ' + error.message, 'error');
    }
}

/**
 * Load the list of saved notes into the selector
 * @param {string} panelId - Unique panel identifier
 */
function loadNotesList(panelId) {
    const selector = document.getElementById(`notes-selector-${panelId}`);
    if (!selector) return;
    
    try {
        // Get all saved notes
        const notesData = JSON.parse(localStorage.getItem('cyberpunk-notes-data') || '{}');
        
        // Clear current options except the first one (which is the default)
        while (selector.options.length > 1) {
            selector.remove(1);
        }
        
        // Add options for each saved note
        for (const noteId in notesData) {
            // Skip if it's already the default option
            if (selector.querySelector(`option[value="${noteId}"]`)) continue;
            
            const option = document.createElement('option');
            option.value = noteId;
            option.textContent = notesData[noteId].title;
            selector.appendChild(option);
        }
        
        // If no notes exist, ensure at least the default exists
        if (!notesData['default-note']) {
            notesData['default-note'] = {
                title: 'Default Note',
                content: '',
                lastModified: new Date().toISOString()
            };
            localStorage.setItem('cyberpunk-notes-data', JSON.stringify(notesData));
        }
        
    } catch (error) {
        console.error('Error loading notes list:', error);
    }
}

/**
 * Load the current note content
 * @param {string} panelId - Unique panel identifier
 */
function loadCurrentNote(panelId) {
    const editorInstance = getEditorInstance(panelId);
    if (!editorInstance) {
        console.error(`Could not find editor instance for panel ${panelId}`);
        return;
    }
    
    const { editor, statusElement } = editorInstance;
    const selector = document.getElementById(`notes-selector-${panelId}`);
    
    if (!selector) {
        console.error(`Could not find notes selector for panel ${panelId}`);
        return;
    }
    
    const noteId = selector.value;
    console.log(`Loading note: ${noteId} for panel: ${panelId}`);
    
    try {
        // Get all saved notes
        const notesData = JSON.parse(localStorage.getItem('cyberpunk-notes-data') || '{}');
        console.log(`All saved notes:`, Object.keys(notesData));
        
        // Get this note's data
        const noteData = notesData[noteId];
        
        if (noteData && noteData.content !== undefined) {
            console.log(`Found saved note "${noteData.title}" with content length: ${noteData.content.length}`);
            
            // Set the editor content
            editor.innerHTML = noteData.content;
            
            // Update word count
            if (editorInstance.wordCountElement) {
                updateWordCount(editor, editorInstance.wordCountElement);
            }
            
            updateStatus(statusElement, `Loaded note: ${noteData.title}`, 'success');
        } else {
            // If note doesn't exist or has no content, create an empty one
            console.log(`Note ${noteId} not found or empty, creating new`);
            editor.innerHTML = '';
            
            // Create a title for the note
            const noteTitle = selector.options[selector.selectedIndex] ? 
                selector.options[selector.selectedIndex].text : 
                (noteId === 'default-note' ? 'Default Note' : noteId);
            
            // Save this empty note
            notesData[noteId] = {
                title: noteTitle,
                content: '',
                lastModified: new Date().toISOString()
            };
            
            localStorage.setItem('cyberpunk-notes-data', JSON.stringify(notesData));
            console.log(`Created new empty note: ${noteId} with title "${noteTitle}"`);
            
            updateStatus(statusElement, 'Created new note', 'info');
        }
        
        // Update currentNoteId for this panel
        editorInstance.currentNoteId = noteId;
        
    } catch (error) {
        console.error('Error loading note:', error);
        updateStatus(statusElement, 'Error loading note: ' + error.message, 'error');
    }
}

/**
 * Create a new note
 * @param {string} panelId - Unique panel identifier
 */
function createNewNote(panelId) {
    showDialog({
        title: 'Create New Note',
        content: `
            <label for="new-note-name-${panelId}">Note Name:</label>
            <input type="text" id="new-note-name-${panelId}" placeholder="My New Note">
        `,
        onConfirm: () => {
            const noteName = document.getElementById(`new-note-name-${panelId}`).value.trim();
            
            if (!noteName) {
                alert('Please enter a name for the note');
                return false;
            }
            
            // Create a note ID from the name
            const noteId = 'note-' + Date.now();
            
            // Save current note first
            saveCurrentNote(panelId);
            
            // Get the selector and add the new option
            const selector = document.getElementById(`notes-selector-${panelId}`);
            const option = document.createElement('option');
            option.value = noteId;
            option.textContent = noteName;
            selector.appendChild(option);
            
            // Select the new note
            selector.value = noteId;
            
            // Create and load the new note
            const editorInstance = getEditorInstance(panelId);
            if (editorInstance) {
                const { editor, statusElement } = editorInstance;
                editorInstance.currentNoteId = noteId;
                
                // Clear editor
                editor.innerHTML = '';
                
                // Save empty note
                try {
                    let notesData = JSON.parse(localStorage.getItem('cyberpunk-notes-data') || '{}');
                    notesData[noteId] = {
                        title: noteName,
                        content: '',
                        lastModified: new Date().toISOString()
                    };
                    localStorage.setItem('cyberpunk-notes-data', JSON.stringify(notesData));
                    
                    updateStatus(statusElement, `Created new note: ${noteName}`, 'success');
                } catch (error) {
                    console.error('Error creating new note:', error);
                    updateStatus(statusElement, 'Error creating note: ' + error.message, 'error');
                }
            }
            
            return true;
        }
    });
}

/**
 * Show dialog to rename the current note
 * @param {string} panelId - Unique panel identifier
 */
function showRenameDialog(panelId) {
    const selector = document.getElementById(`notes-selector-${panelId}`);
    const currentNoteId = selector.value;
    let currentName = selector.options[selector.selectedIndex].text;
    
    showDialog({
        title: 'Rename Note',
        content: `
            <label for="rename-note-${panelId}">New Name:</label>
            <input type="text" id="rename-note-${panelId}" value="${currentName}">
        `,
        onConfirm: () => {
            const newName = document.getElementById(`rename-note-${panelId}`).value.trim();
            
            if (!newName) {
                alert('Please enter a name for the note');
                return false;
            }
            
            try {
                // Update the name in the selector
                selector.options[selector.selectedIndex].text = newName;
                
                // Update the name in storage
                let notesData = JSON.parse(localStorage.getItem('cyberpunk-notes-data') || '{}');
                if (notesData[currentNoteId]) {
                    notesData[currentNoteId].title = newName;
                    localStorage.setItem('cyberpunk-notes-data', JSON.stringify(notesData));
                    
                    const editorInstance = getEditorInstance(panelId);
                    if (editorInstance) {
                        updateStatus(editorInstance.statusElement, `Renamed note to: ${newName}`, 'success');
                    }
                }
            } catch (error) {
                console.error('Error renaming note:', error);
                const editorInstance = getEditorInstance(panelId);
                if (editorInstance) {
                    updateStatus(editorInstance.statusElement, 'Error renaming note: ' + error.message, 'error');
                }
            }
            
            return true;
        }
    });
}

/**
 * Show confirmation dialog before deleting a note
 * @param {string} panelId - Unique panel identifier
 */
function showDeleteConfirmation(panelId) {
    const selector = document.getElementById(`notes-selector-${panelId}`);
    
    // Don't allow deleting the default note
    if (selector.value === 'default-note') {
        const editorInstance = getEditorInstance(panelId);
        if (editorInstance) {
            updateStatus(editorInstance.statusElement, 'Cannot delete the default note', 'error');
        }
        return;
    }
    
    const noteName = selector.options[selector.selectedIndex].text;
    
    showDialog({
        title: 'Delete Note',
        content: `
            <p>Are you sure you want to delete the note "${noteName}"?</p>
            <p style="color: #ff5555;">This action cannot be undone.</p>
        `,
        onConfirm: () => {
            const noteId = selector.value;
            
            try {
                // Remove from storage
                let notesData = JSON.parse(localStorage.getItem('cyberpunk-notes-data') || '{}');
                delete notesData[noteId];
                localStorage.setItem('cyberpunk-notes-data', JSON.stringify(notesData));
                
                // Remove from selector
                selector.remove(selector.selectedIndex);
                
                // Select default note
                selector.value = 'default-note';
                
                // Load the default note
                loadCurrentNote(panelId);
                
                const editorInstance = getEditorInstance(panelId);
                if (editorInstance) {
                    updateStatus(editorInstance.statusElement, `Deleted note: ${noteName}`, 'success');
                }
            } catch (error) {
                console.error('Error deleting note:', error);
                const editorInstance = getEditorInstance(panelId);
                if (editorInstance) {
                    updateStatus(editorInstance.statusElement, 'Error deleting note: ' + error.message, 'error');
                }
            }
            
            return true;
        }
    });
}

/**
 * Show dialog for inserting a link
 * @param {HTMLElement} editor - Editor element
 * @param {string} panelId - Unique panel identifier
 */
function showLinkDialog(editor, panelId) {
    // Save current selection
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    let selectionText = range.toString();
    
    showDialog({
        title: 'Insert Link',
        content: `
            <label for="link-text-${panelId}">Link Text:</label>
            <input type="text" id="link-text-${panelId}" value="${selectionText}" placeholder="Link text">
            
            <label for="link-url-${panelId}">URL:</label>
            <input type="text" id="link-url-${panelId}" placeholder="https://example.com">
        `,
        onConfirm: () => {
            const linkText = document.getElementById(`link-text-${panelId}`).value.trim();
            const url = document.getElementById(`link-url-${panelId}`).value.trim();
            
            if (!url) {
                alert('Please enter a URL');
                return false;
            }
            
            // Create the link
            if (selectionText) {
                // If there was a selection, replace it with the link
                document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${linkText || url}</a>`);
            } else {
                // If no selection, insert at cursor position
                document.execCommand('insertHTML', false, `<a href="${url}" target="_blank">${linkText || url}</a>`);
            }
            
            return true;
        }
    });
}

/**
 * Show dialog for inserting an image
 * @param {HTMLElement} editor - Editor element
 * @param {string} panelId - Unique panel identifier
 */
function showImageDialog(editor, panelId) {
    showDialog({
        title: 'Insert Image',
        content: `
            <label for="image-url-${panelId}">Image URL:</label>
            <input type="text" id="image-url-${panelId}" placeholder="https://example.com/image.jpg">
            
            <label for="image-alt-${panelId}">Alt Text:</label>
            <input type="text" id="image-alt-${panelId}" placeholder="Description of the image">
            
            <label for="image-width-${panelId}">Width (optional):</label>
            <input type="text" id="image-width-${panelId}" placeholder="e.g., 300px or 80%">
        `,
        onConfirm: () => {
            const url = document.getElementById(`image-url-${panelId}`).value.trim();
            const alt = document.getElementById(`image-alt-${panelId}`).value.trim();
            const width = document.getElementById(`image-width-${panelId}`).value.trim();
            
            if (!url) {
                alert('Please enter an image URL');
                return false;
            }
            
            // Create the image HTML
            let img = `<img src="${url}" alt="${alt || 'Image'}"`;
            if (width) {
                img += ` style="width: ${width};"`;
            }
            img += `>`;
            
            // Insert the image
            document.execCommand('insertHTML', false, img);
            
            return true;
        }
    });
}

/**
 * Show dialog for creating a table
 * @param {HTMLElement} editor - Editor element
 * @param {string} panelId - Unique panel identifier
 */
function showTableDialog(editor, panelId) {
    showDialog({
        title: 'Insert Table',
        content: `
            <label for="table-rows-${panelId}">Rows:</label>
            <input type="number" id="table-rows-${panelId}" value="3" min="1" max="20">
            
            <label for="table-cols-${panelId}">Columns:</label>
            <input type="number" id="table-cols-${panelId}" value="3" min="1" max="10">
            
            <label>
                <input type="checkbox" id="table-header-${panelId}" checked>
                Include header row
            </label>
        `,
        onConfirm: () => {
            const rows = parseInt(document.getElementById(`table-rows-${panelId}`).value) || 3;
            const cols = parseInt(document.getElementById(`table-cols-${panelId}`).value) || 3;
            const includeHeader = document.getElementById(`table-header-${panelId}`).checked;
            
            // Create table HTML
            let tableHtml = '<table>';
            
            // Add header row if requested
            if (includeHeader) {
                tableHtml += '<tr>';
                for (let i = 0; i < cols; i++) {
                    tableHtml += `<th>Header ${i+1}</th>`;
                }
                tableHtml += '</tr>';
            }
            
            // Add data rows
            for (let i = 0; i < rows; i++) {
                tableHtml += '<tr>';
                for (let j = 0; j < cols; j++) {
                    tableHtml += '<td>Data</td>';
                }
                tableHtml += '</tr>';
            }
            
            tableHtml += '</table>';
            
            // Insert the table
            document.execCommand('insertHTML', false, tableHtml);
            
            return true;
        }
    });
}

/**
 * Show dialog for exporting note
 * @param {HTMLElement} editor - Editor element
 * @param {string} panelId - Unique panel identifier
 */
function showExportDialog(editor, panelId) {
    const selector = document.getElementById(`notes-selector-${panelId}`);
    const noteName = selector.options[selector.selectedIndex].text;
    
    showDialog({
        title: 'Export Note',
        content: `
            <label for="export-format-${panelId}">Format:</label>
            <select id="export-format-${panelId}">
                <option value="html">HTML</option>
                <option value="text">Plain Text</option>
                <option value="markdown">Markdown</option>
            </select>
            
            <label for="export-filename-${panelId}">Filename:</label>
            <input type="text" id="export-filename-${panelId}" value="${noteName}">
        `,
        onConfirm: () => {
            const format = document.getElementById(`export-format-${panelId}`).value;
            let filename = document.getElementById(`export-filename-${panelId}`).value.trim();
            
            if (!filename) {
                filename = 'note';
            }
            
            // Get the content in the requested format
            let content = '';
            let extension = '';
            let mimeType = '';
            
            switch (format) {
                case 'html':
                    content = editor.innerHTML;
                    extension = 'html';
                    mimeType = 'text/html';
                    break;
                case 'text':
                    content = editor.innerText;
                    extension = 'txt';
                    mimeType = 'text/plain';
                    break;
                case 'markdown':
                    content = htmlToMarkdown(editor.innerHTML);
                    extension = 'md';
                    mimeType = 'text/markdown';
                    break;
            }
            
            // Create download link
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return true;
        }
    });
}

/**
 * Import file contents into the editor
 * @param {File} file - File to import
 * @param {HTMLElement} editor - Editor element
 * @param {HTMLElement} statusElement - Status element
 * @param {string} panelId - Unique panel identifier
 */
function importFile(file, editor, statusElement, panelId) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            let content = e.target.result;
            
            // Determine how to handle the file based on extension
            const fileName = file.name.toLowerCase();
            
            if (fileName.endsWith('.txt')) {
                // Plain text - wrap in paragraphs
                content = `<p>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
                editor.innerHTML = content;
            } 
            else if (fileName.endsWith('.md')) {
                // Basic markdown to HTML conversion
                editor.innerHTML = markdownToHtml(content);
            }
            else if (fileName.endsWith('.json')) {
                // Try to parse JSON data
                const data = JSON.parse(content);
                if (data.content) {
                    editor.innerHTML = data.content;
                } else {
                    throw new Error('Invalid JSON format');
                }
            }
            else {
                // Assume HTML
                editor.innerHTML = content;
            }
            
            updateStatus(statusElement, `Imported ${file.name}`, 'success');
            
            // Auto-save the imported content
            saveCurrentNote(panelId);
            
        } catch (error) {
            console.error('Error importing file:', error);
            updateStatus(statusElement, `Error importing file: ${error.message}`, 'error');
        }
    };
    
    reader.onerror = function() {
        updateStatus(statusElement, 'Error reading file', 'error');
    };
    
    reader.readAsText(file);
}

/**
 * Simple HTML to Markdown converter
 * @param {string} html - HTML content
 * @returns {string} Markdown content
 */
function htmlToMarkdown(html) {
    let div = document.createElement('div');
    div.innerHTML = html;
    
    let markdown = '';
    
    // Function to process a node
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }
        
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }
        
        let result = '';
        
        switch (node.nodeName.toLowerCase()) {
            case 'h1':
                result = '# ' + getNodeText(node) + '\n\n';
                break;
            case 'h2':
                result = '## ' + getNodeText(node) + '\n\n';
                break;
            case 'h3':
                result = '### ' + getNodeText(node) + '\n\n';
                break;
            case 'p':
                result = getNodeTextWithFormatting(node) + '\n\n';
                break;
            case 'br':
                result = '\n';
                break;
            case 'strong':
            case 'b':
                result = '**' + getNodeText(node) + '**';
                break;
            case 'em':
            case 'i':
                result = '*' + getNodeText(node) + '*';
                break;
            case 'u':
                result = '_' + getNodeText(node) + '_';
                break;
            case 'a':
                result = '[' + getNodeText(node) + '](' + node.getAttribute('href') + ')';
                break;
            case 'ul':
                result = processListItems(node, '*') + '\n';
                break;
            case 'ol':
                result = processListItems(node, '1.') + '\n';
                break;
            case 'blockquote':
                result = '> ' + getNodeText(node).replace(/\n/g, '\n> ') + '\n\n';
                break;
            case 'code':
                result = '`' + getNodeText(node) + '`';
                break;
            case 'pre':
                result = '```\n' + getNodeText(node) + '\n```\n\n';
                break;
            case 'img':
                result = '![' + (node.getAttribute('alt') || 'Image') + '](' + node.getAttribute('src') + ')\n\n';
                break;
            case 'table':
                result = processTable(node) + '\n\n';
                break;
            case 'hr':
                result = '---\n\n';
                break;
            default:
                // Process children
                for (let child of node.childNodes) {
                    result += processNode(child);
                }
        }
        
        return result;
    }
    
    // Helper to process lists
    function processListItems(node, marker) {
        let result = '';
        let items = node.querySelectorAll('li');
        
        items.forEach((item, index) => {
            let prefix = marker;
            if (marker === '1.') {
                prefix = (index + 1) + '.';
            }
            result += prefix + ' ' + getNodeText(item) + '\n';
        });
        
        return result;
    }
    
    // Helper to process tables
    function processTable(node) {
        let result = '';
        let rows = node.querySelectorAll('tr');
        
        if (rows.length === 0) return '';
        
        // Process header row
        let headerCells = rows[0].querySelectorAll('th');
        if (headerCells.length > 0) {
            let header = '| ';
            let separator = '| ';
            
            headerCells.forEach(cell => {
                header += getNodeText(cell) + ' | ';
                separator += '--- | ';
            });
            
            result += header + '\n' + separator + '\n';
            
            // Start data rows from index 1
            for (let i = 1; i < rows.length; i++) {
                let row = '| ';
                rows[i].querySelectorAll('td').forEach(cell => {
                    row += getNodeText(cell) + ' | ';
                });
                result += row + '\n';
            }
        } else {
            // No header cells, process all rows as data
            rows.forEach(rowNode => {
                let row = '| ';
                rowNode.querySelectorAll('td').forEach(cell => {
                    row += getNodeText(cell) + ' | ';
                });
                result += row + '\n';
            });
        }
        
        return result;
    }
    
    // Helper to get text with basic formatting
    function getNodeTextWithFormatting(node) {
        let result = '';
        
        for (let child of node.childNodes) {
            result += processNode(child);
        }
        
        return result;
    }
    
    // Helper to get plain text
    function getNodeText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent;
        }
        
        let result = '';
        for (let child of node.childNodes) {
            result += getNodeText(child);
        }
        
        return result;
    }
    
    // Process all top-level nodes
    for (let child of div.childNodes) {
        markdown += processNode(child);
    }
    
    return markdown;
}

/**
 * Simple Markdown to HTML converter
 * @param {string} markdown - Markdown content
 * @returns {string} HTML content
 */
function markdownToHtml(markdown) {
    let html = markdown;
    
    // Handle headers
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    
    // Handle bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    
    // Handle italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Handle code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Handle code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
    
    // Handle links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Handle images
    html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
    
    // Handle blockquotes
    html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');
    
    // Handle unordered lists
    let ulMatch = html.match(/^[*+-] (.*)$/gm);
    if (ulMatch) {
        ulMatch.forEach(item => {
            let listItem = item.replace(/^[*+-] (.*)$/, '<li>$1</li>');
            html = html.replace(item, listItem);
        });
        html = html.replace(/<li>.*?<\/li>/g, function(match) {
            return '<ul>' + match + '</ul>';
        });
    }
    
    // Handle ordered lists
    let olMatch = html.match(/^\d+\. (.*)$/gm);
    if (olMatch) {
        olMatch.forEach(item => {
            let listItem = item.replace(/^\d+\. (.*)$/, '<li>$1</li>');
            html = html.replace(item, listItem);
        });
        html = html.replace(/<li>.*?<\/li>/g, function(match) {
            return '<ol>' + match + '</ol>';
        });
    }
    
    // Handle horizontal rules
    html = html.replace(/^---$/gm, '<hr>');
    
    // Handle paragraphs
    html = html.replace(/^(?!<[a-z]).+$/gm, '<p>$&</p>');
    
    return html;
}

/**
 * Create a generic dialog
 * @param {Object} options - Dialog options
 * @param {string} options.title - Dialog title
 * @param {string} options.content - Dialog HTML content
 * @param {Function} options.onConfirm - Callback on confirm
 * @param {Function} [options.onCancel] - Callback on cancel
 */
function showDialog(options) {
    // Remove any existing dialogs
    const existingDialogs = document.querySelectorAll('.notes-dialog-overlay');
    existingDialogs.forEach(dialog => dialog.remove());
    
    // Create dialog elements
    const overlay = document.createElement('div');
    overlay.className = 'notes-dialog-overlay';
    
    const dialog = document.createElement('div');
    dialog.className = 'notes-dialog';
    
    // Add dialog header
    const header = document.createElement('div');
    header.className = 'notes-dialog-header';
    header.innerHTML = `
        <span>${options.title}</span>
        <button class="notes-dialog-close" aria-label="Close dialog">&times;</button>
    `;
    dialog.appendChild(header);
    
    // Add dialog content
    const content = document.createElement('div');
    content.className = 'notes-dialog-content';
    content.innerHTML = options.content;
    dialog.appendChild(content);
    
    // Add dialog footer with buttons
    const footer = document.createElement('div');
    footer.className = 'notes-dialog-footer';
    footer.innerHTML = `
        <button class="notes-dialog-button" data-action="cancel">Cancel</button>
        <button class="notes-dialog-button primary" data-action="confirm">OK</button>
    `;
    dialog.appendChild(footer);
    
    // Add dialog to the page
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Focus the first input
    setTimeout(() => {
        const firstInput = dialog.querySelector('input, select, textarea');
        if (firstInput) {
            firstInput.focus();
        }
    }, 50);
    
    // Handle close button
    header.querySelector('.notes-dialog-close').addEventListener('click', () => {
        if (options.onCancel) {
            options.onCancel();
        }
        overlay.remove();
    });
    
    // Handle cancel button
    footer.querySelector('[data-action="cancel"]').addEventListener('click', () => {
        if (options.onCancel) {
            options.onCancel();
        }
        overlay.remove();
    });
    
    // Handle confirm button
    footer.querySelector('[data-action="confirm"]').addEventListener('click', () => {
        const result = options.onConfirm();
        if (result !== false) {
            overlay.remove();
        }
    });
    
    // Handle ESC key
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            if (options.onCancel) {
                options.onCancel();
            }
            overlay.remove();
            document.removeEventListener('keydown', escHandler);
        }
    });
    
    // Handle Enter key in inputs
    dialog.querySelectorAll('input').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const result = options.onConfirm();
                if (result !== false) {
                    overlay.remove();
                }
            }
        });
    });
}

/**
 * Get the editor instance for a panel
 * @param {string} panelId - Unique panel identifier
 * @returns {Object|null} Editor instance or null if not found
 */
function getEditorInstance(panelId) {
    return notesEditorInstances.find(instance => instance.panelId === panelId) || null;
}

/**
 * Create a fallback notes panel if the enhanced one fails
 * @param {Error} error - Error that occurred
 * @returns {HTMLElement} Fallback panel
 */
function createFallbackNotesPanel(error) {
    console.error('Creating fallback notes panel due to error:', error);
    
    try {
        // Try to use the standard panel creation first
        const createPanelFunc = (typeof createPanel === 'function') ? createPanel : window.createPanel;
        const panel = createPanelFunc('Notes (Basic)');
        
        if (panel) {
            const content = panel.querySelector('.panel-content');
            if (content) {
                content.innerHTML = `
                    <div style="padding: 10px; color: #ff5555;">
                        <strong>Error creating enhanced notes editor</strong>
                        <p>Using basic notes functionality instead.</p>
                        <p>Error details: ${error.message}</p>
                        <textarea style="width: 100%; height: 200px; background: rgba(20, 20, 35, 0.8); 
                                       color: white; border: 1px solid #00ccff; padding: 8px;"></textarea>
                    </div>
                `;
            }
            return panel;
        }
    } catch (fallbackError) {
        console.error('Failed to create fallback Notes Panel:', fallbackError);
    }
    
    // Ultimate fallback: create a div directly
    const div = document.createElement('div');
    div.className = 'panel';
    div.style.position = 'absolute';
    div.style.left = '100px';
    div.style.top = '100px';
    div.style.width = '300px'; 
    div.style.background = 'rgba(30, 30, 45, 0.9)';
    div.style.border = '1px solid #ff5555';
    div.style.padding = '10px';
    div.style.zIndex = '1000';
    div.innerHTML = 'Failed to create Notes Panel';
    
    document.body.appendChild(div);
    return div;
}

// Expose the notes panel function to the window object
window.createEnhancedNotesPanel = createEnhancedNotesPanel;