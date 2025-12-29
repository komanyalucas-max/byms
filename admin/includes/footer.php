</div>
</main>

<script>
    lucide.createIcons();
</script>

<!-- TinyMCE (Self-Hosted) -->
<script src="assets/js/tinymce/tinymce.min.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        if (typeof tinymce !== 'undefined') {
            tinymce.init({
                selector: '.rich-editor',
                base_url: 'assets/js/tinymce',
                suffix: '.min',
                height: 300,
                menubar: false,
                plugins: 'lists link image code table wordcount',
                toolbar: 'undo redo | formatselect | bold italic textcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code',
                skin: 'oxide-dark',
                content_css: 'dark',
                license_key: 'gpl',
                promotion: false,
                setup: function(editor) {
                    editor.on('change', function() {
                        editor.save(); // Sync content to textarea
                    });
                }
            });
        }
    });


    // Sidebar logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    function toggleSidebar() {
        const isClosed = sidebar.classList.contains('-translate-x-full');
        if (isClosed) {
            // Open
            sidebar.classList.remove('-translate-x-full');
            sidebarOverlay.classList.remove('hidden');
            setTimeout(() => sidebarOverlay.classList.remove('opacity-0'), 10);
        } else {
            // Close
            sidebar.classList.add('-translate-x-full');
            sidebarOverlay.classList.add('opacity-0');
            setTimeout(() => sidebarOverlay.classList.add('hidden'), 300);
        }
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', toggleSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', toggleSidebar);
</script>
</body>

</html>