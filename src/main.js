document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    const routes = {
        '/': 'home.html',
        '/home': 'home.html',
        '/projects': 'projects.html',
        '/honors': 'honors.html',
        '/cv': 'cv.html'
    };

    const loadPage = (page, pushState = true) => {
        const fullUrl = 'src/pages/' + routes[page];

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
                updateActiveLink(page);
            })
            .catch(error => console.error('Error loading page:', error));
    };

    const updateActiveLink = (page) => {
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === page) {
                link.classList.add('active');
            }
        });
    };

    const initialPath = window.location.pathname;
    loadPage(initialPath, false);

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = link.getAttribute('href');
            loadPage(page);
        });
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            loadPage(event.state.page, false);
        }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        document.querySelector('nav').classList.toggle('active');
    });

    if (window.innerWidth <= 600) {
        const cvLink = document.querySelector('nav ul li a[href="/cv"]');
        cvLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.open('src/assets/pdf/CV_resume-cytsai.pdf', '_blank');
        });
    }
});
