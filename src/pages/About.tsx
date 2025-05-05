// ✅ Updated About.tsx to fetch background image from API
import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';

const About = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const counterRef = useRef(null);
  const [bgImage, setBgImage] = useState<string>('');

  const cameraLogos = [
    'Canon', 'Nikon', 'Sony', 'Fujifilm', 'Leica', 'Hasselblad',
    'Phase One', 'Pentax', 'Olympus', 'Panasonic', 'Sigma', 'DJI'
  ];

  useEffect(() => {
    // Fetch portraits to get background image
    fetch('http://localhost:3001/api/images/Portraits')
      .then(res => res.json())
      .then(data => {
        interface Image {
          url: string;
        }
        const background = data.find((img: Image) => img.url.includes('bg'));
        if (background) setBgImage(`http://localhost:3001${background.url}`);
      });
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate counters
      const counters = gsap.utils.toArray('.counter');
      counters.forEach(counter => {
        const target = (counter as HTMLElement).getAttribute('data-target');
        gsap.to(counter as HTMLElement, {
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: counter as HTMLElement,
            start: 'top center+=100',
            once: true
          }
        });
      });

      // Animate logo banner
      gsap.to('.logo-banner', {
        xPercent: -100,
        repeat: -1,
        duration: 20,
        ease: 'none'
      });
    }, counterRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen" ref={counterRef}>
      <motion.div style={{ y }} className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={bgImage} alt="Photographer" className="w-full h-full object-cover opacity-80" />
        </div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-7xl md:text-8xl font-light relative z-10 text-center px-4">
          About Me
        </motion.h1>
      </motion.div>

      <div className="bg-black relative z-10 px-4 py-32">
        <div className="max-w-3xl mx-auto space-y-24">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-8">
            <h2 className="text-4xl font-light">The Journey</h2>
            <p className="text-gray-400 leading-relaxed">
              Hi, I’m Inderpreet Singh, an NYC-based photographer with a passion for capturing compelling visual stories... [shortened for brevity]
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.10 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{ target: 5, label: 'Years Experience' }, { target: 20, label: 'Projects Completed' }, { target: 120, label: 'Insta Feed' }].map((item, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }} className="bg-transparent/5 p-8 rounded-lg text-center space-y-4">
                <h3 className="text-5xl font-light">
                  <span className="counter" data-target={item.target.toString()}>0</span>+
                </h3>
                <p className="text-gray-400 uppercase tracking-widest text-sm">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Logo Banner */}
          <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] overflow-hidden py-16">
            <div className="logo-banner flex space-x-16 whitespace-nowrap">
              {[...cameraLogos, ...cameraLogos].map((logo, index) => (
                <span key={index} className="text-2xl font-light text-gray-500">{logo}</span>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-8">
            <h2 className="text-4xl font-light">Philosophy</h2>
            <p className="text-gray-400 leading-relaxed"> 
              Photography is more than just capturing a moment. It is about telling a story that lingers, evokes emotion, 
              and reveals the unseen. Every image should breathe life into its subject, preserving not just what is visible 
              but the energy, atmosphere, and depth that make each moment unique. Through a blend of technical precision and 
              artistic intuition, I strive to create images that feel immersive, authentic, and timeless. Whether it is a fleeting 
              glance, a dramatic play of light, or the quiet beauty in everyday life, my work is driven by the idea that photography 
              is not just about seeing but feeling.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
