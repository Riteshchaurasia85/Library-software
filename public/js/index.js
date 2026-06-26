        document.addEventListener('DOMContentLoaded', function() {
            const sidebarToggleBtn = document.getElementById('sidebarToggle');
            const navbarToggleBtn = document.getElementById('navbarToggle');
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.querySelector('.main-content');
            const navbarScroller = document.querySelector('.navbar-scroller');

            // Function to toggle sidebar
            function toggleSidebar() {
                sidebar.classList.toggle('sidebar-hidden');
                mainContent.classList.toggle('sidebar-hidden');
                navbarScroller.classList.toggle('sidebar-hidden');

                // Save state to localStorage
                const isHidden = sidebar.classList.contains('sidebar-hidden');
                localStorage.setItem('sidebarHidden', isHidden);
            }

            // Initialize sidebar: respect previous user preference (persist across sizes)
            const savedState = localStorage.getItem('sidebarHidden');
            if (savedState === 'true') {
                sidebar.classList.add('sidebar-hidden');
                mainContent.classList.add('sidebar-hidden');
                navbarScroller.classList.add('sidebar-hidden');
            } else if (savedState === 'false') {
                sidebar.classList.remove('sidebar-hidden');
                mainContent.classList.remove('sidebar-hidden');
                navbarScroller.classList.remove('sidebar-hidden');
            } else {
                // No saved preference; keep current default (show on desktop, hidden on very small screens if needed)
                // Do not overwrite localStorage so user's explicit toggles persist.
            }

            // Toggle sidebar on sidebar button click (support click + touchstart for mobile)
            if (sidebarToggleBtn) {
                sidebarToggleBtn.addEventListener('click', function (e) { e.preventDefault(); toggleSidebar(); });
                sidebarToggleBtn.addEventListener('touchstart', function (e) { e.preventDefault(); toggleSidebar(); });
            }

            // Toggle sidebar on navbar button click (support click + touchstart for mobile)
            if (navbarToggleBtn) {
                navbarToggleBtn.addEventListener('click', function (e) { e.preventDefault(); toggleSidebar(); });
                navbarToggleBtn.addEventListener('touchstart', function (e) { e.preventDefault(); toggleSidebar(); });
            }

            // Prevent sidebar link clicks from bubbling up and accidentally triggering other handlers
            const sidebarLinks = document.querySelectorAll('.sidebar .menu a');
            sidebarLinks.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    // allow navigation but stop propagation so only toggle buttons control sidebar
                    e.stopPropagation();
                });
                link.addEventListener('touchstart', function(e) {
                    e.stopPropagation();
                });
            });
        });