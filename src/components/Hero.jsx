import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiDownload } from 'react-icons/hi';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { useTheme } from '../contexts/ThemeContext';


const Hero = () => {
    const { theme } = useTheme();
    const [displayText, setDisplayText] = useState('');
    const [roleIndex, setRoleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [charIndex, setCharIndex] = useState(0);

    const roles = [
        'Software Engineer',
        'Python Engineer',
        'Web Scrapper',
        'Web Developer',
        'Android App Developer'
    ];

    useEffect(() => {
        const typingSpeed = isDeleting ? 50 : 100;
        const currentRole = roles[roleIndex];

        const timer = setTimeout(() => {
            if (!isDeleting && charIndex < currentRole.length) {
                // Typing
                setDisplayText(prev => prev + currentRole[charIndex]);
                setCharIndex(prev => prev + 1);
            } else if (isDeleting && charIndex > 0) {
                // Deleting
                setDisplayText(prev => prev.slice(0, -1));
                setCharIndex(prev => prev - 1);
            } else if (!isDeleting && charIndex === currentRole.length) {
                // Pause at the end of typing
                setTimeout(() => setIsDeleting(true), 1500);
            } else if (isDeleting && charIndex === 0) {
                // Move to next role
                setIsDeleting(false);
                setRoleIndex(prev => (prev + 1) % roles.length);
            }
        }, typingSpeed);

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, roleIndex]);

    const scrollToSection = (sectionId) => {
        const element = document.querySelector(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const isLight = theme !== 'dark';

    return (
        <section id="home" className="h-screen w-full relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full blur-[140px] pointer-events-none transition-colors duration-500 ${isLight ? 'bg-brand-500/30' : 'bg-brand-500/15'
                }`}></div>

            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="w-full h-full relative z-10"
            >
                <motion.div
                    variants={fadeInUp}
                    className="glass w-full h-full flex items-center justify-center p-8 sm:p-12 md:p-16 relative overflow-hidden group border-none"
                >
                    {/* Inner Center Light Source */}
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none transition-opacity duration-500"
                        style={{
                            background: `radial-gradient(circle_at_center, rgba(35, 155, 143, ${isLight ? '0.4' : '0.2'}) 0%, transparent 70%)`
                        }}
                    ></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <motion.h1
                            variants={fadeInUp}
                            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-primary mb-6"
                        >
                            Hi, I'm{' '}
                            <span className="text-brand-500">Hamza</span>
                        </motion.h1>

                        <motion.h2
                            variants={fadeInUp}
                            className="text-2xl sm:text-3xl mb-8 h-10 flex items-center justify-center font-mono"
                        >
                            <span className="text-primary font-medium">{displayText}</span>
                            <span className="w-[2px] h-8 bg-brand-500 ml-1 animate-pulse"></span>
                        </motion.h2>

                        <motion.p
                            variants={fadeInUp}
                            className="text-lg sm:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed"
                        >
                            Passionate about building beautiful, functional web applications.
                            I transform ideas into clean code and create seamless user experiences.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={fadeInUp}
                            className="flex flex-wrap gap-4 justify-center"
                        >
                            <button
                                onClick={() => window.open('/MUHAMMAD HAMZA.pdf', '_blank')}
                                className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-brand-500/30"
                            >
                                Download Resume
                                <HiDownload />
                            </button>
                            <button
                                onClick={() => scrollToSection('#contact')}
                                className="px-8 py-4 glass hover:bg-brand-500/10 text-primary rounded-lg font-medium transition-all hover:scale-105"
                            >
                                Get in Touch
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
