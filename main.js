// Detect page refresh and logout
(function() {
    const navEntries = performance.getEntriesByType('navigation');
    const isReload = (navEntries.length > 0 && navEntries[0].type === 'reload') || 
                     (performance.navigation && performance.navigation.type === 1);
    if (isReload) {
        sessionStorage.removeItem('vault_user');
        sessionStorage.removeItem('vault_pass');
        sessionStorage.removeItem('vault_unlocked');
    }
})();

// Three.js Core Background
function initThree() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Particle field
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 4000; i++) {
        vertices.push(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
        );
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const material = new THREE.PointsMaterial({ 
        color: isDark ? 0x6366f1 : 0x4f46e5, 
        size: 1.5, 
        transparent: true, 
        opacity: 0.5 
    });
    
    window.points = new THREE.Points(geometry, material);
    scene.add(window.points);

    // Add floating geometric shapes for more depth
    const shapes = [];
    const shapeColors = isDark ? [0x6366f1, 0x22d3ee] : [0x4f46e5, 0x0891b2];
    
    for (let i = 0; i < 15; i++) {
        const geo = new THREE.IcosahedronGeometry(Math.random() * 30 + 10, 0);
        const mat = new THREE.MeshPhongMaterial({ 
            color: shapeColors[i % 2], 
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const shape = new THREE.Mesh(geo, mat);
        shape.position.set(
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 500,
            Math.random() * 1000 - 500
        );
        shape.userData.rotationSpeed = Math.random() * 0.01;
        scene.add(shape);
        shapes.push(shape);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(100, 100, 100);
    scene.add(pointLight);

    camera.position.z = 800;

    function animate() {
        requestAnimationFrame(animate);
        window.points.rotation.y += 0.0003;
        shapes.forEach(s => {
            s.rotation.x += s.userData.rotationSpeed;
            s.rotation.y += s.userData.rotationSpeed;
        });
        renderer.render(scene, camera);
    }
    animate();

    // Responsive
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Mouse Influence
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 1000;
        const y = (e.clientY - window.innerHeight / 2) / 1000;
        gsap.to(points.rotation, { x: y, y: x, duration: 2 });
    });
}

// Global UI Rendering
function renderContent() {
    // 1. Render Free Resource Grid (if on resources.html)
    const resourceGrid = document.getElementById('main-resource-grid');
    if (resourceGrid) {
        FREE_RESOURCES.forEach(res => {
            const card = document.createElement('div');
            card.className = 'resource-card';
            card.innerHTML = `
                <div class="card-icon"><i data-lucide="file-text"></i></div>
                <h3>${res.title}</h3>
                <p>${res.desc}</p>
                <div class="card-footer" style="margin-top:20px; color:var(--primary-color); font-weight:600; display:flex; align-items:center; gap:8px;">
                    View Module <i data-lucide="arrow-right" size="16"></i>
                </div>
            `;
            card.style.cursor = 'pointer';
            card.onclick = () => window.location.href = `module.html?id=${res.id}`;
            resourceGrid.appendChild(card);
        });
    }

    // 1b. Render Exclusive Grid (if on fam.html)
    const exclusiveGrid = document.getElementById('exclusive-resource-grid');
    if (exclusiveGrid) {
        EXCLUSIVE_RESOURCES.forEach(res => {
            const card = document.createElement('div');
            card.className = 'resource-card';
            card.style.background = 'rgba(255,255,255,0.03)';
            card.style.cursor = 'pointer';
            card.innerHTML = `
                <div class="card-icon"><i data-lucide="crown"></i></div>
                <h3>${res.title}</h3>
                <p>${res.desc}</p>
                <div class="card-footer" style="margin-top:20px; color:var(--accent-color); font-weight:600; display:flex; align-items:center; gap:8px;">
                    Unlock Module <i data-lucide="arrow-right" size="16"></i>
                </div>
            `;
            card.onclick = () => window.location.href = `module.html?id=${res.id}`;
            exclusiveGrid.appendChild(card);
        });
    }

    // 2. Render YouTube Grid (if on youtube.html)
    const youtubeGrid = document.getElementById('youtube-list-grid');
    if (youtubeGrid) {
        youtubeVideos.forEach(vid => {
            const card = document.createElement('a');
            card.href = vid.url;
            card.target = "_blank";
            card.className = 'youtube-card';
            card.style.textDecoration = 'none';
            card.style.color = 'inherit';
            card.innerHTML = `
                <div class="thumb-wrap">
                    <img src="${vid.thumbnail}" alt="${vid.title}">
                    <div class="duration">${vid.duration}</div>
                </div>
                <div class="yt-info">
                    <h4>${vid.title}</h4>
                    <div class="yt-meta">${vid.views} views • Latest Tutorial</div>
                </div>
            `;
            youtubeGrid.appendChild(card);
        });
    }

    lucide.createIcons();
}

// Theme Toggle Logic
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleIcon(currentTheme);

    toggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateToggleIcon(theme);
        
        // Update 3D colors
        if (window.points) {
            window.points.material.color.set(theme === 'dark' ? 0x6366f1 : 0x4f46e5);
        }
    });
}

function updateToggleIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    if (!icon) return;
    icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
    lucide.createIcons();
}

// Page Entrance Animations
function animateEntrance() {
    gsap.from("nav", { y: -50, opacity: 0, duration: 1, ease: "power3.out" });
    gsap.from("h1, .lead, .hero-text p", { 
        y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" 
    });
    
    if (document.querySelector('.stat-card')) {
        gsap.from(".stat-card", {
            scale: 0.8, opacity: 0, duration: 0.8, stagger: 0.2, scrollTrigger: {
                trigger: ".stat-grid",
                start: "top 90%"
            }
        });
    }

    if (document.querySelector('.profile-frame')) {
        gsap.from(".profile-frame", {
            x: -100, opacity: 0, duration: 1.5, ease: "elastic.out(1, 0.5)"
        });
    }
}

// Init
window.addEventListener('DOMContentLoaded', async () => {
    initThree();
    renderContent();
    animateEntrance();
    initTheme();
    initAuthUI();
    await initVault();
});

// Global User Scores Logic
window.getUserScores = function(username) {
    if (!username) return {};
    // First get config scores (from config.js)
    const userConfig = (typeof CONFIG !== 'undefined') ? CONFIG.users.find(u => u.username === username) : null;
    const baseScores = userConfig && userConfig.scores ? { ...userConfig.scores } : {};
    
    // Then get localStorage scores (simulating local saves for session)
    const scoresStr = localStorage.getItem(`mock_scores_v3_${username}`);
    const localScores = scoresStr ? JSON.parse(scoresStr) : {};

    // Merge them, giving preference to baseScores if they are >= 7
    const finalScores = { ...localScores };
    for (const [testId, score] of Object.entries(baseScores)) {
        if (score >= 7) {
            finalScores[testId] = score; // locked in config
        } else if (!finalScores[testId] && score > 0) {
            finalScores[testId] = score; // partially passed in config
        }
    }
    return finalScores;
};

window.getTotalPoints = function(username) {
    const scores = window.getUserScores(username);
    // Only scores >= 7 (passed tests) count towards total points. Multiply by 10 for display.
    return Object.values(scores).reduce((total, s) => (s >= 7 ? total + s : total), 0) * 10;
};

// Auth UI Logic
function initAuthUI() {
    const authContainer = document.getElementById('auth-container');
    if (!authContainer) return;

    const savedUser = sessionStorage.getItem('vault_user');
    const isUnlocked = sessionStorage.getItem('vault_unlocked');

    if (savedUser && isUnlocked) {
        // Logged In State
        const points = window.getTotalPoints(savedUser);
        authContainer.innerHTML = `
            <div title="Total Validation Points" class="points-badge" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981; padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 0.4rem; margin-right: 1.5rem; letter-spacing: 0.5px;">
                <i data-lucide="award" size="14"></i> ${points} Pts
            </div>
            <button class="profile-btn" id="profile-menu-btn">
                <div class="dummy-avatar"><i data-lucide="user" size="16"></i></div>
                <span>${savedUser}</span>
            </button>
            <div class="dropdown-menu" id="profile-dropdown">
                <button id="logout-btn"><i data-lucide="log-out" size="16"></i> Logout</button>
            </div>
        `;
        
        const btn = document.getElementById('profile-menu-btn');
        const dropdown = document.getElementById('profile-dropdown');
        const logoutBtn = document.getElementById('logout-btn');

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!authContainer.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('vault_user');
            sessionStorage.removeItem('vault_pass');
            sessionStorage.removeItem('vault_unlocked');
            window.location.reload();
        });

    } else {
        // Logged Out State
        if (!window.location.pathname.includes('login.html')) {
            authContainer.innerHTML = `
                <a href="login.html" class="btn btn-small" style="font-size: 0.85rem; padding: 0.5rem 1rem; display:flex; gap:0.4rem; align-items:center;">
                    Login <i data-lucide="log-in" size="16"></i>
                </a>
            `;
        }
    }
    
    lucide.createIcons();
}


// Vault Login Logic
async function initVault() {
    const loginForm = document.getElementById('vault-login');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const user = document.getElementById('vault-user').value.trim();
            const pass = document.getElementById('vault-pass').value.trim();
            const errorMsg = document.getElementById('login-error');

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: user, password: pass })
                });
                const data = await response.json();

                if (data.success) {
                    if (errorMsg) errorMsg.style.display = 'none';
                    sessionStorage.setItem('vault_user', user);
                    sessionStorage.setItem('vault_pass', pass);
                    sessionStorage.setItem('vault_unlocked', 'true');
                    
                    // Redirect back to fam.html after successful login
                    if (window.location.pathname.includes('login.html')) {
                        window.location.href = 'fam.html';
                    } else {
                        const overlay = document.getElementById('locked-overlay');
                        const card = document.getElementById('vault-card');
                        if (overlay) overlay.classList.add('unlocked');
                        if (card) card.classList.add('show-content');
                    }
                } else {
                    if (errorMsg) errorMsg.style.display = 'block';
                    gsap.to(loginForm, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
                }
            } catch (err) {
                alert("Login Server unreachable! Ensure python server.py is running.");
            }
        });
    }

    // Re-validate session on every load
    const savedUser = sessionStorage.getItem('vault_user');
    const savedPass = sessionStorage.getItem('vault_pass');
    
    if (savedUser && savedPass) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: savedUser, password: savedPass })
            });
            const data = await response.json();
            
            if (data.success) {
                if (document.getElementById('locked-overlay')) {
                    document.getElementById('locked-overlay').classList.add('unlocked');
                    document.getElementById('vault-card').classList.add('show-content');
                }
            } else {
                sessionStorage.clear();
            }
        } catch (err) {
            console.log("Offline re-validation mode triggered.");
            // If offline, trust session storage overlay 
            if (document.getElementById('locked-overlay')) {
                document.getElementById('locked-overlay').classList.add('unlocked');
                document.getElementById('vault-card').classList.add('show-content');
            }
        }
    }

    // Forgot Password Logic Overlay
    const forgotBtn = document.getElementById('forgot-password');
    if (forgotBtn) {
        forgotBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const username = prompt("Enter your Vault Username to reset your password:");
            if (!username) return;

            // Check if username actually exists in config
            const userExists = CONFIG.users.find(u => u.username.toLowerCase() === username.toLowerCase());
            if (!userExists) {
                alert("Username not found in system.");
                return;
            }

            const subject = encodeURIComponent("Password Reset Request - CA Vault");
            const body = encodeURIComponent(`Hi Darshan,\n\nI forgot my password for the Captain Automation Vault. Could you please reset it for me in the config?\n\nMy Username is: ${userExists.username}\n\nThank you!`);
            window.location.href = `mailto:darshan29sable@gmail.com?subject=${subject}&body=${body}`;
        });
    }
}
