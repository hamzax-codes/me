import { motion } from 'framer-motion';
import { HiExternalLink } from 'react-icons/hi';
import { SiGithub } from 'react-icons/si';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

const Projects = () => {
    const projects = [
        {
            title: 'QuizAura - AI-Powered Quiz System',
            description: 'A comprehensive multi-tenant AI-assisted secure quiz platform with real-time invigilation, AI-based subjective grading using Gemini/Groq/Perplexity, and advanced anti-cheating measures.',
            tech: ['PHP', 'MySQL', 'Python', 'AI APIs', 'Multi-Tenant'],
            image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
            github: 'https://github.com/hamzax-codes/Ai_Based_Quiz_App.git'
        },
        {
            title: 'Attendance System',
            description: 'Desktop attendance management app with teacher login, class selection, attendance marking with color-coded highlighting, session timeout, auto sign-out, and local JSON persistence for data storage.',
            tech: ['Python 3', 'Tkinter', 'JSON'],
            image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
            github: 'https://github.com/hamzax-codes/Attendane_system_app.git' // Placeholder - will be updated with actual link
        },
        {
            title: 'TODO Web App',
            description: 'A clean Flask-based TODO list application with SQLite storage, add/delete task functionality, duplicate prevention, flash messages, and responsive Bootstrap UI with automatic database creation.',
            tech: ['Python 3', 'Flask', 'SQLite', 'Bootstrap'],
            image: 'https://images.unsplash.com/photo-1598791318878-10e76d178023?w=800&q=80',
            github: 'https://github.com/hamzax-codes/Todo_App.git' // Placeholder - will be updated with actual link
        },
        {
            title: 'Terminal Chatbot',
            description: 'A command-line AI chatbot using Google Gemini 1.5 Flash with interactive terminal interface, conversation logging, graceful exit handling, and support for multiple AI providers (Gemini/DeepSeek/Grok).',
            tech: ['Python 3', 'Google Gemini API', 'AI Integration'],
            image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
            github: 'https://github.com/hamzax-codes/terminal_chatbot.git'
        },
        {
            title: 'AI UI/UX Feedback System',
            description: 'Advanced multi-agent design auditor powered by Gemini 2.5 Flash. Features 6 specialized AI agents analyzing UI/UX, design aesthetics, copywriting, conversion optimization, with glassmorphism interface and dynamic particles.',
            tech: ['Python', 'Flask', 'MySQL', 'Nano Banana', 'Multi-Agent AI'],
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
            github: 'https://github.com/hamzax-codes/UI_FEEDBACK_SYSTEM.git'
        }
    ];

    return (
        <section id="projects" className="py-12 px-4 sm:px-6 lg:px-8 bg-secondary">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-4">
                        Featured <span className="text-brand-500">Projects</span>
                    </h2>
                    <p className="text-secondary text-center mb-12 max-w-2xl mx-auto">
                        Here are some of my recent projects that showcase my skills and experience
                    </p>
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.title}
                            variants={staggerItem}
                            className="glass rounded-xl overflow-hidden hover:border-brand-500/30 transition-all group"
                        >
                            {/* Project Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={`Preview of ${project.title}`}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>

                            {/* Project Info */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-primary mb-2">
                                    {project.title}
                                </h3>
                                <p className="text-secondary mb-4">
                                    {project.description}
                                </p>

                                {/* Tech Stack */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.tech.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 text-sm bg-brand-500/10 text-brand-500 rounded-full"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Links */}
                                <div className="flex gap-4">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-secondary hover:text-brand-500 transition-colors"
                                    >
                                        <SiGithub size={20} />
                                        <span>View Code</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
