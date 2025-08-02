// Projects Data
const projectsData = [
    {
        id: 'saas-dashboard',
        title: 'SaaS Dashboard Platform',
        description: 'Modern analytics dashboard with real-time data visualization and user management.',
        image: 'images/projects/saas-dashboard.jpg',
        technologies: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
        price: 25000,
        status: 'live',
        category: 'saas',
        featured: true,
        github: 'https://github.com/garymike07/saas-dashboard',
        demo: '#'
    },
    {
        id: 'ecommerce-store',
        title: 'E-commerce Store',
        description: 'Full-featured online store with payment integration and inventory management.',
        image: 'images/projects/ecommerce-store.jpg',
        technologies: ['React', 'Stripe', 'Firebase', 'Tailwind'],
        price: 35000,
        status: 'live',
        category: 'ecommerce',
        featured: true,
        github: 'https://github.com/garymike07/ecommerce-store',
        demo: '#'
    },
    {
        id: 'portfolio-site',
        title: 'Portfolio Website',
        description: 'Responsive portfolio website with modern design and smooth animations.',
        image: 'images/projects/portfolio-site.jpg',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'GSAP'],
        price: 15000,
        status: 'live',
        category: 'portfolio',
        featured: false,
        github: 'https://github.com/garymike07/portfolio-site',
        demo: '#'
    },
    {
        id: 'blog-platform',
        title: 'Blog Platform',
        description: 'Content management system with rich text editor and SEO optimization.',
        image: 'images/projects/blog-platform.jpg',
        technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Vercel'],
        price: 20000,
        status: 'ongoing',
        category: 'blog',
        featured: false,
        github: 'https://github.com/garymike07/blog-platform',
        demo: '#'
    },
    {
        id: 'analytics-dashboard',
        title: 'Analytics Dashboard',
        description: 'Business intelligence dashboard with advanced reporting and data visualization.',
        image: 'images/projects/analytics-dashboard.jpg',
        technologies: ['Vue.js', 'D3.js', 'Express', 'MySQL'],
        price: 30000,
        status: 'progress',
        category: 'dashboard',
        featured: true,
        github: 'https://github.com/garymike07/analytics-dashboard',
        demo: '#'
    },
    {
        id: 'mental-health-app',
        title: 'Mental Health App',
        description: 'Comprehensive mental wellness platform with mood tracking, meditation features, and therapy session booking.',
        image: 'images/projects/mental-health-app.jpg',
        technologies: ['React Native', 'Node.js', 'MongoDB', 'Socket.io'],
        price: 45000,
        status: 'live',
        category: 'healthcare',
        featured: true,
        github: 'https://github.com/garymike07/mental-health-app',
        demo: '#'
    },
    {
        id: 'pharmacy-management',
        title: 'Pharmacy Management System',
        description: 'Complete pharmacy management solution with inventory tracking, prescription management, and sales analytics.',
        image: 'images/projects/pharmacy-management.jpg',
        technologies: ['React', 'Express', 'PostgreSQL', 'Chart.js'],
        price: 55000,
        status: 'live',
        category: 'healthcare',
        featured: false,
        github: 'https://github.com/garymike07/pharmacy-management',
        demo: '#'
    },
    {
        id: 'landlord-rent-management',
        title: 'Landlord Rent Management',
        description: 'Professional property management system for landlords with tenant tracking, rent collection, and maintenance requests.',
        image: 'images/projects/landlord-rent-management.jpg',
        technologies: ['Vue.js', 'Laravel', 'MySQL', 'M-Pesa API'],
        price: 40000,
        status: 'live',
        category: 'real-estate',
        featured: true,
        github: 'https://github.com/garymike07/landlord-rent-management',
        demo: '#'
    },
    {
        id: 'tourist-management',
        title: 'Tourist Management System',
        description: 'Comprehensive tourism platform with destination booking, tour packages, and travel itinerary management.',
        image: 'images/projects/tourist-management.jpg',
        technologies: ['Next.js', 'Prisma', 'PostgreSQL', 'Stripe'],
        price: 50000,
        status: 'live',
        category: 'tourism',
        featured: false,
        github: 'https://github.com/garymike07/tourist-management',
        demo: '#'
    },
    {
        id: 'chama-app',
        title: 'Chama App',
        description: 'Investment group management app with group savings, loan management, and member contribution tracking.',
        image: 'images/projects/chama-app.jpg',
        technologies: ['React Native', 'Firebase', 'M-Pesa API', 'Node.js'],
        price: 60000,
        status: 'live',
        category: 'fintech',
        featured: true,
        github: 'https://github.com/garymike07/chama-app',
        demo: '#'
    },
    {
        id: 'cv-generator',
        title: 'CV & Cover Letter Generator',
        description: 'Professional resume and cover letter builder with multiple templates and export options.',
        image: 'images/projects/cv-generator.jpg',
        technologies: ['React', 'jsPDF', 'Tailwind', 'Vercel'],
        price: 25000,
        status: 'live',
        category: 'productivity',
        featured: false,
        github: 'https://github.com/garymike07/cv-generator',
        demo: '#'
    },
    {
        id: 'blog-generator',
        title: 'Blog Generator',
        description: 'AI-powered blog content generator with SEO optimization, template selection, and publishing tools.',
        image: 'images/projects/blog-generator.jpg',
        technologies: ['Next.js', 'OpenAI API', 'MongoDB', 'Vercel'],
        price: 35000,
        status: 'live',
        category: 'content',
        featured: false,
        github: 'https://github.com/garymike07/blog-generator',
        demo: '#'
    }
];

// Category mappings for filters
const categoryMappings = {
    'all': 'All Categories',
    'saas': 'SaaS',
    'ecommerce': 'E-commerce',
    'portfolio': 'Portfolio',
    'blog': 'Blog',
    'dashboard': 'Dashboard',
    'healthcare': 'Healthcare',
    'real-estate': 'Real Estate',
    'tourism': 'Tourism',
    'fintech': 'FinTech',
    'productivity': 'Productivity',
    'content': 'Content'
};

// Status mappings
const statusMappings = {
    'live': 'Live',
    'ongoing': 'Ongoing',
    'progress': 'In Progress',
    'concept': 'Concept'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { projectsData, categoryMappings, statusMappings };
}

