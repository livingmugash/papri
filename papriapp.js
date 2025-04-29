/**
 * PapriApp Frontend Logic V4 - Mobile Responsive
 * Adds mobile sidebar toggle and adjusts for responsive layout.
 * Keeps feature simulations from V3.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const viewContainer = document.getElementById('view-container');
    const dynamicTooltip = document.getElementById('dynamic-tooltip');
    const searchResultsContainer = document.getElementById('search-results-container');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const hamburgerMenuButton = document.getElementById('hamburger-menu');

    let activePlyrInstance = null;
    let tooltipTimeout = null;

    // --- Initial Setup ---
    initLucideIcons();
    setupNavigationAndTooltips(); // Includes mobile toggle setup
    setupSearch();
    setupReferralCopy();
    setupSettingsActions();
    setupLogout();
    updateUserInfoPlaceholders();

    // --- Initialization Functions ---

    function initLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn('Lucide icons library not found.');
        }
    }

    function setupNavigationAndTooltips() {
        // Set initial view
        const initialHash = window.location.hash || '#search';
        const initialTargetId = initialHash.substring(1) + '-view';
        switchView(initialTargetId, true); // Pass true to prevent closing sidebar on initial load

        // Desktop Navigation clicks
        document.querySelectorAll('#sidebar .nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = item.getAttribute('data-target');
                if (targetId) {
                    switchView(targetId); // Close sidebar on nav click (mobile)
                    window.location.hash = item.getAttribute('href');
                }
            });
        });

        // Handle back/forward
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash || '#search';
            const targetId = hash.substring(1) + '-view';
            switchView(targetId, true); // Don't auto-close sidebar on history navigation
        });

        // Mobile Sidebar Toggle
        if (hamburgerMenuButton && sidebar && sidebarBackdrop) {
            hamburgerMenuButton.addEventListener('click', () => {
                toggleSidebar(true);
            });
            sidebarBackdrop.addEventListener('click', () => {
                toggleSidebar(false);
            });
        }

        // Global Tooltip Logic (using aria-label)
        document.body.addEventListener('mouseover', handleTooltipShow);
        document.body.addEventListener('mouseout', handleTooltipHide);
        document.body.addEventListener('focusin', handleTooltipShow);
        document.body.addEventListener('focusout', handleTooltipHide);
    }

    function toggleSidebar(show) {
         if (sidebar && sidebarBackdrop) {
            if (show) {
                 sidebar.classList.add('active'); // Slide in
                 sidebarBackdrop.classList.add('active'); // Show backdrop
                 sidebarBackdrop.classList.remove('hidden');
             } else {
                 sidebar.classList.remove('active'); // Slide out
                 sidebarBackdrop.classList.remove('active');
                 // Use timeout to hide backdrop after transition completes
                 setTimeout(() => {
                    if (!sidebarBackdrop.classList.contains('active')) {
                        sidebarBackdrop.classList.add('hidden');
                    }
                 }, 300); // Match CSS transition duration
             }
         }
    }


    // --- Tooltip Functions (Positioning adjusted slightly) ---
     function handleTooltipShow(e) {
        const target = e.target.closest('[aria-label]');
        if (!target || target.disabled) return; // Don't show for disabled elements

        const label = target.getAttribute('aria-label');
        if (!label || !dynamicTooltip) return;

        clearTimeout(tooltipTimeout);

        dynamicTooltip.textContent = label;
        dynamicTooltip.classList.remove('hidden');
        // Recalculate position *after* content is set and it's not hidden
        requestAnimationFrame(() => { // Ensure styles are applied
             positionTooltip(target);
             dynamicTooltip.classList.add('visible');
        });
     }

    function handleTooltipHide(e) {
        if (!dynamicTooltip) return;
        dynamicTooltip.classList.remove('visible'); // Start fade out

        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
            if (!dynamicTooltip.classList.contains('visible')) {
                dynamicTooltip.classList.add('hidden');
            }
        }, 5000); // 5-second visibility
    }

     function positionTooltip(targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const tooltip = dynamicTooltip; // Direct reference

        // Reset position before measuring
        tooltip.style.left = '0px';
        tooltip.style.top = '0px';

        const tooltipRect = tooltip.getBoundingClientRect();

        let top = rect.top - tooltipRect.height - 8; // Prefer above
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);

        // Adjust horizontal position
        left = Math.max(5, Math.min(left, window.innerWidth - tooltipRect.width - 5));

        // Adjust vertical position (if needed, prefer below if not enough space above)
        if (top < 0 || (top < 50 && rect.bottom + tooltipRect.height + 8 < window.innerHeight)) {
             top = rect.bottom + 8;
        }
        top = Math.max(5, Math.min(top, window.innerHeight - tooltipRect.height - 5));


        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top + window.scrollY}px`;
    }

    // --- Setup functions for Search, Referrals, Settings, Logout (remain the same logic as V3) ---
     function setupSearch() { /* ... Same as V3 ... */
        const startSearchButton = document.getElementById('start-search-button');
        const searchQueryInput = document.getElementById('search-query-input');
        if (startSearchButton && searchQueryInput) {
            startSearchButton.addEventListener('click', handleSearch);
            searchQueryInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSearch();
                }
            });
        }
        if (searchResultsContainer) {
            searchResultsContainer.addEventListener('click', handleResultAction);
            searchResultsContainer.addEventListener('keypress', handleResultKeyPress);
        }
     }
     function setupReferralCopy() { /* ... Same as V3 ... */
         const copyButton = document.getElementById('copy-referral-code');
         const codeInput = document.getElementById('referral-code');
         if (copyButton && codeInput) {
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(codeInput.value).then(() => {
                    alert('Referral code copied!');
                }).catch(err => console.error('Failed to copy referral code: ', err));
            });
        }
     }
     function setupSettingsActions() { /* ... Same as V3 ... */
         const cancelButton = document.getElementById('cancel-subscription-button');
         if (cancelButton) {
             cancelButton.addEventListener('click', () => {
                 if (confirm('Are you sure you want to cancel your subscription? Your access will continue until the end of the current billing period.')) {
                     alert('Subscription cancellation requested. (Backend integration needed)');
                 }
             });
         }
     }
     function setupLogout() { /* ... Same as V3 ... */
        const logoutButton = document.getElementById('logout-button');
         if (logoutButton) {
             logoutButton.addEventListener('click', () => {
                 if (confirm('Are you sure you want to log out?')) {
                     alert('Logging out... (Requires backend session/token handling)');
                 }
             });
         }
     }
     function updateUserInfoPlaceholders() { /* ... Same as V3 ... */
         const userName = "Demo User";
         const userInitial = userName.charAt(0).toUpperCase();
         document.querySelectorAll('.user-name').forEach(el => el.textContent = userName);
         document.querySelectorAll('.user-initial').forEach(el => el.textContent = userInitial);
         const emailElement = document.getElementById('profile-email');
          if (emailElement) emailElement.textContent = "demo@example.com";
          // Update subscription end date placeholder
         const subEndDate = document.getElementById('subscription-end-date');
         const nextBillingDate = document.getElementById('subscription-next-billing');
         if(subEndDate && nextBillingDate) subEndDate.textContent = nextBillingDate.textContent;

     }

    // --- Core Logic Functions (View Switching, Search, Results Display, Actions) ---

    function switchView(targetId, isInitialOrHistory = false) {
        if (activePlyrInstance) {
            activePlyrInstance.destroy(); activePlyrInstance = null;
        }
        viewContainer.querySelectorAll('.app-view').forEach(view => view.classList.add('hidden'));
        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.classList.remove('hidden');
        } else {
            document.getElementById('search-view')?.classList.remove('hidden');
            if (window.location.hash !== '#search') window.location.hash = '#search';
        }
        // Update nav item active state (only within sidebar for clarity)
        document.querySelectorAll('#sidebar .nav-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-target') === targetId);
        });

        // Close mobile sidebar on navigation unless it's initial load or history navigation
        if (!isInitialOrHistory && window.innerWidth < 768) { // 768px is tailwind 'md' breakpoint
             toggleSidebar(false);
        }
    }


    // --- Search Handling and Result Generation/Display (remain mostly the same logic as V3) ---
    function handleSearch() { /* ... Same as V3 ... */
        const urlInput = document.getElementById('search-source-url');
        const queryInput = document.getElementById('search-query-input');
        const statusDiv = document.getElementById('search-status');

        const url = urlInput.value.trim();
        const query = queryInput.value.trim();

        if (!query) {
            showStatusMessage('Please describe what you are looking for.', 'error', statusDiv);
            queryInput.focus();
            return;
        }

        showStatusMessage('<span><span class="spinner mr-2"></span>Performing AI search... (Simulated)</span>', 'loading', statusDiv);
        searchResultsContainer.innerHTML = '';
        if (activePlyrInstance) { activePlyrInstance.destroy(); activePlyrInstance = null; }

        setTimeout(() => {
            try {
                const simulatedResults = generateSimulatedResults(query, url);
                statusDiv.classList.add('hidden');
                if (simulatedResults.length === 0) {
                    showStatusMessage('No relevant segments found.', 'info', statusDiv);
                } else {
                    displayResults(simulatedResults);
                }
            } catch (error) {
                 console.error("Search simulation error:", error);
                 showStatusMessage('Search failed. Please try again.', 'error', statusDiv);
            }
        }, 1500 + Math.random() * 500);
    }

    function generateSimulatedResults(query, url) { /* ... Same as V3 ... */
        const results = [];
        const videoUrl = url || 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4';
        const duration = 180;
        const numResults = Math.floor(Math.random() * 4) + 1;

        for (let i = 0; i < numResults; i++) {
            const start = Math.floor(Math.random() * (duration - 30));
            const end = start + 15 + Math.floor(Math.random() * 20);
            const summary = `AI Summary ${i + 1}: Relevant to "${query}" focusing on [simulated point A] and [simulated point B].`;
            const topics = ['Simulated', `Topic ${i+1}`, query.split(' ')[0] || 'General', url ? 'URL Specific' : 'Index'];
            const snippet = `...relevant part about ${query.split(' ')[0] || 'this topic'} around ${formatTime(start + 5)}...`;

            results.push({
                id: `result-${Date.now()}-${i}`, startTime: start, endTime: end, timestamp: `${formatTime(start)} - ${formatTime(end)}`,
                snippet: snippet, summary: summary, topics: topics,
                source: url ? 'Provided URL' : 'Indexed Content', sourceUrl: url || '#',
                thumbnailUrl: `https://picsum.photos/seed/${Date.now()+i}/320/180`, // Slightly larger random image
                videoUrl: videoUrl
            });
        }
        return results;
    }

    function displayResults(results) { /* ... Same as V3 ... */
        searchResultsContainer.innerHTML = '';
        results.forEach(result => {
            const card = createResultCardElement(result);
            searchResultsContainer.appendChild(card);
        });
        initLucideIcons();
    }

    // --- Result Card Creation (Uses responsive classes) ---
    function createResultCardElement(result) {
        const card = document.createElement('div');
        card.id = result.id;
        // Base classes + responsive layout changes
        card.className = 'result-card bg-white p-3 sm:p-4 rounded-lg shadow border border-gray-200 flex flex-col md:flex-row gap-3 sm:gap-4 overflow-hidden';
        card.dataset.startTime = result.startTime;
        card.dataset.endTime = result.endTime;
        card.dataset.videoUrl = result.videoUrl;

        const topicsHtml = result.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join(' ');

        // Removed explicit class names like details-container, using Tailwind's responsive prefixes directly
        card.innerHTML = `
            <div class="w-full md:w-48 lg:w-56 flex-shrink-0">
                <div class="aspect-video bg-gray-300 rounded overflow-hidden relative cursor-pointer group thumbnail-container" aria-label="Preview segment: ${result.timestamp}">
                    <img src="${result.thumbnailUrl}" alt="Video thumbnail preview" class="w-full h-full object-cover" loading="lazy">
                    <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200">
                        <i data-lucide="play-circle" class="w-10 h-10 text-white opacity-0 group-hover:opacity-75 transition-opacity pointer-events-none"></i>
                    </div>
                </div>
                <p class="text-xs text-center text-gray-500 mt-1 md:mt-1.5">Source: ${result.source}</p>
            </div>

            <div class="flex-grow min-w-0">
                <p class="text-sm text-indigo-600 font-medium mb-1 sm:mb-2 timestamp">
                    <i data-lucide="clock" class="inline-block w-3.5 h-3.5 mr-1 opacity-80"></i>Match: <span class="font-bold">${result.timestamp}</span>
                </p>

                <div class="mb-2 sm:mb-3 border-l-2 border-indigo-100 pl-2">
                    <button class="text-xs font-medium text-indigo-700 hover:underline flex items-center btn-toggle-summary" aria-expanded="false">
                        <i data-lucide="sparkles" class="w-3 h-3 mr-1"></i> AI Summary <i data-lucide="chevron-down" class="w-3 h-3 ml-1 toggle-icon transition-transform duration-200"></i>
                    </button>
                    <p class="text-xs text-gray-600 mt-1 ai-summary-content overflow-hidden" style="max-height: 0px;">${result.summary}</p>
                </div>

                 <div class="mb-2 sm:mb-3">
                    <h4 class="text-xs font-medium text-gray-500 mb-1">Topics:</h4>
                    <div class="flex flex-wrap gap-1 ai-topics-list">
                        ${topicsHtml || '<span class="text-xs italic text-gray-400">N/A</span>'}
                    </div>
                </div>

                 <div class="mb-2 sm:mb-3 text-xs sm:text-sm text-gray-700 snippet">
                      <i data-lucide="quote" class="inline-block w-3 h-3 mr-1 text-gray-400"></i> ${result.snippet}
                      <button class="text-xs text-indigo-600 hover:underline ml-1 btn-view-transcript">(View Transcript)</button>
                 </div>

                <div class="flex flex-wrap gap-1.5 sm:gap-2 items-center mb-2 sm:mb-3">
                     <button class="action-button btn-preview" aria-label="Preview this segment">
                        <i data-lucide="play-circle" class="action-icon"></i> Preview
                    </button>
                    <a href="${result.sourceUrl}#t=${result.startTime}" target="_blank" class="action-button btn-source" aria-label="Open original source">
                        <i data-lucide="external-link" class="action-icon"></i> Source
                    </a>
                    <button class="action-button btn-save-clip" aria-label="Save this segment as a clip">
                        <i data-lucide="bookmark-plus" class="action-icon"></i> Save Clip
                    </button>
                    <button class="action-button btn-explore-similar" aria-label="Find similar segments">
                        <i data-lucide="copy-plus" class="action-icon"></i> Similar
                    </button>
                </div>
                <div class="flex flex-wrap gap-1.5 sm:gap-2 items-center mb-3 sm:mb-4">
                     <button class="action-button btn-trim" aria-label="Trim this segment">
                        <i data-lucide="scissors" class="action-icon"></i> Trim
                    </button>
                     <button class="action-button btn-edit" aria-label="Edit this segment">
                        <i data-lucide="edit" class="action-icon"></i> Edit
                    </button>
                    <button class="action-button btn-download" aria-label="Download segment" disabled>
                         <i data-lucide="download" class="action-icon"></i> Download
                    </button>
                     <div class="relative inline-block">
                         <button class="action-button btn-share" aria-label="Share segment">
                             <i data-lucide="share-2" class="action-icon"></i> Share
                         </button>
                         <div class="share-dropdown hidden"> <a href="#" class="share-item" data-platform="facebook"><i data-lucide="facebook"></i> Facebook</a>
                             <a href="#" class="share-item" data-platform="twitter"><i data-lucide="twitter"></i> X</a>
                             <a href="#" class="share-item" data-platform="linkedin"><i data-lucide="linkedin"></i> LinkedIn</a>
                             <a href="#" class="share-item" data-platform="whatsapp"><i data-lucide="message-circle"></i> WhatsApp</a>
                             <a href="#" class="share-item" data-platform="copy"><i data-lucide="link"></i> Copy Link</a>
                         </div>
                     </div>
                </div>

                <div class="mt-2 pt-2 border-t border-gray-100">
                     <label for="ask-ai-input-${result.id}" class="text-xs font-medium text-gray-600 mb-1 block">Ask AI about this segment:</label>
                    <div class="flex">
                        <input type="text" id="ask-ai-input-${result.id}" placeholder="e.g., What's the key point?" class="ask-ai-input" aria-label="Ask AI a question">
                        <button class="ask-ai-button btn-ask-ai" aria-label="Submit question">Ask</button>
                    </div>
                    <div class="ai-answer text-xs text-gray-500 mt-1 italic"></div>
                </div>

                <div class="edit-controls hidden mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-100 rounded border border-gray-200">
                    <div class="relative player-container mb-2">
                        <video class="video-player" playsinline controls preload="metadata"></video>
                         <div class="absolute top-1 right-1 z-10">
                            <button class="p-1 bg-white bg-opacity-70 rounded-full text-gray-700 hover:bg-opacity-100 btn-close-player" aria-label="Close Player">
                                <i data-lucide="x" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                    <div class="contextual-controls text-center">
                         <div class="trim-controls hidden">
                             <p class="text-xs text-gray-600 mb-2">Current: <span class="current-segment-time">00:00 - 00:00</span></p>
                             <button class="action-button bg-indigo-100 text-indigo-700 hover:bg-indigo-200 btn-save-trim" aria-label="Confirm trimmed segment">
                                 <i data-lucide="check-circle" class="action-icon"></i> Confirm Trim
                             </button>
                         </div>
                         <div class="edit-controls-options hidden">
                             <p class="text-xs text-gray-600 mb-2">Editing (Simulated):</p>
                             <div class="flex flex-wrap justify-center gap-1 sm:gap-2">
                                <button class="action-button-sm btn-edit-effect" data-effect="filter1"><i data-lucide="filter" class="action-icon"></i> Filter</button>
                                <button class="action-button-sm btn-edit-effect" data-effect="speedup"><i data-lucide="gauge-circle" class="action-icon"></i> Speed</button>
                                <button class="action-button-sm btn-edit-effect" data-effect="addtext"><i data-lucide="type" class="action-icon"></i> Text</button>
                             </div>
                             <button class="action-button bg-indigo-100 text-indigo-700 hover:bg-indigo-200 mt-2 sm:mt-3 btn-apply-edits" aria-label="Apply simulated edits">
                                 <i data-lucide="check-circle" class="action-icon"></i> Apply Edits
                             </button>
                         </div>
                         <button class="action-button ml-2 btn-cancel-edit" aria-label="Cancel editing or trimming">
                             <i data-lucide="x-circle" class="action-icon"></i> Cancel
                         </button>
                    </div>
                 </div>
            </div> `;
        return card;
    }


    // --- Event Handlers (handleResultAction, activatePlayer, closePlayer, handleDownload, handleShareSelection, etc.) ---
    // --- Most event handler logic remains the same as V3, only minor adjustments if needed for responsive layout ---
    // --- Key adjustment: Close mobile sidebar on main action clicks if necessary ---

    function handleResultAction(e) {
        const target = e.target;
        const button = target.closest('button, a, .thumbnail-container');
        if (!button) return;

        const card = button.closest('.result-card');
        if (!card) return;

        // Close mobile sidebar if an action is taken within a card
        if (window.innerWidth < 768) {
            toggleSidebar(false);
        }

         // Prevent default for relevant elements
        if (button.tagName === 'BUTTON' || button.classList.contains('thumbnail-container') || button.classList.contains('share-item')) {
             e.preventDefault();
        }


        const videoUrl = card.dataset.videoUrl;
        const startTime = parseFloat(card.dataset.startTime);
        const endTime = parseFloat(card.dataset.endTime);

        // --- Action Routing (Similar to V3) ---
        if (button.classList.contains('btn-preview') || button.classList.contains('thumbnail-container')) {
             activatePlayer(card, videoUrl, startTime, endTime, 'preview');
        } else if (button.classList.contains('btn-source')) {
             console.log(`Navigating to source: ${button.href}`);
             window.open(button.href, '_blank', 'noopener,noreferrer'); // Explicitly open in new tab
        } else if (button.classList.contains('btn-save-clip')) {
             alert(`Clip "${formatTime(startTime)}-${formatTime(endTime)}" saved! (Simulated)`);
        } else if (button.classList.contains('btn-explore-similar')) {
             alert('Exploring similar segments... (Simulated)');
        } else if (button.classList.contains('btn-trim')) {
             activatePlayer(card, videoUrl, startTime, endTime, 'trim');
        } else if (button.classList.contains('btn-edit')) {
             activatePlayer(card, videoUrl, startTime, endTime, 'edit');
        } else if (button.classList.contains('btn-download')) {
             handleDownload(button, card);
        } else if (button.classList.contains('btn-share')) {
            toggleShareDropdown(button);
        } else if (button.classList.contains('btn-toggle-summary')) {
            toggleSummary(button);
        } else if (button.classList.contains('btn-view-transcript')) {
            alert('Displaying full transcript... (Simulated)');
        } else if (button.classList.contains('btn-ask-ai')) {
             handleAskAI(button, card);
        } else if (button.classList.contains('btn-save-trim')) {
             handleSaveTrim(card);
        } else if (button.classList.contains('btn-apply-edits')) {
            handleApplyEdits(card);
        } else if (button.classList.contains('btn-edit-effect')) {
            alert(`Applying effect: ${button.dataset.effect} (Simulated)`);
        } else if (button.classList.contains('btn-cancel-edit') || button.classList.contains('btn-close-player')) {
             closePlayer(card);
        } else if (button.closest('.share-item')) {
             handleShareSelection(button.closest('.share-item'), card);
        }

        // Close share dropdown if clicking outside
        if (!button.closest('.btn-share, .share-dropdown')) {
            document.querySelectorAll('.share-dropdown:not(.hidden)').forEach(d => d.classList.add('hidden'));
        }
    }


    // --- activatePlayer, closePlayer, handleSaveTrim, handleApplyEdits, handleDownload, handleShareSelection, toggleSummary, handleAskAI functions ---
    // --- Logic remains largely the same as V3. Ensure player responsiveness if needed via Plyr options or CSS. ---
    // --- Example: Minor adjustment in activatePlayer for clarity ---
    function activatePlayer(card, videoUrl, startTime, endTime, mode = 'preview') {
         const otherOpenCard = document.querySelector('.result-card .edit-controls:not(.hidden)');
         if (otherOpenCard && otherOpenCard.closest('.result-card') !== card) {
             closePlayer(otherOpenCard.closest('.result-card'));
         }

        const editControlsDiv = card.querySelector('.edit-controls');
        const playerContainer = card.querySelector('.player-container');
        const videoElement = playerContainer.querySelector('video.video-player');
        const trimControlsDiv = card.querySelector('.trim-controls');
        const editControlsOptionsDiv = card.querySelector('.edit-controls-options');
        const segmentTimeSpan = card.querySelector('.current-segment-time');

        if (activePlyrInstance && activePlyrInstance.elements.container.closest('.result-card') === card) {
            activePlyrInstance.destroy(); activePlyrInstance = null;
        }

        videoElement.innerHTML = `<source src="${videoUrl}" type="video/mp4">`;

         try {
             const player = new Plyr(videoElement, {
                 // Consider smaller controls for mobile? Default might be okay.
                 // controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
                 listeners: {
                     ready: event => {
                         event.detail.plyr.currentTime = startTime;
                         event.detail.plyr.play();
                     },
                      timeupdate: event => {
                         if (trimControlsDiv && !trimControlsDiv.classList.contains('hidden') && segmentTimeSpan) {
                            // Update time display during trim mode
                            const currentEndTime = parseFloat(card.dataset.currentTrimEnd || endTime);
                            segmentTimeSpan.textContent = `${formatTime(event.detail.plyr.currentTime)} - ${formatTime(currentEndTime)}`;
                         }
                     },
                 }
             });
             activePlyrInstance = player;
             card.dataset.currentTrimStart = startTime; // Reset trim markers
             card.dataset.currentTrimEnd = endTime;
             if (segmentTimeSpan) segmentTimeSpan.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;

             editControlsDiv.classList.remove('hidden');
             trimControlsDiv.classList.toggle('hidden', mode !== 'trim');
             editControlsOptionsDiv.classList.toggle('hidden', mode !== 'edit');
             // Ensure player is visible on mobile after activation
             requestAnimationFrame(() => {
                  editControlsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
             });

         } catch (error) {
             console.error("Plyr init failed:", error);
             playerContainer.innerHTML = `<p class="text-xs text-red-600 p-2 text-center">Error loading player.</p>`;
             editControlsDiv.classList.remove('hidden');
         }
     }

    function closePlayer(card) { /* ... Same as V3 ... */
         if (!card) return;
         const editControlsDiv = card.querySelector('.edit-controls');
         if (activePlyrInstance && activePlyrInstance.elements.container.closest('.result-card') === card) {
             activePlyrInstance.destroy(); activePlyrInstance = null;
         }
         if (editControlsDiv) {
             editControlsDiv.classList.add('hidden');
             const videoElement = editControlsDiv.querySelector('video.video-player');
             if (videoElement) videoElement.innerHTML = '';
          }
    }
    function handleSaveTrim(card) { /* ... Same as V3 ... */
         if (!card || !activePlyrInstance) return;
         const newStartTime = activePlyrInstance.currentTime;
         const originalEndTime = parseFloat(card.dataset.endTime);
         card.dataset.trimmedStartTime = newStartTime;
         card.dataset.trimmedEndTime = originalEndTime;
         alert(`Trim Confirmed (Simulated): ${formatTime(newStartTime)} - ${formatTime(originalEndTime)}`);
         const downloadButton = card.querySelector('.btn-download');
         if (downloadButton) downloadButton.disabled = false;
         closePlayer(card);
    }
    function handleApplyEdits(card) { /* ... Same as V3 ... */
         if (!card) return;
         alert("Edits Applied! (Simulated)");
         const downloadButton = card.querySelector('.btn-download');
         if (downloadButton) downloadButton.disabled = false;
         closePlayer(card);
    }
    function handleDownload(button, card) { /* ... Same as V3, ensure startTime/endTime use trimmed values if available ... */
        if (!button || button.disabled || !card) return;
        const startTime = card.dataset.trimmedStartTime || card.dataset.startTime;
        const endTime = card.dataset.trimmedEndTime || card.dataset.endTime;
        const videoUrl = card.dataset.videoUrl;
        const consent = confirm("COPYRIGHT & USAGE WARNING: Ensure you have the necessary rights/permissions before downloading. Click OK to proceed.");
        if (consent) {
             console.log(`Download: ${videoUrl} | ${formatTime(startTime)} -> ${formatTime(endTime)}`);
             alert('Download request sent! (Simulated)');
        }
    }
    function handleShareSelection(shareItem, card) { /* ... Same as V3 ... */
        const platform = shareItem.dataset.platform;
        const videoUrl = card.dataset.videoUrl;
        const startTime = card.dataset.trimmedStartTime || card.dataset.startTime;
        const endTime = card.dataset.trimmedEndTime || card.dataset.endTime;
        const shareUrl = `${window.location.origin}#share=${card.id}&start=${startTime}&end=${endTime}`;
        const shareText = `Check out this video segment (${formatTime(startTime)}-${formatTime(endTime)}) from Papri!`;
        let platformUrl = '';
        switch(platform) {
            case 'facebook': platformUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`; break;
            case 'twitter': platformUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`; break;
            case 'linkedin': platformUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`; break;
             case 'whatsapp': platformUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`; break;
            case 'copy': navigator.clipboard.writeText(shareUrl).then(() => alert('Share link copied!')); return;
            default: alert(`Sharing for ${platform} TBD.`); return;
        }
         if (platformUrl) window.open(platformUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
         const dropdown = shareItem.closest('.share-dropdown');
         if (dropdown) dropdown.classList.add('hidden');
     }
    function toggleSummary(button) { /* ... Same as V3 ... */
        const summaryContent = button.nextElementSibling;
        const icon = button.querySelector('.toggle-icon');
        if (summaryContent && summaryContent.classList.contains('ai-summary-content')) {
            const isExpanded = summaryContent.style.maxHeight !== '0px';
            summaryContent.style.maxHeight = isExpanded ? '0px' : `${summaryContent.scrollHeight}px`;
            button.setAttribute('aria-expanded', !isExpanded);
             if (icon) icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    }
    function handleAskAI(button, card) { /* ... Same as V3 ... */
        const input = button.previousElementSibling;
        const answerDiv = card.querySelector('.ai-answer');
        if (!input || !answerDiv) return;
        const question = input.value.trim();
        if (!question) { answerDiv.textContent = 'Please enter a question.'; return; }
        answerDiv.textContent = 'AI is thinking... (Simulated)';
        input.disabled = true; button.disabled = true;
        setTimeout(() => {
             const simulatedAnswer = `Simulated answer for "${question}": The AI notes [concept] is discussed.`;
             answerDiv.textContent = simulatedAnswer;
             input.value = ''; input.disabled = false; button.disabled = false;
        }, 1200);
    }

    // --- Utility Functions (formatTime, showStatusMessage) ---
    function formatTime(totalSeconds) { /* ... Same as V3 ... */
        const seconds = Math.floor(totalSeconds % 60);
        const minutes = Math.floor((totalSeconds / 60) % 60);
        const hours = Math.floor(totalSeconds / 3600);
        const paddedSeconds = String(seconds).padStart(2, '0');
        const paddedMinutes = String(minutes).padStart(2, '0');
        if (hours > 0) { return `${hours}:${paddedMinutes}:${paddedSeconds}`; }
        return `${paddedMinutes}:${paddedSeconds}`;
    }
    function showStatusMessage(message, type = 'info', element) { /* ... Same as V3 ... */
        if (!element) return;
        element.innerHTML = message;
        element.className = 'mb-4 p-3 rounded-md text-sm '; // Reset classes
        switch (type) {
            case 'error': element.classList.add('bg-red-100', 'text-red-700'); break;
            case 'success': element.classList.add('bg-green-100', 'text-green-700'); break;
            case 'loading': element.classList.add('bg-blue-100', 'text-blue-700'); break;
            case 'info': default: element.classList.add('bg-yellow-100', 'text-yellow-700'); break;
        }
        element.classList.remove('hidden');
    }

}); // End DOMContentLoaded
