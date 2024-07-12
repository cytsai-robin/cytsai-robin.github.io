document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('.menu-toggle');

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
            if (window.innerWidth <= 600) {
                nav.classList.remove('active'); // Hide menu on mobile after selection
                menuToggle.classList.remove('active');
                menuToggle.innerHTML = '☰'; // Revert to menu icon
            }
        });
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.hash) {
            loadPage(event.state.hash, false);
        }
    });

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        if (menuToggle.classList.contains('active')) {
            menuToggle.innerHTML = '&times;'; // Change to close icon
        } else {
            menuToggle.innerHTML = '☰'; // Revert to menu icon
        }
    });

    const handleScroll = () => {
        if (window.scrollY > 100) {
            if (window.innerWidth > 600) { // Only apply sticky class on larger screens
                nav.classList.add('sticky');
            }
            menuToggle.classList.add('sticky');
            header.classList.add('hidden');
        } else {
            nav.classList.remove('sticky');
            menuToggle.classList.remove('sticky');
            header.classList.remove('hidden');
        }

        if (window.innerWidth <= 600 && nav.classList.contains('active')) {
            nav.classList.remove('active'); // Auto hide menu on mobile when scrolling
            menuToggle.classList.remove('active');
            menuToggle.innerHTML = '☰'; // Revert to menu icon
        }
    };

    window.addEventListener('scroll', handleScroll);

    if (window.innerWidth <= 600) {
        const cvLink = document.querySelector('nav ul li a[href="#/cv"]');
        cvLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.open('src/assets/pdf/CV_resume-cytsai.pdf', '_blank');
        });
    }
});
