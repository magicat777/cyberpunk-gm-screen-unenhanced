(function() {
    // Create a script element with the entire hotfix inline
    const script = document.createElement('script');

    script.textContent = `
    /**
     * HOTFIX for Cyberpunk GM Screen UI Issues
     */
    (function() {
      // Wait for DOM to be fully loaded
      if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', initHotfix);
      } else {
          initHotfix();
      }

      function initHotfix() {
          console.log('🚑 Applying HOTFIX to UI...');

          // Wait a moment to ensure all other scripts have loaded
          setTimeout(() => {
              fixPanelDragging();
              fixDropdownMenus();
              fixButtons();
              fixNavigation();

              console.log('✅ HOTFIX applied successfully!');
          }, 1000);
      }

      // Fix panel dragging
      function fixPanelDragging() {
          // Find all panels
          const panels = document.querySelectorAll('.panel, .cp-panel, .draggable-panel');

          // Apply draggable functionality to each panel
          panels.forEach((panel) => {
              makeElementDraggable(panel);
          });
      }

      // Make an element draggable
      function makeElementDraggable(element) {
          if (!element || element._madeMovable === true) return;

          // Get header
          let header = element.querySelector('.panel-header, .cp-panel-header');
          if (!header) return;

          // Variables to track dragging
          let isDragging = false;
          let initialX, initialY, offsetX, offsetY;

          // Mouse down handler
          header.addEventListener('mousedown', function(e) {
              if (e.target.closest('button')) return;

              isDragging = true;
              initialX = e.clientX;
              initialY = e.clientY;
              offsetX = element.offsetLeft;
              offsetY = element.offsetTop;

              element.style.zIndex = '100';
              element.classList.add('dragging');
              e.preventDefault();
          });

          // Mouse move handler
          document.addEventListener('mousemove', function(e) {
              if (!isDragging) return;

              const x = offsetX + e.clientX - initialX;
              const y = offsetY + e.clientY - initialY;

              const navHeight =
                  (document.querySelector('.primary-nav')?.offsetHeight || 0) +
                  (document.querySelector('.breadcrumb-nav')?.offsetHeight || 0);

              element.style.left = \`\${Math.max(0, x)}px\`;
              element.style.top = \`\${Math.max(navHeight, y)}px\`;
          });

          // Mouse up handler
          document.addEventListener('mouseup', function() {
              if (!isDragging) return;

              isDragging = false;
              element.classList.remove('dragging');
              setTimeout(() => { element.style.zIndex = '10'; }, 100);
          });

          // Add resize functionality if not present
          if (!element.querySelector('.resize-handle')) {
              const resizeHandle = document.createElement('div');
              resizeHandle.className = 'resize-handle';
              resizeHandle.style.cssText = \`
                  position: absolute; width: 15px; height: 15px;
                  bottom: 0; right: 0; background-color: #00ccff;
                  cursor: nwse-resize; opacity: 0.5; z-index: 11;
              \`;
              element.appendChild(resizeHandle);

              // Variables for resizing
              let isResizing = false;
              let initialWidth, initialHeight;

              // Mouse down handler for resize
              resizeHandle.addEventListener('mousedown', function(e) {
                  isResizing = true;
                  initialX = e.clientX;
                  initialY = e.clientY;
                  initialWidth = element.offsetWidth;
                  initialHeight = element.offsetHeight;

                  element.style.zIndex = '100';
                  e.preventDefault();
                  e.stopPropagation();
              });

              // Mouse move handler for resize
              document.addEventListener('mousemove', function(e) {
                  if (!isResizing) return;

                  const width = initialWidth + e.clientX - initialX;
                  const height = initialHeight + e.clientY - initialY;

                  if (width >= 200) element.style.width = \`\${width}px\`;
                  if (height >= 100) element.style.height = \`\${height}px\`;
              });

              // Mouse up handler for resize
              document.addEventListener('mouseup', function() {
                  if (!isResizing) return;
                  isResizing = false;
              });
          }

          element._madeMovable = true;
      }

      // Fix dropdown menus
      function fixDropdownMenus() {
          const dropdownButtons = document.querySelectorAll('.cp-dropdown-button');

          dropdownButtons.forEach(button => {
              if (button._fixed) return;

              const dropdownContent = button.nextElementSibling;
              if (!dropdownContent || !dropdownContent.classList.contains('cp-dropdown-content')) return;

              dropdownContent.style.display = 'none';

              button.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();

                  const isVisible = dropdownContent.style.display === 'block';
                  dropdownContent.style.display = isVisible ? 'none' : 'block';

                  document.querySelectorAll('.cp-dropdown-content').forEach(content => {
                      if (content !== dropdownContent && content.style.display === 'block') {
                          content.style.display = 'none';
                      }
                  });
              });

              button._fixed = true;
          });

          document.addEventListener('click', function(e) {
              if (!e.target.closest('.cp-dropdown')) {
                  document.querySelectorAll('.cp-dropdown-content').forEach(content => {
                      content.style.display = 'none';
                  });
              }
          });
      }

      // Fix buttons
      function fixButtons() {
          // Fix save state button
          const saveStateButton = document.getElementById('cp-save-state');
          if (saveStateButton && !saveStateButton._fixed) {
              saveStateButton.addEventListener('click', function() {
                  if (window.layoutManager && typeof window.layoutManager.saveSettings === 'function') {
                      window.layoutManager.saveSettings();

                      const originalText = this.textContent;
                      this.textContent = 'Saved!';
                      setTimeout(() => { this.textContent = originalText; }, 1500);
                  }
              });
              saveStateButton._fixed = true;
          }

          // Fix profile links
          const profileLinks = document.querySelectorAll('.cp-dropdown a[data-profile]');
          profileLinks.forEach(link => {
              if (link._fixed) return;

              link.addEventListener('click', function(e) {
                  e.preventDefault();

                  const profile = this.getAttribute('data-profile');
                  if (window.layoutManager && typeof window.layoutManager.loadProfile === 'function') {
                      window.layoutManager.loadProfile(profile);

                      const profileDisplay = document.getElementById('cp-current-profile');
                      if (profileDisplay) {
                          profileDisplay.textContent = profile.charAt(0).toUpperCase() + profile.slice(1);
                      }
                  }

                  const dropdown = this.closest('.cp-dropdown-content');
                  if (dropdown) dropdown.style.display = 'none';
              });

              link._fixed = true;
          });
      }

      // Fix navigation
      function fixNavigation() {
          // Fix dropdown toggles
          const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
          dropdownToggles.forEach(toggle => {
              if (toggle._fixed) return;

              toggle.addEventListener('click', function(e) {
                  e.preventDefault();
                  e.stopPropagation();

                  const expanded = this.getAttribute('aria-expanded') === 'true';
                  this.setAttribute('aria-expanded', !expanded);
                  this.classList.toggle('active');

                  const dropdownMenu = this.nextElementSibling;
                  if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                      dropdownMenu.classList.toggle('show');
                  }
              });

              toggle._fixed = true;
          });

          // Close navigation dropdowns when clicking elsewhere
          document.addEventListener('click', function(e) {
              if (!e.target.closest('.dropdown')) {
                  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                      menu.classList.remove('show');

                      const toggle = menu.previousElementSibling;
                      if (toggle && toggle.classList.contains('dropdown-toggle')) {
                          toggle.setAttribute('aria-expanded', 'false');
                          toggle.classList.remove('active');
                      }
                  });
              }
          });
      }

      // Add styles for hotfix
      const style = document.createElement('style');
      style.textContent = \`
          .dragging { opacity: 0.8; box-shadow: 0 0 20px rgba(0, 204, 255, 0.6); }
          .resize-handle { position: absolute; width: 15px; height: 15px; right: 0; bottom: 0;
                          cursor: nwse-resize; background-color: #00ccff; opacity: 0.5; z-index: 11; }
          .resize-handle:hover { opacity: 0.8; }
      \`;
      document.head.appendChild(style);

      initHotfix();
    })();
    `;

    // Add the script to the page
    document.head.appendChild(script);

    console.log('Hotfix applied successfully!');
  })();