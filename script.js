// ============================================
// FIREBASE CONFIGURATION
// ============================================
// TODO: Replace these with your actual Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyCXTK8XOj80pFQ6TT84axhkk9kN4mx3BWA",
    authDomain: "cvang-notebook.firebaseapp.com",
    databaseURL: "https://cvang-notebook-default-rtdb.firebaseio.com",
    projectId: "cvang-notebook",
    storageBucket: "cvang-notebook.firebasestorage.app",
    messagingSenderId: "139657125909",
    appId: "1:139657125909:web:3d17d305f657cee45fee1c",
    measurementId: "G-4K8QBGG5S9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

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

    if (isForgotMode) {
        authTitle.textContent = 'Reset Password';
        authSubtitle.textContent = 'Enter your email to receive a reset link';
        authSubmit.textContent = 'Send Reset Link';
        nameGroup.style.display = 'none';
        passwordGroup.style.display = 'none';
        confirmPasswordGroup.style.display = 'none';
        forgotPasswordLink.style.display = 'none';
        authToggleP.innerHTML = 'Remember your password? <a href="#" id="backToLoginLink">Sign In</a>';
    } else if (isLoginMode) {
        authTitle.textContent = 'Welcome Back!';
        authSubtitle.textContent = 'Please sign in to access your notebook';
        authSubmit.textContent = 'Sign In';
        nameGroup.style.display = 'none';
        passwordGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'none';
        forgotPasswordLink.style.display = 'block';
        authToggleP.innerHTML = 'Don\'t have an account? <a href="#" id="toggleAuthLink">Sign Up</a>';
    } else {
        authTitle.textContent = 'Create Account';
        authSubtitle.textContent = 'Join us to start your notebook journey';
        authSubmit.textContent = 'Sign Up';
        nameGroup.style.display = 'block';
        passwordGroup.style.display = 'block';
        confirmPasswordGroup.style.display = 'none';
        forgotPasswordLink.style.display = 'none';
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
            updateAuthUI();
        });
    }

    if (backLink) {
        backLink.addEventListener('click', (e) => {
            e.preventDefault();
            isLoginMode = true;
            isForgotMode = false;
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
        updateAuthUI();
    });
}

// Header Login Button Click
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = true;
        isForgotMode = false;
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
        authSection.style.display = 'flex';
        updateAuthUI();
    });
}

// Logout Button Click
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await auth.signOut();
            // Reset all auth states
            isLoginMode = true;
            isForgotMode = false;
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
        } catch (err) {
            showToast(err.message, 'error');
        }
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
        const name = document.getElementById('name')?.value || '';

        // FORGOT PASSWORD MODE
        if (isForgotMode) {
            if (!email) {
                showToast('Please enter your email', 'error');
                return;
            }

            authSubmit.disabled = true;
            authSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

            try {
                await auth.sendPasswordResetEmail(email);
                showToast('Reset link sent! Check your email.', 'success');
                isForgotMode = false;
                isLoginMode = true;
                updateAuthUI();
            } catch (err) {
                showToast(getFirebaseErrorMessage(err.code), 'error');
            } finally {
                authSubmit.disabled = false;
                updateAuthUI();
            }
            return;
        }

        // LOGIN MODE
        if (isLoginMode) {
            if (!email || !password) {
                showToast('Please fill all fields', 'error');
                return;
            }

            authSubmit.disabled = true;
            authSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';

            try {
                await auth.signInWithEmailAndPassword(email, password);
                showToast('Login successful!', 'success');
            } catch (err) {
                showToast(getFirebaseErrorMessage(err.code), 'error');
            } finally {
                authSubmit.disabled = false;
                authSubmit.textContent = 'Sign In';
            }
        }
        // SIGNUP MODE
        else {
            if (!email || !password || !name) {
                showToast('Please fill all fields', 'error');
                return;
            }

            if (password.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }

            authSubmit.disabled = true;
            authSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);

                // Set display name
                await userCredential.user.updateProfile({
                    displayName: name
                });

                // Save user profile to database
                await db.ref('users/' + userCredential.user.uid).set({
                    full_name: name,
                    email: email,
                    created_at: firebase.database.ServerValue.TIMESTAMP
                });

                showToast('Account created successfully!', 'success');
            } catch (err) {
                showToast(getFirebaseErrorMessage(err.code), 'error');
            } finally {
                authSubmit.disabled = false;
                authSubmit.textContent = 'Sign Up';
            }
        }
    });
}

// ============================================
// FIREBASE AUTH STATE CHANGE
// ============================================

auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        updateUIAfterAuth();
    } else {
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
// FRIENDLY ERROR MESSAGES
// ============================================

function getFirebaseErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/user-disabled': 'This account has been disabled.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/invalid-credential': 'Invalid email or password.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
        'auth/requires-recent-login': 'Please log out and log in again to perform this action.',
        'auth/operation-not-allowed': 'This operation is not allowed.',
    };
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

// ============================================
// INITIALIZE APP
// ============================================

function initializeApp() {
    createParticles();
    updateAuthUI();
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
            const notesRef = db.ref('notes/' + currentUser.uid);

            if (currentNoteId) {
                // Update existing note
                await notesRef.child(currentNoteId).update({
                    title,
                    content,
                    updated_at: firebase.database.ServerValue.TIMESTAMP
                });
                showToast('Note updated!', 'success');
            } else {
                // Create new note
                const newNoteRef = notesRef.push();
                await newNoteRef.set({
                    title,
                    content,
                    created_at: firebase.database.ServerValue.TIMESTAMP,
                    updated_at: firebase.database.ServerValue.TIMESTAMP
                });
                showToast('Note created!', 'success');
            }

            fetchNotes();
        } catch (err) {
            showToast('Error saving note: ' + err.message, 'error');
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

    try {
        const snapshot = await db.ref('notes/' + currentUser.uid).orderByChild('created_at').once('value');
        const notesData = snapshot.val();

        if (!notesData) {
            notesContainer.innerHTML = '';
            if (addNoteBtn) notesContainer.appendChild(addNoteBtn);
            return;
        }

        // Convert to array with IDs
        const notesArray = Object.entries(notesData).map(([id, note]) => ({
            id,
            ...note
        }));

        // Sort by created_at descending
        notesArray.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

        // Group by title
        const groupedNotes = {};
        notesArray.forEach(note => {
            if (!groupedNotes[note.title]) groupedNotes[note.title] = [];
            groupedNotes[note.title].push(note);
        });

        notesContainer.innerHTML = '';
        if (addNoteBtn) notesContainer.appendChild(addNoteBtn);

        for (const title in groupedNotes) {
            const notesForTitle = groupedNotes[title].sort((a, b) => (b.created_at || 0) - (a.created_at || 0));
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
                try {
                    await db.ref('notes/' + currentUser.uid + '/' + notesForTitle[0].id).remove();
                    noteCard.remove();
                    showToast('Note deleted', 'success');
                } catch (err) {
                    showToast('Error deleting note: ' + err.message, 'error');
                }
            });
        }
    } catch (err) {
        showToast('Error loading notes: ' + err.message, 'error');
    }
}

async function updateUIAfterAuth() {
    authSection.style.display = 'none';
    notesSection.style.display = 'block';
    profileDropdown.style.display = 'block';
    authButtons.style.display = 'none';
    userName.textContent = currentUser.displayName || currentUser.email;
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
        const reauthPassword = document.getElementById('emailReauthPassword').value;

        if (!newEmail) {
            showToast('Please enter a new email', 'error');
            return;
        }

        if (!reauthPassword) {
            showToast('Please enter your current password', 'error');
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
            // Re-authenticate first (Firebase requires this for sensitive operations)
            const credential = firebase.auth.EmailAuthProvider.credential(
                currentUser.email,
                reauthPassword
            );
            await currentUser.reauthenticateWithCredential(credential);

            // Now update email
            await currentUser.verifyBeforeUpdateEmail(newEmail);
            showToast('Verification email sent to new address! Check your inbox.', 'success');
            document.getElementById('newEmail').value = '';
            document.getElementById('emailReauthPassword').value = '';
            settingsModal.style.display = 'none';
        } catch (err) {
            showToast(getFirebaseErrorMessage(err.code), 'error');
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
            // Re-authenticate first
            const credential = firebase.auth.EmailAuthProvider.credential(
                currentUser.email,
                currentPassword
            );
            await currentUser.reauthenticateWithCredential(credential);

            // Update password
            await currentUser.updatePassword(newPassword);
            showToast('Password updated successfully!', 'success');
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmNewPassword').value = '';
            settingsModal.style.display = 'none';
        } catch (err) {
            showToast(getFirebaseErrorMessage(err.code), 'error');
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

// Close note modal on outside click
noteModal?.addEventListener('click', (e) => {
    if (e.target === noteModal) {
        noteModal.style.display = 'none';
    }
});
