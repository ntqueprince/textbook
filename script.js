// Initialize Supabase
const supabaseUrl = 'https://amsrxpzwgjleqebacgpl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtc3J4cHp3Z2psZXFlYmFjZ3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NDQ1MDcsImV4cCI6MjA2NzMyMDUwN30.rka0TwVVu2virQPNThD5q4uBxVwQjjBUp5Odzag2JYc';

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('dropdownLogoutBtn');
const authButtons = document.getElementById('authButtons');
const profileDropdown = document.getElementById('profileDropdown');
const profileBtn = document.getElementById('profileBtn');
const dropdownContent = document.getElementById('dropdownContent');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const authSection = document.getElementById('authSection');
const notesSection = document.getElementById('notesSection');
const authForm = document.getElementById('authForm');
const authTitle = document.getElementById('authTitle');
const authSubtitle = document.getElementById('authSubtitle');
const authSubmit = document.getElementById('authSubmit');
const nameGroup = document.getElementById('nameGroup');
const verificationGroup = document.getElementById('verificationGroup');
const notesContainer = document.getElementById('notesContainer');
const addNoteBtn = document.getElementById('addNoteBtn');
const addNoteTopBtn = document.getElementById('addNoteTopBtn');
const passwordGroup = document.getElementById('passwordGroup');
const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotLink = document.getElementById('forgotLink');

// Modal Elements
const noteModal = document.getElementById('noteModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const noteTitle = document.getElementById('noteTitle');
const noteContent = document.getElementById('noteContent');
const cancelNoteBtn = document.getElementById('cancelNoteBtn');
const saveNoteBtn = document.getElementById('saveNoteBtn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');
const fullscreenToggle = document.getElementById('fullscreenToggle');
const modalContent = document.getElementById('modalContent');
const particlesContainer = document.getElementById('particles');

// Settings Modal Elements
const settingsModal = document.getElementById('settingsModal');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const editProfileBtn = document.getElementById('editProfileBtn');
const changeEmailForm = document.getElementById('changeEmailForm');
const changePasswordForm = document.getElementById('changePasswordForm');
const currentEmailDisplay = document.getElementById('currentEmailDisplay');
const settingsTabs = document.querySelectorAll('.settings-tab');

// State variables
let isLoginMode = true;
let isForgotMode = false;
let isResetMode = false;
let currentUser = null;
let currentNoteId = null;
let dropdownOpen = false;
let isFullscreen = false;
let isSavingNote = false;

// ============================================
// AUTH MODE FUNCTIONS
// ============================================

function updateAuthUI() {
    const authToggleP = document.getElementById('authToggle');

    if (isResetMode) {
        authTitle.textContent = 'Set New Password';
        authSubtitle.textContent = 'Enter your new password below';
        authSubmit.textContent = 'Update Password';
        nameGroup.style.display = 'none';
        passwordGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'block';
        forgotPasswordLink.style.display = 'none';
        verificationGroup.style.display = 'none';
        authToggleP.innerHTML = '<a href="#" id="backToLoginLink">Back to Sign In</a>';
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';
    } else if (isForgotMode) {
        authTitle.textContent = 'Reset Password';
        authSubtitle.textContent = 'Enter your email to receive a reset link';
        authSubmit.textContent = 'Send Reset Link';
        nameGroup.style.display = 'none';
        passwordGroup.style.display = 'none';
        confirmPasswordGroup.style.display = 'none';
        forgotPasswordLink.style.display = 'none';
        verificationGroup.style.display = 'none';
        authToggleP.innerHTML = 'Remember your password? <a href="#" id="backToLoginLink">Sign In</a>';
    } else if (isLoginMode) {
        authTitle.textContent = 'Welcome Back!';
        authSubtitle.textContent = 'Please sign in to access your notebook';
        authSubmit.textContent = 'Sign In';
        nameGroup.style.display = 'none';
        passwordGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'none';
        forgotPasswordLink.style.display = 'block';
        verificationGroup.style.display = 'none';
        authToggleP.innerHTML = 'Don\'t have an account? <a href="#" id="toggleAuthLink">Sign Up</a>';
    } else {
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Join us to start your notebook journey';
        authSubmit.textContent = 'Sign Up';
        nameGroup.style.display = 'block';
        passwordGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'none';
        forgotPasswordLink.style.display = 'none';
        verificationGroup.style.display = 'none';
        authToggleP.innerHTML = 'Already have an account? <a href="#" id="toggleAuthLink">Sign In</a>';
    }

    attachAuthLinkListeners();
}

function attachAuthLinkListeners() {
    const toggleLink = document.getElementById('toggleAuthLink');
    const backLink = document.getElementById('backToLoginLink');

    if (toggleLink) {
        toggleLink.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            isForgotMode = false;
            isResetMode = false;
            updateAuthUI();
        });
    }

    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = true;
            isForgotMode = false;
            isResetMode = false;
            updateAuthUI();
        });
    }
}

// Forgot Password Link Click
if (forgotLink) {
    forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        isForgotMode = true;
        isLoginMode = false;
        isResetMode = false;
        updateAuthUI();
    });
}

// Header Login Button Click
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = true;
        isForgotMode = false;
        isResetMode = false;
        authSection.style.display = 'flex';
        updateAuthUI();
    });
}

// Header Sign Up Button Click
if (signupBtn) {
    signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = false;
        isForgotMode = false;
        isResetMode = false;
        authSection.style.display = 'flex';
        updateAuthUI();
    });
}

// Logout Button Click
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await supabaseClient.auth.signOut();

        // Reset all auth states
        isLoginMode = true;
        isForgotMode = false;
        isResetMode = false;
        currentUser = null;

        // Reset UI
        authSection.style.display = 'flex';
        notesSection.style.display = 'none';
        profileDropdown.style.display = 'none';
        authButtons.style.display = 'flex';
        dropdownContent.classList.remove('show');
        dropdownOpen = false;

        updateAuthUI();
        showToast('Logged out successfully', 'success');
    });
}

// ============================================
// AUTH FORM SUBMIT HANDLER
// ============================================

if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password')?.value || '';
        const confirmPassword = document.getElementById('confirmPassword')?.value || '';
        const name = document.getElementById('name')?.value || '';

        // RESET PASSWORD MODE
        if (isResetMode) {
            if (!password || !confirmPassword) {
                showToast('Please fill all fields', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }

            if (password.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }

            authSubmit.disabled = true;
            authSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

            try {
                const { error } = await supabaseClient.auth.updateUser({ password });

                if (error) {
                    showToast(error.message, 'error');
                } else {
                    showToast('Password updated! Please sign in.', 'success');
                    await supabaseClient.auth.signOut();
                    isResetMode = false;
                    isLoginMode = true;
                    isForgotMode = false;
                    updateAuthUI();
                }
            } catch (err) {
                showToast('Error updating password', 'error');
            } finally {
                authSubmit.disabled = false;
                authSubmit.textContent = 'Update Password';
            }
            return;
        }

        // FORGOT PASSWORD MODE
        if (isForgotMode) {
            if (!email) {
                showToast('Please enter your email', 'error');
                return;
            }

            authSubmit.disabled = true;
            authSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin + window.location.pathname
                });

                if (error) {
                    showToast(error.message, 'error');
                } else {
                    showToast('Reset link sent! Check your email.', 'success');
                    isForgotMode = false;
                    isLoginMode = true;
                    updateAuthUI();
                }
            } catch (err) {
                showToast('Error sending reset email', 'error');
            } finally {
                authSubmit.disabled = false;
                updateAuthUI(); // Let updateAuthUI set the correct button text
            }
            return;
        }

        // LOGIN MODE
        if (isLoginMode) {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                showToast(error.message, 'error');
            } else {
                showToast('Login successful!', 'success');
            }
        }
        // SIGNUP MODE
        else {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { full_name: name }
                }
            });

            if (error) {
                showToast(error.message, 'error');
            } else if (data.user) {
                showToast('Signup successful! Check your email.', 'info');
                isLoginMode = true;
                updateAuthUI();
            }
        }
    });
}

// ============================================
// SUPABASE AUTH STATE CHANGE
// ============================================

supabaseClient.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event);

    if (event === 'PASSWORD_RECOVERY') {
        isResetMode = true;
        isLoginMode = false;
        isForgotMode = false;
        currentUser = session?.user;
        authSection.style.display = 'flex';
        notesSection.style.display = 'none';
        updateAuthUI();
        showToast('Please enter your new password', 'info');
        return;
    }

    if (event === 'SIGNED_IN' && session) {
        currentUser = session.user;
        if (!isResetMode) {
            updateUIAfterAuth();
        }
    } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        authSection.style.display = 'flex';
        notesSection.style.display = 'none';
        profileDropdown.style.display = 'none';
        authButtons.style.display = 'flex';
        dropdownOpen = false;
        dropdownContent.classList.remove('show');
        notesContainer.innerHTML = '';
        if (addNoteBtn) notesContainer.appendChild(addNoteBtn);
    }
});

// ============================================
// CHECK FOR PASSWORD RECOVERY ON LOAD
// ============================================

async function checkForPasswordRecovery() {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const error = hashParams.get('error');
    const errorDescription = hashParams.get('error_description');
    const type = hashParams.get('type');

    if (error) {
        window.history.replaceState(null, '', window.location.pathname);
        if (error === 'access_denied' && errorDescription?.includes('expired')) {
            showToast('Reset link expired. Request a new one.', 'error');
            isForgotMode = true;
            isLoginMode = false;
        } else {
            showToast(errorDescription?.replace(/\+/g, ' ') || 'Something went wrong', 'error');
        }
        updateAuthUI();
        return true;
    }

    if (type === 'recovery') {
        const { data } = await supabaseClient.auth.getSession();
        if (data?.session) {
            isResetMode = true;
            isLoginMode = false;
            isForgotMode = false;
            currentUser = data.session.user;
            updateAuthUI();
            showToast('Please enter your new password', 'info');
            return true;
        }
    }

    return false;
}

// ============================================
// INITIALIZE APP
// ============================================

async function initializeApp() {
    createParticles();

    const isRecovery = await checkForPasswordRecovery();

    if (!isRecovery) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            currentUser = session.user;
            updateUIAfterAuth();
        } else {
            updateAuthUI();
        }
    }
}

initializeApp();

// ============================================
// UI HELPERS
// ============================================

function createParticles() {
    const colors = ['#4361ee', '#7209b7', '#f72585', '#4cc9f0', '#f9c74f'];
    if (!particlesContainer) return;

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 8 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animation = `float ${Math.random() * 15 + 10}s ${Math.random() * 5}s infinite linear`;
        particlesContainer.appendChild(particle);
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });
}

if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownOpen = !dropdownOpen;
        dropdownContent.classList.toggle('show', dropdownOpen);
    });
}

document.addEventListener('click', (e) => {
    if (dropdownOpen && !e.target.closest('.profile-dropdown')) {
        dropdownOpen = false;
        dropdownContent.classList.remove('show');
    }
});

if (fullscreenToggle) {
    fullscreenToggle.addEventListener('click', () => {
        isFullscreen = !isFullscreen;
        modalContent.classList.toggle('fullscreen', isFullscreen);
        const icon = fullscreenToggle.querySelector('i');
        icon.classList.toggle('fa-expand');
        icon.classList.toggle('fa-compress');
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        const { error } = await supabaseClient.auth.signOut();
        if (error) showToast(error.message, 'error');
        else showToast('Logged out successfully', 'success');
    });
}

// ============================================
// NOTE MANAGEMENT
// ============================================

if (addNoteTopBtn) {
    addNoteTopBtn.addEventListener('click', () => {
        currentNoteId = null;
        modalTitle.textContent = 'Create New Note';
        noteTitle.value = '';
        noteContent.value = '';
        noteModal.style.display = 'flex';
    });
}

if (addNoteBtn) {
    addNoteBtn.addEventListener('click', () => {
        currentNoteId = null;
        noteTitle.value = '';
        noteContent.value = '';
        modalTitle.textContent = 'Create New Note';
        noteModal.style.display = 'flex';
        isFullscreen = false;
        modalContent.classList.remove('fullscreen');
    });
}

if (closeModal) closeModal.addEventListener('click', () => noteModal.style.display = 'none');
if (cancelNoteBtn) cancelNoteBtn.addEventListener('click', () => noteModal.style.display = 'none');

if (saveNoteBtn) {
    saveNoteBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        if (isSavingNote) return;

        const title = noteTitle.value;
        const content = noteContent.value;

        if (!title || !content) {
            showToast('Please fill both title and content', 'error');
            return;
        }

        if (!currentUser) {
            showToast('Please login to save notes.', 'error');
            return;
        }

        isSavingNote = true;
        saveNoteBtn.disabled = true;
        saveNoteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        try {
            if (currentNoteId) {
                const { error } = await supabaseClient.from('notes').update({ title, content }).eq('id', currentNoteId);
                if (error) showToast(error.message, 'error');
                else { showToast('Note updated!', 'success'); fetchNotes(); }
            } else {
                const { data, error } = await supabaseClient.from('notes').insert([{ title, content, user_id: currentUser.id }]).select();
                if (error) showToast(error.message, 'error');
                else if (data?.length > 0) { showToast('Note created!', 'success'); fetchNotes(); }
            }
        } catch (err) {
            showToast('Error saving note', 'error');
        } finally {
            isSavingNote = false;
            saveNoteBtn.disabled = false;
            saveNoteBtn.innerHTML = '<i class="fas fa-save"></i> Save Note';
            noteModal.style.display = 'none';
        }
    });
}

async function fetchNotes() {
    if (!currentUser) {
        notesContainer.innerHTML = '';
        if (addNoteBtn) notesContainer.appendChild(addNoteBtn);
        return;
    }

    notesContainer.querySelectorAll('.note-card:not(.add-note)').forEach(n => n.remove());

    const { data, error } = await supabaseClient.from('notes').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });

    if (error) {
        showToast(error.message, 'error');
        return;
    }

    const groupedNotes = {};
    data.forEach(note => {
        if (!groupedNotes[note.title]) groupedNotes[note.title] = [];
        groupedNotes[note.title].push(note);
    });

    notesContainer.innerHTML = '';
    if (addNoteBtn) notesContainer.appendChild(addNoteBtn);

    for (const title in groupedNotes) {
        const notesForTitle = groupedNotes[title].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        let contentHtml = '';
        let lastDate = '';

        notesForTitle.forEach((note) => {
            const dateStr = new Date(note.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            if (dateStr !== lastDate) {
                contentHtml += `<div class="note-date-separator"><span>${dateStr}</span></div>`;
                lastDate = dateStr;
            }
            contentHtml += `${note.content.replace(/\n/g, '<br>')}<br>`;
        });

        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.dataset.id = notesForTitle[0].id;
        noteCard.innerHTML = `
            <div class="note-header">
                <h3 class="note-title">${title}</h3>
                <div class="note-header-right">
                    <span class="note-date">${new Date(notesForTitle[0].created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <i class="fas fa-chevron-down expand-icon"></i>
                </div>
            </div>
            <div class="note-content">${contentHtml}</div>
            <div class="note-actions">
                <div class="left-actions">
                    <button class="action-btn edit-btn edit-note"><i class="fas fa-edit"></i> Edit</button>
                </div>
                <button class="action-btn delete-btn delete-note"><i class="fas fa-trash"></i> Delete</button>
            </div>
        `;

        notesContainer.insertBefore(noteCard, addNoteBtn);

        noteCard.querySelector('.note-header').addEventListener('click', () => {
            document.querySelectorAll('.note-card.expanded').forEach(c => { if (c !== noteCard) c.classList.remove('expanded'); });
            noteCard.classList.toggle('expanded');
        });

        noteCard.querySelector('.note-content').addEventListener('click', e => e.stopPropagation());

        noteCard.querySelector('.edit-note').addEventListener('click', (e) => {
            e.stopPropagation();
            currentNoteId = notesForTitle[0].id;
            noteTitle.value = notesForTitle[0].title;
            noteContent.value = notesForTitle[0].content;
            modalTitle.textContent = 'Edit Note';
            noteModal.style.display = 'flex';
        });

        noteCard.querySelector('.delete-note').addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!confirm('Delete this note?')) return;
            const { error } = await supabaseClient.from('notes').delete().eq('id', notesForTitle[0].id);
            if (error) showToast(error.message, 'error');
            else { noteCard.remove(); showToast('Note deleted', 'success'); }
        });
    }
}

async function updateUIAfterAuth() {
    authSection.style.display = 'none';
    notesSection.style.display = 'block';
    profileDropdown.style.display = 'block';
    authButtons.style.display = 'none';
    userName.textContent = currentUser.user_metadata?.full_name || currentUser.email;
    userEmail.textContent = currentUser.email;
    await fetchNotes();
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

document.addEventListener('click', (event) => {
    if (!event.target.closest('.note-card') && !event.target.closest('#addNoteBtn')) {
        document.querySelectorAll('.note-card.expanded').forEach(c => c.classList.remove('expanded'));
    }
});

// ============================================
// SETTINGS MODAL FUNCTIONALITY
// ============================================

// Open Settings Modal
function openSettingsModal() {
    if (currentUser) {
        currentEmailDisplay.value = currentUser.email;
    }
    settingsModal.style.display = 'flex';
    dropdownOpen = false;
    dropdownContent.classList.remove('show');
}

// Close Settings Modal
if (closeSettingsModal) {
    closeSettingsModal.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
}

// Settings Button Click
if (settingsBtn) {
    settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSettingsModal();
    });
}

// Edit Profile Button Click (also opens settings)
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSettingsModal();
    });
}

// Tab Switching
settingsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        settingsTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const tabName = tab.dataset.tab;
        document.querySelectorAll('.settings-form').forEach(form => {
            form.classList.remove('active');
        });

        if (tabName === 'email') {
            changeEmailForm.classList.add('active');
        } else {
            changePasswordForm.classList.add('active');
        }
    });
});

// Change Email Form
if (changeEmailForm) {
    changeEmailForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newEmail = document.getElementById('newEmail').value.trim();

        if (!newEmail) {
            showToast('Please enter a new email', 'error');
            return;
        }

        if (newEmail === currentUser.email) {
            showToast('New email is same as current', 'error');
            return;
        }

        const submitBtn = changeEmailForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

        try {
            const { error } = await supabaseClient.auth.updateUser({ email: newEmail });

            if (error) {
                showToast(error.message, 'error');
            } else {
                showToast('Confirmation email sent! Check your inbox.', 'success');
                document.getElementById('newEmail').value = '';
                settingsModal.style.display = 'none';
            }
        } catch (err) {
            showToast('Error updating email', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-envelope"></i> Update Email';
        }
    });
}

// Change Password Form
if (changePasswordForm) {
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            showToast('Please fill all fields', 'error');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }

        if (newPassword.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }

        const submitBtn = changePasswordForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

        try {
            // First verify current password by re-signing in
            const { error: signInError } = await supabaseClient.auth.signInWithPassword({
                email: currentUser.email,
                password: currentPassword
            });

            if (signInError) {
                showToast('Current password is incorrect', 'error');
                return;
            }

            // Update password
            const { error } = await supabaseClient.auth.updateUser({ password: newPassword });

            if (error) {
                showToast(error.message, 'error');
            } else {
                showToast('Password updated successfully!', 'success');
                document.getElementById('currentPassword').value = '';
                document.getElementById('newPassword').value = '';
                document.getElementById('confirmNewPassword').value = '';
                settingsModal.style.display = 'none';
            }
        } catch (err) {
            showToast('Error updating password', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-lock"></i> Update Password';
        }
    });
}

// Close modal on outside click
settingsModal?.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
});
