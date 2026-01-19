import { SiGithub, SiLinkedin, SiX, SiInstagram } from 'react-icons/si';
import { HiHeart } from 'react-icons/hi';
import logo from '../assets/image-removebg-preview.png';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            icon: SiGithub,
            href: 'https://github.com/hamzax-codes',
            label: 'GitHub',
            hoverColor: 'hover:text-white hover:bg-gray-800'
        },
        {
            icon: SiLinkedin,
            href: 'https://www.linkedin.com/in/hamza-ali-b5792939b',
            label: 'LinkedIn',
            hoverColor: 'hover:text-white hover:bg-[#0077B5]'
        },
        {
            icon: SiX,
            href: 'https://x.com/i_hamza_06',
            label: 'X',
            hoverColor: 'hover:text-white hover:bg-black'
        },
        {
            icon: SiInstagram,
            href: 'https://www.instagram.com/i.hamza.ali_',
            label: 'Instagram',
            hoverColor: 'hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500'
        }
    ];

    return (
        <footer className="relative bg-gradient-to-b from-background via-surface to-background/95 py-4 px-4 sm:px-6 lg:px-8 border-t border-card-border/30">
            <div className="max-w-6xl mx-auto">
                {/* Main Content */}
                <div className="text-center mb-2">
                    {/* Logo/Name - Same as Navbar */}
                    <a href="#home" className="inline-flex items-center gap-0 group mb-0">
                        <img
                            src={logo}
                            alt="Hamza Portfolio Logo"
                            width="64"
                            height="64"
                            className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
                        />
                        <span className="text-2xl font-bold text-primary -ml-4">
                            amza
                        </span>
                    </a>

                    {/* Tagline */}
                    <p className="text-secondary/80 text-base sm:text-lg mb-2 font-medium">
                        Building digital experiences with code.
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center items-center gap-4 mb-3">
                        {socialLinks.map((social) => (
                            <a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`group relative p-3.5 rounded-xl bg-surface/50 backdrop-blur-sm border border-card-border/40 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-brand-500/20 ${social.hoverColor}`}
                                aria-label={social.label}
                            >
                                <social.icon size={22} className="transition-transform duration-300 group-hover:scale-110" />
                            </a>
                        ))}
                    </div>

                </div>

                {/* Bottom Copyright */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 text-secondary/70 text-sm sm:text-base pt-3">
                    <div className="flex items-center gap-2">
                        <span>© {currentYear}</span>
                        <span className="font-semibold text-primary">Hamza</span>
                    </div>
                    <span className="hidden sm:inline text-secondary/40">•</span>
                    All rights reserved
                    <span className="hidden sm:inline text-secondary/40">•</span>
                    <div className="flex items-center gap-2">
                        <span>Built with</span>
                        <HiHeart className="text-red-500 animate-pulse" size={18} />
                        <span>& Code</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
