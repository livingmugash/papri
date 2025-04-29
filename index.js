// papri.js

document.addEventListener('DOMContentLoaded', () => {

    // --- Initialize Lucide Icons ---
    // Ensure this runs after the script is loaded. Done via HTML script tag.
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    } else {
        console.warn('Lucide icons script not loaded yet.');
    }

    // --- Footer Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Mobile Menu ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Optional: Toggle burger icon to close icon
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
                lucide.createIcons(); // Re-render the icon
            }
        });

        // Close mobile menu when a link is clicked
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                 mobileMenu.classList.add('hidden');
                 // Reset icon to menu
                 const icon = mobileMenuButton.querySelector('i');
                 if (icon) {
                     icon.setAttribute('data-lucide', 'menu');
                     lucide.createIcons();
                 }
            });
        });
    }

    // --- Smooth Scrolling for Nav Links (Desktop & Mobile) ---
    const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]'); // Include other anchor links like buttons
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            // Ensure it's an internal link
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault(); // Prevent default jump
                    // Calculate offset if you have a sticky header
                    const headerOffset = document.getElementById('header')?.offsetHeight || 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 10; // Add small padding

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // If it's a mobile link, close the menu (already handled above, but safe to keep)
                    if (link.classList.contains('nav-link-mobile') && mobileMenu) {
                         mobileMenu.classList.add('hidden');
                         const icon = mobileMenuButton?.querySelector('i');
                         if (icon) icon.setAttribute('data-lucide', 'menu');
                         lucide.createIcons();
                    }
                }
            }
        });
    });


    // --- Free Trial Counter Logic ---
    const trialCounterDisplay = document.getElementById('trial-counter');
    const trialLimitMessage = document.getElementById('trial-limit-message');
    const searchInterface = document.getElementById('search-interface');
    const searchForm = document.getElementById('search-form');
    const searchSubmitButton = document.getElementById('search-submit-button');
    const cookieName = 'papri_trial_count';
    const maxTrials = 3;

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const setCookie = (name, value, days = 7) => {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
    };

    let currentTrials = parseInt(getCookie(cookieName));

    if (isNaN(currentTrials) || currentTrials < 0) {
        currentTrials = maxTrials;
        setCookie(cookieName, currentTrials);
    }

    const updateTrialDisplay = (count) => {
        if (trialCounterDisplay) {
            trialCounterDisplay.textContent = `You have ${count} free search${count !== 1 ? 'es' : ''} remaining.`;
        }
    };

    const disableSearch = () => {
        if (searchInterface) {
            searchInterface.querySelectorAll('input, textarea, button').forEach(el => el.disabled = true);
            searchInterface.classList.add('opacity-60', 'cursor-not-allowed');
        }
         if (searchSubmitButton) searchSubmitButton.disabled = true;
        if (trialCounterDisplay) trialCounterDisplay.classList.add('hidden');
        if (trialLimitMessage) trialLimitMessage.classList.remove('hidden');
    };

    // Initial setup
    if (currentTrials <= 0) {
        disableSearch();
    } else {
        updateTrialDisplay(currentTrials);
         if (trialLimitMessage) trialLimitMessage.classList.add('hidden'); // Ensure limit message is hidden initially
    }

    // Search Form Submission
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission

            currentTrials = parseInt(getCookie(cookieName)) || 0; // Re-check cookie

            if (currentTrials <= 0) {
                console.log("No trials remaining.");
                disableSearch(); // Ensure it's disabled
                return; // Stop processing
            }

            // Decrement trial count
            currentTrials--;
            setCookie(cookieName, currentTrials);
            updateTrialDisplay(currentTrials);

            // --- Simulate Search Process ---
            const resultsArea = document.getElementById('search-results-area');
            const resultsContainer = document.getElementById('search-results-container');
            const loadingIndicator = document.getElementById('search-in-progress');
            const errorIndicator = document.getElementById('search-error');
            const noResultsIndicator = document.getElementById('no-results');

            if(resultsArea) resultsArea.classList.remove('hidden');
            if(resultsContainer) resultsContainer.innerHTML = ''; // Clear previous results
            if(loadingIndicator) loadingIndicator.classList.remove('hidden');
            if(errorIndicator) errorIndicator.classList.add('hidden');
            if(noResultsIndicator) noResultsIndicator.classList.add('hidden');
            if(searchSubmitButton) searchSubmitButton.disabled = true; // Disable while searching

            // TODO: Replace setTimeout with actual fetch call to your backend API
            setTimeout(() => {
                if(loadingIndicator) loadingIndicator.classList.add('hidden');
                if(searchSubmitButton) searchSubmitButton.disabled = false; // Re-enable button

                // --- Mock Results ---
                const mockResults = [
                    { time: "00:45 - 00:52", text: "Showing the part where the 'analyze video content' feature is mentioned." },
                    { time: "01:15 - 01:18", text: "A quick glimpse of the user dashboard after login." },
                ];
                // const mockResults = []; // Uncomment to test "no results"
                // const mockError = true; // Uncomment to test error

                if (typeof mockError !== 'undefined' && mockError) {
                     if(errorIndicator) errorIndicator.classList.remove('hidden');
                } else if (mockResults.length > 0) {
                    mockResults.forEach(result => {
                        const resultElement = document.createElement('div');
                        resultElement.className = 'bg-white p-4 rounded-md shadow border border-gray-200 animate-fade-in'; // Add simple fade-in animation class if defined in CSS
                        resultElement.innerHTML = `
                            <p class="text-sm text-gray-600">Found match at: <span class="font-medium text-indigo-700">${result.time}</span></p>
                            <p class="mt-1 text-base text-gray-800">"${result.text}"</p>
                            <div class="mt-3 flex flex-wrap gap-2">
                                <a href="#" target="_blank" class="text-xs inline-flex items-center px-2.5 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                                    <i data-lucide="external-link" class="w-3 h-3 mr-1"></i> Go to Moment
                                </a>
                                <button class="text-xs inline-flex items-center px-2.5 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors btn-trim-segment">
                                    <i data-lucide="scissors" class="w-3 h-3 mr-1"></i> Trim
                                </button>
                                <button class="text-xs inline-flex items-center px-2.5 py-1 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors btn-download-segment">
                                    <i data-lucide="download" class="w-3 h-3 mr-1"></i> Download
                                </button>
                            </div>
                        `;
                         if(resultsContainer) resultsContainer.appendChild(resultElement);
                    });
                    lucide.createIcons(); // Re-render icons in new elements
                } else {
                     if(noResultsIndicator) noResultsIndicator.classList.remove('hidden');
                }

                // Check if trials ran out after this search
                if (currentTrials <= 0) {
                    disableSearch();
                }

            }, 2000); // Simulate network delay (2 seconds)

        });
    }

    // --- Display Uploaded File Name ---
    const fileUploadInput = document.getElementById('video-upload');
    const fileNameDisplay = document.getElementById('file-name-display');
    const videoUrlInput = document.getElementById('video-url'); // Get URL input

    if (fileUploadInput && fileNameDisplay) {
        fileUploadInput.addEventListener('change', () => {
            if (fileUploadInput.files.length > 0) {
                fileNameDisplay.textContent = `Selected: ${fileUploadInput.files[0].name}`;
                if (videoUrlInput) videoUrlInput.value = ''; // Clear URL input if file is selected
            } else {
                fileNameDisplay.textContent = '';
            }
        });
    }
     // Optional: Clear file input display if URL is typed
     if (videoUrlInput && fileUploadInput && fileNameDisplay) {
        videoUrlInput.addEventListener('input', () => {
            if(videoUrlInput.value.trim() !== '') {
                fileUploadInput.value = ''; // Clear the file input
                fileNameDisplay.textContent = ''; // Clear the display text
            }
        });
     }


    // --- FAQ Accordion Icon Toggle ---
    const faqItems = document.querySelectorAll('.faq-item'); // Using <details> element
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        if (summary) {
            summary.addEventListener('click', (e) => {
                // The browser handles the open/close state automatically for <details>
                // We just need to ensure icons update correctly based on the 'open' attribute state *after* the click potentially changes it.
                // Use setTimeout to check state after the event bubble phase.
                setTimeout(() => {
                    const isOpen = item.hasAttribute('open');
                    const iconOpen = item.querySelector('.icon-open');
                    const iconClose = item.querySelector('.icon-close');

                    if (iconOpen) iconOpen.classList.toggle('hidden', isOpen);
                    if (iconClose) iconClose.classList.toggle('hidden', !isOpen);
                }, 0);
            });

            // Set initial icon state based on default open state if any
             const isOpen = item.hasAttribute('open');
             const iconOpen = item.querySelector('.icon-open');
             const iconClose = item.querySelector('.icon-close');
             if (iconOpen) iconOpen.classList.toggle('hidden', isOpen);
             if (iconClose) iconClose.classList.toggle('hidden', !isOpen);
        }
    });

    // --- Multi-Method Payment Logic ---
    const paymentForm = document.getElementById('payment-form');
    const paymentTabs = document.querySelectorAll('.payment-tab');
    const paymentMethodAreas = document.querySelectorAll('.payment-method-area');
    const selectedMethodInput = document.getElementById('selected-payment-method');

    const paymentProcessingMessage = document.getElementById('payment-processing');
    const paymentWaitingMessage = document.getElementById('payment-waiting'); // New message element
    const paymentSuccessMessage = document.getElementById('payment-success');
    const paymentErrorMessage = document.getElementById('payment-error'); // Container for general errors
    const paymentErrorText = document.getElementById('payment-error-message'); // Specific error text
    const signupCodeDisplay = document.getElementById('signup-code');
    const cardErrors = document.getElementById('card-errors'); // Specific for card element

    let currentPaymentMethod = 'card'; // Default

    // Function to switch payment method view
    const switchPaymentMethod = (method) => {
        currentPaymentMethod = method;
        if (selectedMethodInput) selectedMethodInput.value = method;

        paymentTabs.forEach(tab => {
            const tabMethod = tab.dataset.paymentMethod;
            const isActive = tabMethod === method;
            tab.classList.toggle('active', isActive); // Use CSS for active state
            tab.classList.toggle('border-indigo-500', isActive);
            tab.classList.toggle('text-indigo-600', isActive);
            tab.classList.toggle('border-transparent', !isActive);
            tab.classList.toggle('text-gray-500', !isActive);
            tab.setAttribute('aria-current', isActive ? 'page' : 'false');
        });

        paymentMethodAreas.forEach(area => {
            area.classList.toggle('hidden', area.id !== `payment-${method}-area`);
        });

        // Clear specific errors when switching
        if (cardErrors) cardErrors.textContent = '';
        if (paymentErrorMessage) paymentErrorMessage.classList.add('hidden');

        // Update reference placeholders if email exists
        const emailVal = document.getElementById('payment-email')?.value || 'YourEmail';
        const mpesaRef = document.getElementById('mpesa-ref-placeholder');
        const bankRef = document.getElementById('bank-ref-placeholder');
        if(mpesaRef) mpesaRef.textContent = emailVal.split('@')[0] || 'Ref'; // Simple ref example
        if(bankRef) bankRef.textContent = emailVal || 'YourEmail';
    };

    // Add click listeners to tabs
    paymentTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchPaymentMethod(tab.dataset.paymentMethod);
        });
    });

    // Update references when email changes
    const emailInput = document.getElementById('payment-email');
    if (emailInput) {
        emailInput.addEventListener('input', () => {
             const emailVal = emailInput.value || 'YourEmail';
             const mpesaRef = document.getElementById('mpesa-ref-placeholder');
             const bankRef = document.getElementById('bank-ref-placeholder');
             if(mpesaRef) mpesaRef.textContent = emailVal.split('@')[0] || 'Ref';
             if(bankRef) bankRef.textContent = emailVal || 'YourEmail';
        });
    }


    // Initialize the view to the default method ('card')
    switchPaymentMethod(currentPaymentMethod);

    // Handle form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = paymentForm.querySelector(`.payment-submit-button[data-method="${currentPaymentMethod}"]`);

            // Basic validation (Email is required)
            const emailValue = emailInput ? emailInput.value : null;
            if (!emailValue || !emailValue.includes('@')) {
                if (paymentErrorText) paymentErrorText.textContent = 'Please enter a valid email address.';
                if (paymentErrorMessage) paymentErrorMessage.classList.remove('hidden');
                return;
            }


            // Disable button, hide messages
            if (submitButton) submitButton.disabled = true;
            if (paymentProcessingMessage) paymentProcessingMessage.classList.add('hidden');
            if (paymentWaitingMessage) paymentWaitingMessage.classList.add('hidden');
            if (paymentSuccessMessage) paymentSuccessMessage.classList.add('hidden');
            if (paymentErrorMessage) paymentErrorMessage.classList.add('hidden');
            if (cardErrors) cardErrors.textContent = '';


            // --- Simulate Payment Processing based on method ---
            console.log(`Attempting payment via: ${currentPaymentMethod}`);

            try {
                let success = false;
                let requiresManualVerification = false;

                if (currentPaymentMethod === 'card') {
                    if (paymentProcessingMessage) paymentProcessingMessage.classList.remove('hidden');
                    // !! IMPORTANT: Replace with actual Stripe/Gateway call !!
                    // Example: const result = await stripe.confirmCardPayment(...) or stripe.createToken(...)
                    // if (result.error) { throw new Error(result.error.message); }
                    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
                    success = true; // Assume success for demo
                    // In real scenario, success = !result.error;

                } else if (currentPaymentMethod === 'mpesa') {
                    const phoneInput = document.getElementById('mpesa-phone');
                    if (!phoneInput || !phoneInput.value.match(/^(?:254|\+254|0)?(7|1)\d{8}$/)) { // Basic Kenyan phone format check
                         throw new Error('Please enter a valid M-Pesa phone number (e.g., 2547...).');
                    }
                    if (paymentWaitingMessage) paymentWaitingMessage.classList.remove('hidden');
                    // Backend Task: Initiate STK Push or wait for callback/reconciliation based on phone/ref.
                    // Frontend just waits for backend confirmation (simulated).
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Simulate waiting for confirmation
                    success = true; // Assume backend confirmed for demo
                    requiresManualVerification = true; // Indicate success is simulated post-action

                } else if (currentPaymentMethod === 'flutterwave') {
                     if (paymentProcessingMessage) paymentProcessingMessage.textContent = 'Redirecting to Flutterwave...';
                     if (paymentProcessingMessage) paymentProcessingMessage.classList.remove('hidden');
                    // !! IMPORTANT: Replace with actual Flutterwave SDK initiation !!
                    // Example: FlutterwaveCheckout({ public_key: "...", tx_ref: "...", amount: ..., ... });
                    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate redirect/modal time
                    success = true; // Assume successful return/callback for demo

                } else if (currentPaymentMethod === 'bank') {
                     if (paymentWaitingMessage) paymentWaitingMessage.textContent = 'Confirmation pending. We will email you once verified (up to 24 hours).';
                     if (paymentWaitingMessage) paymentWaitingMessage.classList.remove('hidden');
                    // User has confirmed they've made the transfer. Backend needs manual check.
                    // Frontend can show a pending state.
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Short delay to show message
                    success = true; // Mark as 'success' in terms of user action completed
                    requiresManualVerification = true; // Indicate backend needs to verify
                    // For demo, we'll proceed to show code, but in reality, wait for backend signal.
                }

                // --- Handle Result ---
                if (paymentProcessingMessage) paymentProcessingMessage.classList.add('hidden');
                if (paymentWaitingMessage) paymentWaitingMessage.classList.add('hidden');

                if (success) {
                    // Generate code ONLY if payment is truly confirmed (or for demo)
                    // In real life, this code generation happens *after* backend verifies payment
                    const fakeSignupCode = Math.floor(100000 + Math.random() * 900000).toString();
                    if (signupCodeDisplay) signupCodeDisplay.textContent = fakeSignupCode;
                    if (paymentSuccessMessage) paymentSuccessMessage.classList.remove('hidden');

                    // Hide form elements after success
                    paymentForm.querySelector('#payment-card-area')?.classList.add('hidden');
                    paymentForm.querySelector('#payment-mpesa-area')?.classList.add('hidden');
                    paymentForm.querySelector('#payment-flutterwave-area')?.classList.add('hidden');
                    paymentForm.querySelector('#payment-bank-area')?.classList.add('hidden');
                    paymentForm.querySelector('.border-b.border-gray-200')?.classList.add('hidden'); // Hide tabs nav
                    if (emailInput) emailInput.readOnly = true; // Make email read-only

                    // Scroll to success message
                    const headerOffset = document.getElementById('header')?.offsetHeight || 0;
                    const elementPosition = paymentSuccessMessage.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

                } else {
                    // This 'else' might not be reached if errors are thrown
                     throw new Error('Payment failed. Please try again.');
                }

            } catch (error) {
                console.error("Payment Error:", error);
                 if (paymentProcessingMessage) paymentProcessingMessage.classList.add('hidden');
                 if (paymentWaitingMessage) paymentWaitingMessage.classList.add('hidden');
                 if (paymentErrorText) paymentErrorText.textContent = error.message || 'An unknown error occurred.';
                 if (paymentErrorMessage) paymentErrorMessage.classList.remove('hidden');
                 if (submitButton) submitButton.disabled = false; // Re-enable button on failure
            }
        });
    }

    // Re-initialize Lucide icons if new ones were added dynamically (e.g., in tabs)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

}); // End DOMContentLoaded






// papri.js

// --- Translations Dictionary ---
// Add more keys and languages as needed
const translations = {
    'sw': { // Swahili example for Kenya (KE)
        'page_title': 'Papri - Pata Kipande Chochote Kwenye Video Zako Mara Moja',
        'nav_try': 'Jaribu Papri',
        'nav_why': 'Kwa Nini Papri?',
        'nav_how': 'Inavyofanya Kazi',
        'nav_pricing': 'Bei',
        'nav_faq': 'Maswali Yaulizwayo Sana',
        'button_login': 'Ingia',
        'button_signup': 'Jisajili',
        'hero_badge': 'Utafutaji Mpya wa Video kwa Akili Bandia',
        'hero_title': 'Acha Kutafuta, Anza Kupata. #ShazamYaMaudhui!',
        'hero_subtitle': 'Fikia Kipande Chochote Mara Moja<br class="sm:hidden"> Katika Maudhui Yoyote Mtandaoni.',
        'hero_button_try': 'Jaribu Papri Bure',
        'hero_button_demo': 'Tazama Demo',
        'try_title': 'Tumia Papri Sasa',
        'try_subtitle': 'Weka linki (k.m., YouTube, Vimeo) au pakia faili/picha ya skrini, tuambie unachotafuta, na AI yetu itakuonyesha kipande husika.',
        'try_trial_counter': 'Una utafutaji {count} wa bure uliobaki.', // Placeholder for count
        'try_trial_counter_plural': 'Una tafuto {count} za bure zilizobaki.', // Placeholder for count
        'try_trial_limit': 'Umetumia tafuto zako zote za bure.',
        'try_trial_subscribe': 'Jisajili ili uendelee kutafuta!',
        'try_label_source': 'Chanzo cha Maudhui (URL au Pakia)',
        'try_placeholder_url': 'Weka URL ya video (k.m., YouTube, Vimeo)',
        'try_or': 'au',
        'try_button_upload': 'Pakia Faili',
        'try_file_selected': 'Imechaguliwa: ', // Prefix for file name
        'try_label_query': 'Unatafuta nini?',
        'try_placeholder_query': 'Elezea tukio, kitu, maneno yaliyosemwa, au kitendo...',
        'try_button_find': 'Pata Kipande',
        'why_title': 'Umechoka Kusogeza Video?',
        'why_subtitle': 'Acha kupoteza masaa kutafuta mwenyewe. Akili bandia ya Papri inaelewa maudhui unayopenda (video, Memes, Reels), ikikuruhusu kupata unachohitaji, mara moja.',
        'why_feature1_title': 'Usahihi wa Papo Hapo',
        'why_feature1_desc': 'Hakuna kusogeza tena. Elezea unachotafuta (maneno, vitu, vitendo, matukio) na Papri inakupeleka kwenye kipande husika kwa sekunde.',
        'why_feature2_title': 'Tafuta *Ndani* ya Maudhui Unayopenda',
        'why_feature2_desc': 'Papri inaenda mbali zaidi ya vichwa vya habari na maelezo. AI yetu inachambua maudhui halisi - manukuu ya sauti, vipengele vya kuona, na muktadha - kwa matokeo sahihi kabisa.',
        'why_feature3_title': 'Okoa Muda & Ongeza Tija',
        'why_feature3_desc': 'Rejesha masaa yaliyopotea kwa utafutaji wa mikono. Inafaa kwa watengeneza maudhui, watafiti, wanafunzi, na yeyote anayefanya kazi sana na maudhui ya video.',
        'steps_title': 'Anza kwa Hatua 3 Rahisi',
        'steps_subtitle': 'Fungua uwezo wa maktaba yako ya video bila shida.',
        'steps_step1_title': 'Toa Maudhui Yako',
        'steps_step1_desc': 'Bandika linki (YouTube, Vimeo, Instagram, Tiktok, n.k.) au pakia faili lako la maudhui kwa usalama moja kwa moja kwenye Papri.',
        'steps_step2_title': 'Elezea Kipande Chako',
        'steps_step2_desc': 'Mwambie Papri unachotafuta - maneno muhimu, misemo iliyosemwa, maelezo ya kuona, au vitendo.',
        'steps_step3_title': 'Pata Mara Moja',
        'steps_step3_desc': 'AI yetu inapekua mtandao mzima na inawasilisha maudhui halisi yanayolingana na swali lako, tayari kutazamwa, kukatwa, au kupakuliwa.',
        'pricing_title': 'Uko Tayari Kufungua Ufikiaji Bila Kikomo?',
        'pricing_subtitle': 'Nenda mbali zaidi ya jaribio la bure na ubadilishe jinsi unavyoingiliana na maudhui.',
        'pricing_plan_name': 'Mpango wa Pro',
        'pricing_plan_audience': 'Kwa watu binafsi na timu ndogo.',
        'pricing_per_month': '/ mwezi',
        'pricing_billing_info': 'Inatozwa kila mwezi, ghairi wakati wowote.',
        'pricing_feature_searches': 'Utafutaji wa maudhui bila kikomo',
        'pricing_feature_sources': 'Usaidizi kwa YouTube, Vimeo, Tiktok, Instagram, upakiaji',
        'pricing_feature_analysis': 'Uchambuzi wa maudhui unaoendeshwa na AI',
        'pricing_feature_timestamps': 'Matokeo yenye mihuri ya muda',
        'pricing_feature_segments': 'Pakua & Kata sehemu (inakuja hivi karibuni)',
        'pricing_feature_support': 'Usaidizi wa kipaumbele',
        'pricing_enterprise_prompt': 'Unahitaji vipengele vya biashara?',
        'pricing_contact_sales': 'Wasiliana na Mauzo',
        'payment_title': 'Kamilisha Malipo Yako Salama',
        'payment_choose_method': 'Chagua Njia Yako ya Malipo',
        'payment_method_card': 'Kadi',
        'payment_method_mpesa': 'M-Pesa',
        'payment_method_flutterwave': 'Flutterwave',
        'payment_method_bank': 'Uhamisho wa Benki',
        'payment_label_email': 'Anwani ya Barua Pepe',
        'payment_placeholder_email': 'wewe@mfano.com',
        'payment_email_hint': 'Risiti yako na nambari ya kujisajili zitatumwa hapa.',
        'payment_label_card': 'Kadi ya mkopo au debit (Visa, Mastercard, n.k.)',
        'payment_secure_by': 'Usindikaji salama wa malipo na Lango.',
        'payment_button_pay': 'Lipa',
        'payment_button_securely': 'Kwa Usalama',
        'payment_label_mpesa_phone': 'Nambari ya Simu ya M-Pesa',
        'payment_placeholder_mpesa_phone': 'k.m., 2547XXXXXXXX',
        'payment_mpesa_phone_hint': 'Ingiza nambari utakayolipa nayo.',
        'payment_instructions': 'Maelekezo:',
        'payment_mpesa_step1': 'Nenda kwenye menyu yako ya M-Pesa.',
        'payment_mpesa_step2': 'Chagua "Lipa na M-Pesa".',
        'payment_mpesa_step3': 'Chagua "Pay Bill".',
        'payment_mpesa_step4': 'Ingiza Nambari ya Biashara: <strong class="text-black">XXXXXX</strong>', // Keep placeholders
        'payment_mpesa_step5': 'Ingiza Nambari ya Akaunti: <strong class="text-black">PAPRI<span id="mpesa-ref-placeholder"></span></strong>',
        'payment_mpesa_step6': 'Ingiza Kiasi: <strong class="text-black mpesa-amount-display">KES YYY</strong>', // Needs update
        'payment_mpesa_step7': 'Ingiza PIN yako ya M-Pesa na Tuma.',
        'payment_mpesa_confirm_hint': 'Baada ya kutuma, bofya \'Thibitisha Malipo\' hapa chini. Tutahakiki muamala wako (inaweza kuchukua dakika moja).',
        'payment_button_confirm_mpesa': 'Thibitisha Malipo ya M-Pesa',
        'payment_flutterwave_redirect_hint': 'Utaelekezwa kwa Flutterwave kukamilisha malipo yako kwa kutumia njia mbalimbali (Kadi, Mobile Money, Uhamisho wa Benki, n.k.).',
        'payment_button_pay_with': 'Lipa',
        'payment_button_with_flutterwave': 'na Flutterwave',
        'payment_bank_instructions_title': 'Maelekezo ya Uhamisho wa Moja kwa Moja wa Benki:',
        'payment_bank_name': 'Jina la Benki',
        'payment_bank_account_name': 'Jina la Akaunti',
        'payment_bank_account_number': 'Nambari ya Akaunti',
        'payment_bank_branch_code': 'Msimbo wa Tawi',
        'payment_bank_if_applicable': 'ikiwa inatumika',
        'payment_bank_swift': 'SWIFT/BIC',
        'payment_bank_international': 'kwa kimataifa',
        'payment_bank_amount': 'Kiasi',
        'payment_bank_or_local': 'au sawa na KES ZZZ', // Needs update
        'payment_bank_reference': 'Kumbukumbu/Maelezo',
        'payment_bank_confirm_hint': 'Baada ya kufanya uhamisho, tafadhali bofya \'Thibitisha Uhamisho\'. Uthibitishaji unaweza kuchukua hadi saa 24. Tutakutumia barua pepe ikithibitishwa.',
        'payment_button_confirm_bank': 'Nimefanya Uhamisho',
        'payment_status_processing': 'Inashughulikia malipo...',
        'payment_status_waiting': 'Inasubiri uthibitisho wa malipo...',
        'payment_status_success': 'Malipo Yamethibitishwa!',
        'payment_success_code_prompt': 'Nambari yako ya kujisajili ya tarakimu 6:',
        'payment_success_email_hint': '(Angalia barua pepe yako pia! Utaihitaji kwa kujisajili.)',
        'payment_success_proceed': 'Endelea Kujisajili →',
        'payment_status_failed': 'Malipo Yameshindikana',
        'payment_error_default': 'Hitilafu imetokea. Tafadhali jaribu tena au wasiliana na usaidizi.',
        'faq_title': 'Maswali Yaulizwayo Sana',
        'faq_q1_title': 'Je, utafutaji wa AI una usahihi kiasi gani?',
        'faq_q1_desc': 'Papri inatumia miundo ya kisasa ya AI iliyofunzwa kwa kiasi kikubwa cha data mtandaoni. Inachambua manukuu, vipengele vya kuona, na muktadha ili kutoa matokeo sahihi sana. Usahihi unaboreshwa kila wakati AI inapojifunza, lakini maswali magumu au yenye utata yanaweza mara kwa mara kutoa matokeo yasiyo sahihi sana. Tunalenga usahihi wa hali ya juu katika matumizi ya kawaida kama kupata misemo maalum iliyosemwa au vitu/matukio yanayotambulika kwa urahisi.',
        'faq_q2_title': 'Ni aina gani za video na vyanzo vinavyotumika?',
        'faq_q2_desc': 'Hivi sasa, Papri inasaidia linki za moja kwa moja kutoka majukwaa makubwa kama YouTube, Instagram, Tiktok, na Vimeo. Unaweza pia kupakia fomati za faili za kawaida (MP4, MOV, AVI, n.k. - kulingana na vikomo vya ukubwa kwenye toleo la bure). Tunaendelea kufanya kazi kupanua usaidizi kwa majukwaa na fomati zaidi kulingana na maoni ya watumiaji.',
        'faq_q3_title': 'Je, maudhui yangu yaliyopakiwa yako salama?',
        'faq_q3_desc': 'Ndio, usalama ni kipaumbele cha juu. Maudhui yaliyopakiwa yanashughulikiwa kwa usalama, na tunatumia mazoea ya kawaida ya sekta kwa ulinzi wa data na faragha. Maudhui yako yanatumiwa tu kwa madhumuni ya kukupa matokeo ya utafutaji uliyoomba. Tafadhali rejelea Sera yetu ya Faragha kwa maelezo zaidi.',
        'faq_q4_title': 'Je, kikomo cha tafuto 3 za bure kinafanyaje kazi?',
        'faq_q4_desc': 'Ili kukuruhusu kupata uzoefu wa uwezo wa Papri, tunatoa tafuto 3 za bure. Hesabu hii inafuatiliwa kwa kutumia kuki ya kivinjari. Kila unapowasilisha utafutaji (ama kupitia URL au upakiaji), hesabu inapungua. Ukifikia sifuri, kiolesura cha utafutaji kitazimwa, kikikuhimiza kujisajili kwa ufikiaji usio na kikomo. Kikomo hiki kinaendelea hata ukiburudisha ukurasa au kufunga kivinjari chako.',
        'faq_q5_title': 'Nini kinatokea baada ya kulipa? Ninapataje nambari ya kujisajili?',
        'faq_q5_desc': 'Baada ya uthibitishaji wa malipo uliofanikiwa kupitia Stripe, nambari ya kipekee ya kujisajili ya tarakimu 6 itaonyeshwa mara moja kwenye skrini ndani ya ujumbe wa uthibitisho wa malipo. PIA tutatuma nambari hii kwa anwani ya barua pepe uliyotoa wakati wa malipo. Utahitaji nambari hii tu kwa kujisajili kwako *mara ya kwanza* kuunda akaunti yako ya Papri.',
        'faq_q6_title': 'Je, naweza kukata au kupakua sehemu za video?',
        'faq_q6_desc': 'Uwezo wa kukata na kupakua sehemu maalum za video zilizotambuliwa na Papri ni kipengele kilichopangwa kwa wateja wetu wa mpango wa Pro na kwa sasa kinatengenezwa ("kinakuja hivi karibuni"). Lengo letu ni kukuruhusu kutoa kwa urahisi sehemu husika unazopata bila kuhitaji programu ya nje ya kuhariri kwa klipu rahisi.',
        'faq_q7_title': 'Je, naweza kughairi usajili wangu?',
        'faq_q7_desc': 'Ndio, mpango wa $6 unatozwa kila mwezi, na unaweza kughairi wakati wowote kabla ya tarehe yako ijayo ya malipo kupitia mipangilio ya akaunti yako (ukishaingia) ili kuepuka malipo yajayo.',
        'footer_text': 'Papri. Pata vipande vya maudhui unayopenda, haraka zaidi.',
        'footer_privacy': 'Sera ya Faragha',
        'footer_terms': 'Masharti ya Huduma',
        'footer_contact': 'Wasiliana Nasi',
        // Add more translations...
    },
    // Add other languages like 'fr', 'es', etc.
};

// --- Geolocation and Localization Function ---
async function initializeLocalization() {
    const defaultLang = 'en';
    const defaultCurrency = 'USD';
    const defaultRate = 1.0;
    const basePriceUSD = 6; // Base price for the Pro plan

    try {
        // 1. Get Geolocation
        const geoResponse = await fetch('https://get.geojs.io/v1/ip/country.json');
        if (!geoResponse.ok) {
            throw new Error(`GeoJS fetch failed: ${geoResponse.status}`);
        }
        const geoData = await geoResponse.json();
        const countryCode = geoData.country?.toUpperCase(); // e.g., 'KE', 'US'

        console.log('Detected Country Code:', countryCode);

        // 2. Determine Language
        let lang = defaultLang;
        if (countryCode === 'KE') { // Example: Use Swahili for Kenya
            lang = 'sw';
        }
        // Add more country-to-language mappings here
        // else if (countryCode === 'FR') { lang = 'fr'; }

        // Apply Translation if language is supported
        if (lang !== defaultLang && translations[lang]) {
            console.log(`Applying translation for language: ${lang}`);
            translatePage(lang);
            // Set HTML lang attribute
            document.documentElement.lang = lang;
            // Set meta content-language tag
             const langMeta = document.querySelector('meta[http-equiv="Content-Language"]');
             if (langMeta) langMeta.setAttribute('content', lang);
        } else {
            console.log('Using default language: en');
        }

        // 3. Determine Currency and Convert
        let targetCurrency = defaultCurrency;
        let exchangeRate = defaultRate;
        let requiresConversion = false;

        if (countryCode === 'KE') {
            targetCurrency = 'KES';
            // **IMPORTANT**: Using a fixed rate for demonstration as API key is needed for real-time rates.
            // Replace this with a real API call in production.
            // Example API: https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD
             // For demo, let's assume $1 USD = 130 KES
            exchangeRate = 130;
            requiresConversion = true;
        }
        // Add more country-to-currency mappings and rates here
        // else if (countryCode === 'GB') { targetCurrency = 'GBP'; exchangeRate = 0.8; requiresConversion = true; }

        if (requiresConversion) {
             console.log(`Converting currency to: ${targetCurrency} at rate ${exchangeRate}`);
             convertCurrencyDisplay(basePriceUSD, targetCurrency, exchangeRate);
        } else {
             console.log('Using default currency: USD');
             // Optionally hide the converted price display if no conversion needed
             const convertedPriceEl = document.getElementById('converted-price');
             if (convertedPriceEl) convertedPriceEl.style.display = 'none';
        }

    } catch (error) {
        console.error('Localization Error:', error);
        // Page will remain in default English/USD if errors occur
    }
}

// --- Translation Helper ---
function translatePage(lang) {
    const elements = document.querySelectorAll('[data-translate-key]');
    const translationSet = translations[lang];

    if (!translationSet) {
        console.warn(`Translation set for language "${lang}" not found.`);
        return;
    }

    elements.forEach(el => {
        const key = el.dataset.translateKey;
        let translatedText = translationSet[key];

        if (translatedText !== undefined) {
             // Handle potential placeholders (like {count}) - basic example
            if (key === 'try_trial_counter' || key === 'try_trial_counter_plural') {
                // We need the actual count value, which is handled by the trial counter logic
                // This translation will be applied dynamically there instead.
            } else if (key === 'try_file_selected') {
                 // Handle prefix case
                 const prefix = el.dataset.translatePrefix || '';
                 // The actual file name is dynamic, only translate prefix if needed.
                 // For now, assume the JS handling file name will handle this text.
                 // We could potentially store the prefix in the dictionary too.
                 // el.dataset.translatedPrefix = translatedText; // Store for later use
            } else {
                // Handle simple text replacement
                el.innerHTML = translatedText; // Use innerHTML to allow for <br> tags etc.
            }
        } else {
             console.warn(`Translation key "${key}" not found for language "${lang}".`);
        }

        // Translate placeholder attribute if present
        const placeholderKey = el.dataset.translatePlaceholderKey;
        const translatedPlaceholder = translationSet[placeholderKey];
        if (placeholderKey && translatedPlaceholder !== undefined) {
            el.setAttribute('placeholder', translatedPlaceholder);
        }
    });
}


// --- Currency Conversion Helper ---
function convertCurrencyDisplay(basePriceUSD, targetCurrency, exchangeRate) {
    const convertedAmount = Math.ceil((basePriceUSD * exchangeRate)); // Simple ceiling conversion

    // Update main price display's adjacent element
    const convertedPriceEl = document.getElementById('converted-price');
    if (convertedPriceEl) {
        convertedPriceEl.innerHTML = `(approx. ${targetCurrency} ${convertedAmount} <span data-translate-key="pricing_per_month">/ month</span>*)`;
        convertedPriceEl.style.display = 'block'; // Ensure it's visible
        // Add disclaimer
        const disclaimer = document.createElement('span');
        disclaimer.className = 'block text-xs text-slate-400 mt-0.5';
        // disclaimer.textContent = `*Exchange rate is approximate. Final charge may vary.`;
        disclaimer.setAttribute('data-translate-key', 'pricing_rate_disclaimer');
        disclaimer.textContent = '*Exchange rate is approximate.'; // Default text
        // Insert disclaimer after the price text, or append if needed
         convertedPriceEl.appendChild(disclaimer);
    }

    // Update payment button amounts
    const paymentAmountDisplays = document.querySelectorAll('.payment-amount-display');
    paymentAmountDisplays.forEach(el => {
        el.textContent = `${targetCurrency} ${convertedAmount}`;
    });

    // Update specific M-Pesa/Bank amount displays (might need formatting)
    const mpesaAmountDisplay = document.querySelector('.mpesa-amount-display');
    if (mpesaAmountDisplay) {
        mpesaAmountDisplay.textContent = `${targetCurrency} ${convertedAmount}`;
    }
     const bankAmountDisplay = document.querySelector('.bank-amount-display');
     if (bankAmountDisplay) {
        // Update both USD and local currency parts
        const localEquivKey = 'payment_bank_or_local';
        let localEquivText = translations[document.documentElement.lang]?.[localEquivKey] || translations.en[localEquivKey] || "or KES equivalent ZZZ";
        localEquivText = localEquivText.replace('ZZZ', convertedAmount.toString()); // Replace placeholder

        bankAmountDisplay.textContent = `$${basePriceUSD} USD (${localEquivText})`;
    }

    // If a translation is active, re-translate elements updated by currency conversion
    const currentLang = document.documentElement.lang || 'en';
    if (currentLang !== 'en') {
        translatePage(currentLang);
    }
}

// --- Modify DOMContentLoaded Event Listener ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Initialize Localization FIRST ---
    initializeLocalization().then(() => {
        // Proceed with other initializations AFTER localization attempts

        // --- Initialize Lucide Icons ---
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        } else {
            console.warn('Lucide icons script not loaded yet.');
        }

        // --- Footer Year ---
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }

        // --- Mobile Menu ---
        // (Keep existing mobile menu logic)
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.setAttribute('data-lucide', mobileMenu.classList.contains('hidden') ? 'menu' : 'x');
                    lucide.createIcons();
                }
            });
             mobileNavLinks.forEach(link => {
                 link.addEventListener('click', () => {
                      mobileMenu.classList.add('hidden');
                      const icon = mobileMenuButton.querySelector('i');
                      if (icon) {
                          icon.setAttribute('data-lucide', 'menu');
                          lucide.createIcons();
                      }
                 });
             });
        }


        // --- Smooth Scrolling ---
        // (Keep existing smooth scroll logic)
        const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        const headerOffset = document.getElementById('header')?.offsetHeight || 0;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 10;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        if (link.classList.contains('nav-link-mobile') && mobileMenu) {
                             mobileMenu.classList.add('hidden');
                             const icon = mobileMenuButton?.querySelector('i');
                             if (icon) icon.setAttribute('data-lucide', 'menu');
                             lucide.createIcons();
                        }
                    }
                }
            });
        });


        // --- Free Trial Counter Logic (needs localization update) ---
        const trialCounterDisplay = document.getElementById('trial-counter');
        const trialLimitMessage = document.getElementById('trial-limit-message');
        const searchInterface = document.getElementById('search-interface');
        const searchForm = document.getElementById('search-form');
        const searchSubmitButton = document.getElementById('search-submit-button');
        const cookieName = 'papri_trial_count';
        const maxTrials = 3;

        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        const setCookie = (name, value, days = 7) => {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
        };

        let currentTrials = parseInt(getCookie(cookieName));
        if (isNaN(currentTrials) || currentTrials < 0) {
            currentTrials = maxTrials;
            setCookie(cookieName, currentTrials);
        }

        const updateTrialDisplay = (count) => {
             if (trialCounterDisplay) {
                const currentLang = document.documentElement.lang || 'en';
                let baseKey = 'try_trial_counter';
                if (count !== 1 && translations[currentLang]?.[`${baseKey}_plural`]) {
                    baseKey = `${baseKey}_plural`; // Use plural key if available
                }
                let text = translations[currentLang]?.[baseKey] || translations['en']?.[baseKey] || `You have {count} free search remaining.`;
                // Use plural default if needed
                 if (count !== 1 && !translations[currentLang]?.[`${baseKey}_plural`]) {
                     text = translations['en']?.['try_trial_counter_plural'] || `You have {count} free searches remaining.`;
                 }

                trialCounterDisplay.textContent = text.replace('{count}', count);
            }
        };

        const disableSearch = () => {
            // ... (keep existing disableSearch logic)
            if (searchInterface) {
                 searchInterface.querySelectorAll('input, textarea, button').forEach(el => el.disabled = true);
                 searchInterface.classList.add('opacity-60', 'cursor-not-allowed');
             }
              if (searchSubmitButton) searchSubmitButton.disabled = true;
             if (trialCounterDisplay) trialCounterDisplay.classList.add('hidden');
             if (trialLimitMessage) trialLimitMessage.classList.remove('hidden');
        };

        // Initial setup for trial display
        if (currentTrials <= 0) {
            disableSearch();
        } else {
            updateTrialDisplay(currentTrials);
            if (trialLimitMessage) trialLimitMessage.classList.add('hidden');
        }

        // Search Form Submission (Trial Decrement)
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                currentTrials = parseInt(getCookie(cookieName)) || 0;

                if (currentTrials <= 0) {
                    disableSearch();
                    return;
                }

                // Decrement and update display BEFORE simulating search
                currentTrials--;
                setCookie(cookieName, currentTrials);
                updateTrialDisplay(currentTrials);

                // --- Simulate Search Process ---
                // ... (keep existing simulation logic) ...
                 const resultsArea = document.getElementById('search-results-area');
                 const resultsContainer = document.getElementById('search-results-container');
                 const loadingIndicator = document.getElementById('search-in-progress');
                 const errorIndicator = document.getElementById('search-error');
                 const noResultsIndicator = document.getElementById('no-results');

                 if(resultsArea) resultsArea.classList.remove('hidden');
                 if(resultsContainer) resultsContainer.innerHTML = '';
                 if(loadingIndicator) loadingIndicator.classList.remove('hidden');
                 if(errorIndicator) errorIndicator.classList.add('hidden');
                 if(noResultsIndicator) noResultsIndicator.classList.add('hidden');
                 if(searchSubmitButton) searchSubmitButton.disabled = true;

                 setTimeout(() => {
                     if(loadingIndicator) loadingIndicator.classList.add('hidden');
                     if(searchSubmitButton) searchSubmitButton.disabled = false;

                     // Check if trials ran out AFTER search completes
                     if (currentTrials <= 0) {
                         disableSearch(); // Disable now if trials are zero
                     } else {
                         // Re-enable button only if trials > 0
                          if(searchSubmitButton) searchSubmitButton.disabled = false;
                     }

                    // Mock results display... (keep existing mock logic)
                     const mockResults = [/* ... */];
                     // Handle mockResults display...

                 }, 2000);
            });
        }

        // --- Display Uploaded File Name ---
        // (Keep existing file upload logic, potentially add translation for "Selected: ")
         const fileUploadInput = document.getElementById('video-upload');
         const fileNameDisplay = document.getElementById('file-name-display');
         const videoUrlInput = document.getElementById('video-url');

         if (fileUploadInput && fileNameDisplay) {
             fileUploadInput.addEventListener('change', () => {
                 if (fileUploadInput.files.length > 0) {
                     const currentLang = document.documentElement.lang || 'en';
                     const prefixKey = 'try_file_selected';
                     const prefix = translations[currentLang]?.[prefixKey] || translations['en']?.[prefixKey] || 'Selected: ';
                     fileNameDisplay.textContent = `${prefix}${fileUploadInput.files[0].name}`;
                     if (videoUrlInput) videoUrlInput.value = '';
                 } else {
                     fileNameDisplay.textContent = '';
                 }
             });
         }
          if (videoUrlInput && fileUploadInput && fileNameDisplay) {
             videoUrlInput.addEventListener('input', () => {
                 if(videoUrlInput.value.trim() !== '') {
                     fileUploadInput.value = '';
                     fileNameDisplay.textContent = '';
                 }
             });
          }


        // --- FAQ Accordion ---
        // (Keep existing FAQ logic)
         const faqItems = document.querySelectorAll('.faq-item');
         faqItems.forEach(item => {
             const summary = item.querySelector('summary');
             if (summary) {
                 summary.addEventListener('click', (e) => {
                     setTimeout(() => {
                         const isOpen = item.hasAttribute('open');
                         const iconOpen = item.querySelector('.icon-open');
                         const iconClose = item.querySelector('.icon-close');
                         if (iconOpen) iconOpen.classList.toggle('hidden', isOpen);
                         if (iconClose) iconClose.classList.toggle('hidden', !isOpen);
                     }, 0);
                 });
                 const isOpen = item.hasAttribute('open');
                 const iconOpen = item.querySelector('.icon-open');
                 const iconClose = item.querySelector('.icon-close');
                 if (iconOpen) iconOpen.classList.toggle('hidden', isOpen);
                 if (iconClose) iconClose.classList.toggle('hidden', !isOpen);
             }
         });

        // --- Multi-Method Payment Logic ---
        // (Keep existing payment logic, it uses translation keys now)
        const paymentForm = document.getElementById('payment-form');
        const paymentTabs = document.querySelectorAll('.payment-tab');
        const paymentMethodAreas = document.querySelectorAll('.payment-method-area');
        const selectedMethodInput = document.getElementById('selected-payment-method');

        const paymentProcessingMessage = document.getElementById('payment-processing');
        const paymentWaitingMessage = document.getElementById('payment-waiting');
        const paymentSuccessMessage = document.getElementById('payment-success');
        const paymentErrorMessage = document.getElementById('payment-error');
        const paymentErrorText = document.getElementById('payment-error-message');
        const signupCodeDisplay = document.getElementById('signup-code');
        const cardErrors = document.getElementById('card-errors');

        let currentPaymentMethod = 'card';

        const switchPaymentMethod = (method) => {
             currentPaymentMethod = method;
             if (selectedMethodInput) selectedMethodInput.value = method;

             paymentTabs.forEach(tab => {
                 const tabMethod = tab.dataset.paymentMethod;
                 const isActive = tabMethod === method;
                 tab.classList.toggle('active', isActive); // Use JS for active state styling for clarity
                 tab.classList.toggle('border-indigo-500', isActive);
                 tab.classList.toggle('text-indigo-600', isActive);
                 tab.classList.toggle('border-transparent', !isActive);
                 tab.classList.toggle('text-gray-500', !isActive);
                 tab.setAttribute('aria-current', isActive ? 'page' : 'false');
             });

             paymentMethodAreas.forEach(area => {
                 area.classList.toggle('hidden', area.id !== `payment-${method}-area`);
             });

             if (cardErrors) cardErrors.textContent = '';
             if (paymentErrorMessage) paymentErrorMessage.classList.add('hidden');

             const emailVal = document.getElementById('payment-email')?.value || 'YourEmail';
             const mpesaRef = document.getElementById('mpesa-ref-placeholder');
             const bankRef = document.getElementById('bank-ref-placeholder');
             if(mpesaRef) mpesaRef.textContent = emailVal.split('@')[0] || 'Ref';
             if(bankRef) bankRef.textContent = emailVal || 'YourEmail';
         };

         paymentTabs.forEach(tab => {
             tab.addEventListener('click', (e) => {
                 // Prevent form submission if inside form
                 e.preventDefault();
                 switchPaymentMethod(tab.dataset.paymentMethod);
             });
         });

         const emailInput = document.getElementById('payment-email');
         if (emailInput) {
             emailInput.addEventListener('input', () => {
                  const emailVal = emailInput.value || 'YourEmail';
                  const mpesaRef = document.getElementById('mpesa-ref-placeholder');
                  const bankRef = document.getElementById('bank-ref-placeholder');
                  if(mpesaRef) mpesaRef.textContent = emailVal.split('@')[0] || 'Ref';
                  if(bankRef) bankRef.textContent = emailVal || 'YourEmail';
             });
         }

        switchPaymentMethod(currentPaymentMethod); // Initialize

         if (paymentForm) {
            paymentForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                // ... keep existing submit logic ...
                // It should work with the translated elements and updated pricing
                 const submitButton = paymentForm.querySelector(`.payment-submit-button[data-method="${currentPaymentMethod}"]`);
                 const emailValue = emailInput ? emailInput.value : null;

                 if (!emailValue || !emailValue.includes('@')) {
                     const currentLang = document.documentElement.lang || 'en';
                     const errorKey = 'payment_error_invalid_email'; // Example key
                     if (paymentErrorText) paymentErrorText.textContent = translations[currentLang]?.[errorKey] || 'Please enter a valid email address.';
                     if (paymentErrorMessage) paymentErrorMessage.classList.remove('hidden');
                     return;
                 }

                 // ... rest of submit logic (disable button, hide messages, simulate payment) ...
            });
        }


    }).catch(err => {
        console.error("Failed to initialize localization:", err);
        // Fallback: ensure basic initializations still run if localization fails
        if (typeof lucide !== 'undefined') lucide.createIcons();
        const currentYearSpan = document.getElementById('currentYear');
        if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
        // Initialize other non-dependent parts if necessary
    });



    // Add this inside the document.addEventListener('DOMContentLoaded', () => { ... });

    // --- Authentication Form Handling (Signup & Login) ---

    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            console.log('Signup form submitted');

            // --- TODO: Add actual signup validation and backend API call here ---
            // 1. Get form data (signup code, email, password, confirm password)
            const signupCode = signupForm.querySelector('#signup-code-input').value;
            const email = signupForm.querySelector('#signup-email').value;
            const password = signupForm.querySelector('#signup-password').value;
            const confirmPassword = signupForm.querySelector('#signup-password-confirm').value;

            // 2. Basic frontend validation (example)
            if (!signupCode || signupCode.length !== 6 || !/^\d+$/.test(signupCode) ) {
                 alert('Please enter a valid 6-digit signup code.'); // Replace with better error display
                 return;
            }
            if (password !== confirmPassword) {
                alert('Passwords do not match.'); // Replace with better error display
                return;
            }
            if (password.length < 8) { // Example minimum length
                 alert('Password must be at least 8 characters long.');
                 return;
            }
             // Add more validation as needed (email format etc.)


            // 3. Simulate backend call & success
            console.log('Simulating signup API call...');
            // Show loading state on button if desired
            const signupButton = signupForm.querySelector('button[type="submit"]');
            if (signupButton) signupButton.disabled = true;

            setTimeout(() => {
                console.log('Simulated signup successful!');
                // On actual success from backend:
                window.location.href = 'papriapp.html'; // Redirect to the app page
                 // No need to re-enable button if redirecting immediately
            }, 1000); // Simulate network delay

            // --- End of TODO ---
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            console.log('Login form submitted');

            // --- TODO: Add actual login validation and backend API call here ---
            // 1. Get form data (email, password)
             const email = loginForm.querySelector('#login-email').value;
             const password = loginForm.querySelector('#login-password').value;

             // 2. Basic validation
             if (!email || !password) {
                 alert('Please enter both email and password.'); // Replace with better error display
                 return;
             }

            // 3. Simulate backend call & success
            console.log('Simulating login API call...');
            const loginButton = loginForm.querySelector('button[type="submit"]');
             if (loginButton) loginButton.disabled = true;

            setTimeout(() => {
                console.log('Simulated login successful!');
                // On actual success from backend:
                window.location.href = 'papriapp.html'; // Redirect to the app page
                // No need to re-enable button if redirecting immediately
            }, 1000); // Simulate network delay

            // --- End of TODO ---
        });
    }

// Make sure this new code is placed before the final closing }); of the DOMContentLoaded listener.
}); // End DOMContentLoaded

