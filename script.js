// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Pricing plan dropdown functionality
    const pricingDropdown = document.querySelector('.pricing-plan-dropdown');
    const pricingDisplay = document.querySelector('.checkout-pricing');
    
    if (pricingDropdown && pricingDisplay) {
        const prices = {
            'monthly': {
                amount: 199,
                period: 'month',
                compareWith: null
            },
            'quarterly': {
                amount: 170,
                period: 'month',
                compareWith: {
                    amount: 199,
                    period: 'month'
                }
            },
            'annual': {
                amount: 160,
                period: 'month',
                compareWith: {
                    amount: 170,
                    period: 'month'
                }
            }
        };
        
        // Helper function to update price display with or without strikethrough
        function updatePriceDisplay(price) {
            let html = `$${price.amount}<span>/${price.period}</span>`;
            
            if (price.compareWith) {
                html += `<span class="strikethrough-price">$${price.compareWith.amount}/${price.compareWith.period}</span>`;
            }
            
            pricingDisplay.innerHTML = html;
        }
        
        // Set initial price display to match default selected option (quarterly)
        updatePriceDisplay(prices.quarterly);
        
        pricingDropdown.addEventListener('change', function() {
            const selectedPlan = this.value;
            const priceData = prices[selectedPlan];
            
            if (priceData) {
                updatePriceDisplay(priceData);
            }
        });
    }

    // Marketing Popup Functionality
    const marketingPopup = document.getElementById('marketing-popup');
    const closePopupBtn = document.getElementById('close-popup');
    const emailForm = document.getElementById('email-form');
    let hasScrolled = false;
    let popupShown = false;

    // Function to check if popup has been closed in this session
    function isPopupClosed() {
        return sessionStorage.getItem('popupClosed') === 'true';
    }

    // Function to show popup
    function showPopup() {
        if (!popupShown && !isPopupClosed()) {
            marketingPopup.classList.add('show');
            popupShown = true;
        }
    }

    // Show popup when user scrolls down
    window.addEventListener('scroll', function() {
        if (window.scrollY > 200 && !hasScrolled) {
            hasScrolled = true;
            // Slight delay before showing popup
            setTimeout(showPopup, 1000);
        }
    });

    // Close popup when clicking the close button
    closePopupBtn.addEventListener('click', function() {
        marketingPopup.classList.remove('show');
        sessionStorage.setItem('popupClosed', 'true');
    });

    // Handle form submission
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('popup-email').value;
        
        // Send data to CustomerIO - identify the user
        if (typeof _cio !== 'undefined') {
            // Create a unique timestamp for created_at
            const timestamp = Math.floor(Date.now() / 1000);
            
            // Identify the user in CustomerIO
            _cio.identify({
                id: email,
                email: email,
                created_at: timestamp,
                source: 'popup_discount',
                discount_offered: '10%'
            });
            
            // Track the subscription event
            _cio.track('popup_subscribed', {
                discount: '10%',
                page_url: window.location.href,
                page_title: document.title
            });
        }
        
        // Show thank you message
        emailForm.innerHTML = '<p style="font-size: 18px; color: #9A805B;">Thank you! Your discount code has been sent to your email.</p>';
        
        // Close popup after delay
        setTimeout(function() {
            marketingPopup.classList.remove('show');
            sessionStorage.setItem('popupClosed', 'true');
        }, 3000);
    });
});