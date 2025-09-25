/*
 * Seeds of Sound – Global JavaScript
 *
 * This script powers the dark mode toggle across all pages and provides
 * lightweight interactivity for the pledge form on the digital time capsule
 * (seeds.html). Commitments are stored in the browser's localStorage so
 * visitors can see their pledges reflected immediately. When adding new
 * functionality, keep it unobtrusive and performant.
 */

// Wait for DOM content to be fully loaded before attaching listeners
document.addEventListener('DOMContentLoaded', () => {
    initialiseThemeToggle();
    initialisePledgeForm();
});

/**
 * Initialises the dark mode toggle. Reads the saved theme from
 * localStorage (if any) and applies it. When the user clicks the toggle
 * button, the theme is switched and the preference persisted.
 */
function initialiseThemeToggle() {
    const toggleButton = document.querySelector('.theme-toggle');
    if (!toggleButton) return;

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }

    // Update button icon based on current theme
    updateThemeIcon();

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon();
    });
}

/**
 * Updates the dark mode toggle button icon depending on current theme.
 * A sun icon represents light mode and a moon icon represents dark mode.
 */
function updateThemeIcon() {
    const toggleButton = document.querySelector('.theme-toggle');
    if (!toggleButton) return;
    const isDark = document.body.classList.contains('dark');
    // Remove any existing icon
    toggleButton.innerHTML = '';
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = isDark ? '☀️' : '🌙';
    toggleButton.appendChild(icon);
    toggleButton.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
}

/**
 * Sets up the pledge form on the digital time capsule page. If the
 * corresponding elements are not found, the function quietly exits.
 * When a pledge is submitted the information is saved to localStorage and
 * rendered in the commitments list below.
 */
function initialisePledgeForm() {
    const form = document.getElementById('pledge-form');
    const listContainer = document.getElementById('pledges-list');
    const message = document.getElementById('pledge-message');
    if (!form || !listContainer) return;

    // Load existing commitments
    const stored = localStorage.getItem('commitments');
    let commitments = [];
    try {
        commitments = stored ? JSON.parse(stored) : [];
    } catch (e) {
        commitments = [];
    }
    commitments.forEach(c => renderCommitment(c));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = form.querySelector('select[name="category"]').value;
        const text = form.querySelector('textarea[name="text"]').value.trim();
        const remind = form.querySelector('select[name="reminder"]').value;
        if (!text) return;
        const commitment = { category, text, remind, timestamp: new Date().toISOString() };
        commitments.push(commitment);
        localStorage.setItem('commitments', JSON.stringify(commitments));
        renderCommitment(commitment);
        form.reset();
        // Provide feedback to user
        if (message) {
            message.textContent = 'Thank you! Your commitment has been recorded.';
            setTimeout(() => { message.textContent = ''; }, 4000);
        }
    });

    /**
     * Appends a commitment to the list container. Each entry displays the
     * category, pledge text and reminder frequency. The timestamp is
     * formatted to a human friendly date.
     */
    function renderCommitment(commitment) {
        const wrapper = document.createElement('div');
        wrapper.className = 'commitment-entry';
        const date = new Date(commitment.timestamp);
        const dateString = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        wrapper.innerHTML = `
            <div class="entry-header">
                <strong>${commitment.category}</strong>
                <span class="date">${dateString}</span>
            </div>
            <p class="entry-text">${commitment.text}</p>
            <p class="entry-reminder"><em>Reminder:</em> ${commitment.remind}</p>
        `;
        listContainer.appendChild(wrapper);
    }
}