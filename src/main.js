document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const nav = document.querySelector('nav');
    const menuToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    let lastScrollTop = 0;
    let scrollTimeout;

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
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });
    };

    const initialHash = window.location.hash || '#/home';
    loadPage(initialHash, false);

    const smoothCollapseMenu = () => {
        navbarCollapse.style.height = `${navbarCollapse.scrollHeight}px`;
        setTimeout(() => {
            navbarCollapse.style.height = '0';
            setTimeout(() => {
                navbarCollapse.classList.remove('show');
                navbarCollapse.style.height = '';
            }, 300); // This should match the transition duration in CSS
        }, 10);
    };

    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const hash = link.getAttribute('href');
            loadPage(hash);
            if (window.innerWidth <= 992) {
                smoothCollapseMenu();
                menuToggle.classList.add('collapsed');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.hash) {
            loadPage(event.state.hash, false);
        }
    });

    window.addEventListener('scroll', () => {
        let st = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        if (st > lastScrollTop && st <= 200) {
            nav.classList.add('scrolled');
            nav.classList.remove('awake');
            nav.style.transform = 'translateY(-100%)';
        } else if (st <= 200) {
            nav.classList.add('scrolled');
            nav.classList.add('awake');
            nav.style.transform = 'translateY(0)';
        }

        scrollTimeout = setTimeout(() => {
            if (st > 200) {
                nav.classList.add('scrolled');
                nav.classList.add('awake');
                nav.style.transform = 'translateY(0)';
            }
        }, 200);

        lastScrollTop = st <= 0 ? 0 : st;
    });
});