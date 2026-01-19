import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiLocationMarker } from 'react-icons/hi';
import { SiWhatsapp } from 'react-icons/si';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            // EmailJS Configuration - With fallbacks for production
            const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_qqf2tjs';
            const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_a40wu2i';
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'x5vHsZwCFWbsgcsCi';

            // Send email to you
            const now = new Date();
            const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            const templateParams = {
                title: 'New Portfolio Contact Message',
                name: formData.name,
                time: currentTime,
                message: formData.message,
                email: formData.email,
                reply_to: formData.email  // This sets Reply-To header
            };

            await emailjs.send(serviceID, templateID, templateParams, publicKey);

            // Try to send auto-reply (optional - won't break if template doesn't exist)
            try {
                const autoReplyParams = {
                    name: formData.name,
                    email: formData.email
                };
                await emailjs.send(serviceID, import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID || 'template_dx1gc0i', autoReplyParams, publicKey);
            } catch (autoReplyError) {
                console.log('Auto-reply not sent (template may not exist yet):', autoReplyError);
                // Continue - main email was sent successfully
            }

            setStatus({
                type: 'success',
                message: 'Thank you! Your message has been sent successfully. Check your email for confirmation!'
            });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus({
                type: 'error',
                message: 'Oops! Something went wrong. Please try again or email me directly.'
            });
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: HiMail,
            label: 'Email',
            value: 'hamzaxali70@gmail.com',
            href: 'https://mail.google.com/mail/?view=cm&to=hamzaxali70@gmail.com',
            color: 'text-red-500',
            bgColor: 'bg-red-500/10'
        },
        {
            icon: SiWhatsapp,
            label: 'WhatsApp',
            value: '+92 310 9950325',
            href: 'https://wa.me/923109950325',
            color: 'text-green-500',
            bgColor: 'bg-green-500/10'
        },
        {
            icon: HiLocationMarker,
            label: 'Location',
            value: 'Peshawar, Pakistan',
            href: 'https://www.google.com/maps/search/?api=1&query=Peshawar,Pakistan',
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10'
        }
    ];

    return (
        <section id="contact" className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary text-center mb-4">
                        Get In Touch
                    </h2>
                    <p className="text-secondary text-center mb-12 max-w-2xl mx-auto">
                        Have a question or want to work together? Feel free to reach out!
                    </p>
                </motion.div>

                {/* Contact Info Cards */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                >
                    {contactInfo.map((info) => (
                        <motion.div
                            key={info.label}
                            variants={staggerItem}
                            className="glass rounded-lg p-4 flex items-start gap-3 hover:border-brand-500/30 transition-all"
                        >
                            <div className={`p-2 ${info.bgColor} rounded-lg`}>
                                <info.icon className={info.color} size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-secondary mb-1">{info.label}</p>
                                {info.href ? (
                                    <a
                                        href={info.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary font-medium hover:text-brand-500 transition-colors"
                                    >
                                        {info.value}
                                    </a>
                                ) : (
                                    <p className="text-primary font-medium">{info.value}</p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Centered Contact Form */}
                <div className="max-w-2xl mx-auto">
                    <motion.form
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        onSubmit={handleSubmit}
                        className="glass rounded-xl p-5 space-y-3"
                    >
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-surface border card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-primary transition-all"
                                placeholder="Your name"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-surface border card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-primary transition-all"
                                placeholder="your.email@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-secondary mb-2">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="w-full px-4 py-3 bg-surface border card-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-primary transition-all resize-none"
                                placeholder="Your message..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full px-6 py-3 rounded-lg font-medium transition-all shadow-lg ${loading
                                ? 'bg-brand-400 cursor-not-allowed'
                                : 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/30'
                                } text-white`}
                        >
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>

                        {/* Status Message */}
                        {status.message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mt-4 p-4 rounded-lg text-center font-medium ${status.type === 'success'
                                    ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                                    : 'bg-red-500/10 text-red-500 border border-red-500/30'
                                    }`}
                            >
                                {status.message}
                            </motion.div>
                        )}
                    </motion.form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
