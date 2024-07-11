document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    const routes = {
        '#/home': 'home.html',
        '#/projects': 'projects.html',
        '#/honors': 'honors.html',
        '#/cv': 'cv.html'
    };

    const loadPage = (hash, pushState = true) => {
        const fullUrl = 'src/pages/' + (routes[hash] || 'home.html');

        fetch(fullUrl)
            .then(response => response.text())
            .then(data => {
                mainContent.innerHTML = data;
                window.scrollTo(0, 0);
                if (pushState) {
                    history.pushState({hash: hash}, '', hash);
                }
                document.querySelector('.menu-toggle').classList.remove('active');
                document.querySelector('nav').classList.remove('active');
                updateActiveLink(hash);
            })
            .catch(error => console.error('Error loading page:', error));
    };

    const updateActiveLink = (hash) => {
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });
    };

    const initialHash = window.location.hash || '#/home';
    loadPage(initialHash, false);

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const hash = link.getAttribute('href');
            loadPage(hash);
        });
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.hash) {
            loadPage(event.state.hash, false);
        }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        document.querySelector('nav').classList.toggle('active');
    });

    if (window.innerWidth <= 600) {
        const cvLink = document.querySelector('nav ul li a[href="#/cv"]');
        cvLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.open('src/assets/pdf/CV_resume-cytsai.pdf', '_blank');
        });
    }
});
