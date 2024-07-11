document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    const loadPage = (page, pushState = true) => {
        const baseUrl = 'src/pages/';
        const fullUrl = baseUrl + page + '.html';

        fetch(fullUrl)
            .then(response => response.text())
            .then(data => {
                mainContent.innerHTML = data;
                window.scrollTo(0, 0);
                if (pushState) {
                    history.pushState({page: page}, '', page);
                }
                document.querySelector('.menu-toggle').classList.remove('active');
                document.querySelector('nav').classList.remove('active');
            })
            .catch(error => console.error('Error loading page:', error));
    };

    // Load the initial page based on the current URL or default to home
    const path = location.pathname.split('/').pop();
    const initialPage = path ? path.replace('.html', '') : 'home';
    loadPage(initialPage, false);

    // Add event listeners to navigation links
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            document.querySelectorAll('nav ul li a').forEach(link => link.classList.remove('active'));
            link.classList.add('active');
            const page = link.getAttribute('href').replace('.html', '');
            loadPage(page);
        });
    });

    // Handle browser back/forward navigation
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            loadPage(event.state.page, false);
        }
    });

    // Menu toggle for small screens
    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        document.querySelector('nav').classList.toggle('active');
    });

    // Open PDFs in a new tab on mobile
    if (window.innerWidth <= 600) {
        const cvLink = document.querySelector('nav ul li a[href="cv"]');
        cvLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.open('src/assets/pdf/CV_resume-cytsai.pdf', '_blank');
        });
    }
});
