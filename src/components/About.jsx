import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '../utils/animations';
import heroPhoto from '../assets/about_section_image_ready.png';

const About = () => {
    return (
        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                >
                    {/* Photo */}
                    <motion.div variants={fadeInUp} className="flex justify-center">
                        <div className="relative w-full max-w-[350px]">
                            {/* Decorative Background Shadows */}
                            <div className="absolute inset-0 bg-brand-500/10 rounded-[2rem] rotate-6 shadow-lg scale-100 translate-x-2 translate-y-2"></div>
                            <div className="absolute inset-0 bg-brand-500/10 rounded-[2rem] -rotate-6 shadow-lg scale-100 -translate-x-2 -translate-y-2"></div>
                            <img
                                src={heroPhoto}
                                alt="Hamza Ali - Software Engineer"
                                loading="lazy"
                                decoding="async"
                                className="relative z-10 w-full h-[390px] sm:h-[480px] object-contain sm:object-cover object-center rounded-[2rem] shadow-2xl border-2 border-brand-500/20"
                            />
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div variants={fadeInUp}>
                        <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                            About <span className="text-brand-500">Me</span>
                        </h2>
                        <div className="space-y-4 text-secondary text-md">
                            <p>
                                I am a Software Engineer with experience in Python-based development, web technologies, and software testing. I focus on building reliable, maintainable applications and automating workflows that improve efficiency and reduce manual effort. I enjoy writing clean, well-structured code and paying attention to performance, usability, and long-term maintainability.
                            </p>
                            <p>
                                My current skill set includes Python development, web development, web scraping, and test automation. I have hands-on experience working with tools and frameworks such as PyTest, JUnit, Katalon, and BrowserStack, along with handling structured data formats like JSON. I am comfortable designing and testing web solutions, ensuring functionality, reliability, and cross-browser compatibility.
                            </p>
                            <p>
                                I am actively expanding my expertise into areas such as Android application development, advanced automation, and intelligent systems. I have a growing interest in artificial intelligence and am currently exploring AI concepts, agent-based systems, and their practical applications in real-world software solutions, with a focus on continuous learning and experimentation.
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
