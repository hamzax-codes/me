import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';
import {
    SiReact,
    SiJavascript,
    SiHtml5,
    SiCss3,
    SiTailwindcss,
    SiPython,
    SiMysql,
    SiSqlite,
    SiCplusplus,
    SiPhp,
    SiFastapi,
    SiNodedotjs,
    SiExpress,
    SiMongodb,
    SiPostgresql,
    SiGit,
    SiGithub,
    SiFigma,
    SiRobotframework,
    SiPytest,
    SiQt,
    SiScrapy,
    SiSelenium
} from 'react-icons/si';
import { VscCode, VscRemote, VscChecklist, VscShield } from 'react-icons/vsc';
import { BsBootstrapFill } from 'react-icons/bs';
import { TbApi, TbDatabase, TbAutomation, TbBrowser, TbDeviceDesktop, TbCloudSearch, TbCode } from 'react-icons/tb';
import { useTheme } from '../contexts/ThemeContext';

const Skills = () => {
    const { theme } = useTheme();
    const services = [
        {
            title: ['Website', 'design'],
            desc: 'I can bring your best ideas into life and make them a reality!',
            icon: TbBrowser
        },
        {
            title: ['Database', 'management'],
            desc: 'I can handle your data effectively and efficiently!',
            icon: TbDatabase
        },
        {
            title: ['Desktop', 'app creation'],
            desc: 'I build powerful and user-friendly desktop applications.',
            icon: TbDeviceDesktop
        },
        {
            title: ['Web', 'scrapping'],
            desc: 'I can extract data from any website accurately and fast.',
            icon: TbCloudSearch
        },
        {
            title: ['Web', 'automation'],
            desc: 'I automate your web tasks to save your time and money.',
            icon: TbAutomation
        },
        {
            title: ['Web', 'testing'],
            desc: 'I ensure your websites are near bug-free and perform perfectly.',
            icon: VscChecklist
        },
        {
            title: ['Full web', 'development'],
            desc: 'I create complete, scalable and robust web solutions.',
            icon: TbCode
        }
    ];

    const [isPaused, setIsPaused] = useState(false);
    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const lastTimeRef = useRef(0);
    const lastXRef = useRef(0);

    // Auto-scroll logic
    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return;

        let animationFrameId;
        const speed = 0.6; // Constant slow motion

        const animate = () => {
            if (!isPaused && !isDragging) {
                slider.scrollLeft += speed;

                // Infinite wrap-around (Forward)
                const halfWidth = slider.scrollWidth / 2;
                if (slider.scrollLeft >= halfWidth) {
                    slider.scrollLeft -= halfWidth;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, isDragging]);

    // Native non-passive wheel listener to allow preventDefault
    useEffect(() => {
        const slider = scrollRef.current;
        if (!slider) return;

        const onWheelNative = (e) => {
            // Only handle horizontal scroll, let vertical scroll work normally
            if (Math.abs(e.deltaX) > 0) {
                // Only prevent default when there's horizontal scroll
                e.preventDefault();
                const delta = e.deltaX;
                slider.scrollLeft += delta;

                const halfWidth = slider.scrollWidth / 2;
                if (slider.scrollLeft >= halfWidth) {
                    slider.scrollLeft -= halfWidth;
                } else if (slider.scrollLeft <= 0) {
                    slider.scrollLeft += halfWidth;
                }
            }
            // If deltaX is 0 (vertical scroll only), do nothing - let page scroll normally
        };

        slider.addEventListener('wheel', onWheelNative, { passive: false });
        return () => slider.removeEventListener('wheel', onWheelNative);
    }, []);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;

        const slider = scrollRef.current;
        const halfWidth = slider.scrollWidth / 2;
        if (slider.scrollLeft >= halfWidth) slider.scrollLeft -= halfWidth;
        if (slider.scrollLeft <= 0) slider.scrollLeft += halfWidth;
    };

    // Touch event handlers for mobile with momentum
    const handleTouchStart = (e) => {
        setIsDragging(true);
        setVelocity(0);
        const touch = e.touches[0];
        const x = touch.pageX - scrollRef.current.offsetLeft;
        setStartX(x);
        setScrollLeft(scrollRef.current.scrollLeft);
        lastTimeRef.current = Date.now();
        lastXRef.current = x;
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        // Apply momentum scrolling
        if (Math.abs(velocity) > 0.5) {
            let currentVelocity = velocity;
            const deceleration = 0.95;
            const momentumScroll = () => {
                if (Math.abs(currentVelocity) < 0.1) return;
                const slider = scrollRef.current;
                if (!slider) return;

                slider.scrollLeft -= currentVelocity;
                currentVelocity *= deceleration;

                // Handle infinite wrap
                const halfWidth = slider.scrollWidth / 2;
                if (slider.scrollLeft >= halfWidth) slider.scrollLeft -= halfWidth;
                if (slider.scrollLeft <= 0) slider.scrollLeft += halfWidth;

                requestAnimationFrame(momentumScroll);
            };
            requestAnimationFrame(momentumScroll);
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Prevent default touch scrolling

        const touch = e.touches[0];
        const x = touch.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;

        // Calculate velocity for momentum
        const now = Date.now();
        const timeDelta = now - lastTimeRef.current;
        if (timeDelta > 0) {
            const newVelocity = (x - lastXRef.current) / timeDelta * 20;
            setVelocity(newVelocity);
        }
        lastTimeRef.current = now;
        lastXRef.current = x;

        const slider = scrollRef.current;
        const halfWidth = slider.scrollWidth / 2;
        if (slider.scrollLeft >= halfWidth) slider.scrollLeft -= halfWidth;
        if (slider.scrollLeft <= 0) slider.scrollLeft += halfWidth;
    };

    const skillCategories = [
        {
            title: 'Frontend Development',
            skills: [
                { name: 'React', icon: SiReact, color: '#61DAFB' },
                { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
                { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
                { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
                { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
                { name: 'Bootstrap', icon: BsBootstrapFill, color: '#7952B3' },
            ]
        },
        {
            title: 'Backend Development',
            skills: [
                { name: 'Python', icon: SiPython, color: '#3776AB' },
                { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
                { name: 'SQLAlchemy', icon: TbDatabase, color: '#D71F00' },
                { name: 'SQLite3', icon: SiSqlite, color: '#003B57' },
                { name: 'C++', icon: SiCplusplus, color: '#00599C' },
                { name: 'PHP', icon: SiPhp, color: '#777BB4' },
                { name: 'Fast API', icon: SiFastapi, color: '#05998B' },
                { name: 'REST API', icon: TbApi, color: '#009688' },
            ]
        },
        {
            title: 'Tools & Technologies',
            skills: [
                { name: 'Git', icon: SiGit, color: '#F05032' },
                { name: 'GitHub', icon: SiGithub, color: '#181717' },
                { name: 'VS Code', icon: VscCode, color: '#007ACC' },
                { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
                { name: 'BrowserStack', icon: VscRemote, color: '#3EAAAF' },
                { name: 'Katalon', icon: VscChecklist, color: '#3AB54A' },
                { name: 'Burp Suite', icon: VscShield, color: '#FF6633' },
            ]
        },
        {
            title: 'Other Skills',
            skills: [
                { name: 'Automation', icon: SiRobotframework, color: '#00A2E8' },
                { name: 'PyTest', icon: SiPytest, color: '#0A9ED5' },
                { name: 'Web Scraping', icon: SiScrapy, color: '#60A5FA' },
                { name: 'BeautifulSoup', icon: VscCode, color: '#61DAFB' },
                { name: 'PyQt5', icon: SiQt, color: '#41CD52' },
                { name: 'Selenium', icon: SiSelenium, color: '#43B02A' },
            ]
        }
    ];

    return (
        <section id="skills" className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20px" }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-1">
                        Skills & Technologies
                    </h2>
                    <p className="text-secondary text-center mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                        These are the tools and technologies I use to bring ideas to life
                    </p>
                </motion.div>

                {/* Infinite Draggable & Wheel Scrollable Services Section */}
                <div
                    className="relative mb-16 py-4 group overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => {
                        setIsPaused(false);
                        handleMouseLeave();
                    }}
                    onMouseUp={() => {
                        setIsPaused(false);
                        handleMouseUp();
                    }}
                    onTouchEnd={() => {
                        setIsPaused(false);
                        handleTouchEnd();
                    }}
                >
                    <div
                        ref={scrollRef}
                        className="flex gap-8 overflow-x-hidden select-none touch-pan-x"
                        style={{ touchAction: 'pan-x' }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onTouchStart={(e) => {
                            setIsPaused(true);
                            handleTouchStart(e);
                        }}
                        onTouchMove={handleTouchMove}
                    >
                        {[...services, ...services].map((service, index) => (
                            <div
                                key={index}
                                className="glass rounded-xl p-5 flex flex-col items-center text-center group/card hover:border-brand-500/50 active:border-brand-500 active:scale-95 transition-all w-[260px] sm:w-[300px] flex-shrink-0 overflow-hidden shadow-lg pointer-events-auto"
                            >
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-secondary flex items-center justify-center mb-4 relative">
                                    <div className="absolute inset-0 rounded-full border-2 border-brand-500/20 group-hover/card:border-brand-500 transition-colors" />
                                    <service.icon className="text-2xl sm:text-3xl text-primary" />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold mb-2">
                                    <span className="text-brand-500">{service.title[0]}</span>{" "}
                                    <span className="text-primary">{service.title[1]}</span>
                                </h3>
                                <p className="text-secondary text-[10px] sm:text-xs leading-relaxed max-w-[220px]">
                                    {service.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Gradient Overlays */}
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {skillCategories.map((category, categoryIndex) => (
                        <motion.div
                            key={category.title}
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-20px" }}
                            className="glass rounded-xl p-4 sm:p-5"
                        >
                            <h3 className="text-lg font-bold text-primary mb-3 text-center">
                                {category.title}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {category.skills.map((skill) => {
                                    const iconColor = (skill.name === 'GitHub' || skill.name === 'Express') && theme === 'dark' ? '#FFFFFF' : skill.color;
                                    return (
                                        <motion.div
                                            key={skill.name}
                                            variants={staggerItem}
                                            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-brand-500/10 transition-colors group"
                                        >
                                            <skill.icon
                                                size={44}
                                                color={iconColor}
                                                className="group-hover:scale-110 transition-transform"
                                            />
                                            <span className="text-xs sm:text-sm text-secondary text-center font-medium">
                                                {skill.name}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default Skills;