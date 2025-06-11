import React, { useEffect } from 'react';
import { Calendar, Users, Award, Globe, Heart, Shield } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';



const About: React.FC = () => {
  // Variants for fade-in and slide-up animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Refs and useInView for scroll-based triggering
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const valuesRef = useRef(null);
  const statsRef = useRef(null);
  const teamRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });
  const missionInView = useInView(missionRef, { once: true, margin: '-100px' });
  const valuesInView = useInView(valuesRef, { once: true, margin: '-100px' });
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });
  const teamInView = useInView(teamRef, { once: true, margin: '-100px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);
// Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

    
  return (
    <div className="min-h-screen font-sans antialiased bg-gray-50">
      {/* Hero Section */}

            <motion.section
              className="relative min-h-[60vh] text-white bg-fixed bg-center bg-cover flex items-center justify-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                backgroundAttachment: 'fixed'
              }}
            >
              {/* Overlay for better readability */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
              {/* Content */}
              <motion.div 
                className="relative max-w-4xl px-4 text-center sm:px-6 lg:px-8"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                <motion.h1 
                  className="mb-6 font-serif text-3xl font-extrabold sm:text-4xl md:text-5xl"
                  variants={itemVariants}
                >
                   About Planora
                </motion.h1>
                <motion.p 
                  className="font-sans text-base font-light text-blue-100 sm:text-lg md:text-xl"
                  variants={itemVariants}
                >
            We're passionate about connecting people through meaningful events. Our platform makes discovering, organizing, and attending events seamless, secure, and delightful.
                </motion.p>
              </motion.div>
            </motion.section>

            
      

      {/* Mission Section */}
      <section ref={missionRef} className="py-24 bg-white">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div
            className="mb-16 text-center"
            variants={fadeInUp}
            initial="hidden"
            animate={missionInView ? 'visible' : 'hidden'}
          >
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900">Our Mission</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              To create a world where amazing events are accessible to everyone, and organizing them is effortless.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Calendar className="text-blue-500 w-7 h-7" />,
                title: 'Easy Event Discovery',
                description: 'Find events that match your interests with our intelligent search and recommendation system.',
              },
              {
                icon: <Users className="text-green-500 w-7 h-7" />,
                title: 'Community Building',
                description: 'Connect with like-minded people and build lasting relationships through shared experiences.',
              },
              {
                icon: <Award className="text-purple-500 w-7 h-7" />,
                title: 'Quality Assurance',
                description: 'All events are verified and curated to ensure high-quality experiences for all participants.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-6 text-center transition-shadow shadow-sm bg-gray-50 rounded-2xl hover:shadow-md"
                variants={fadeInUp}
                initial="hidden"
                animate={missionInView ? 'visible' : 'hidden'}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex items-center justify-center mx-auto mb-4 bg-white rounded-full shadow-sm w-14 h-14">
                  {item.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-24 bg-gray-100">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div
            className="mb-16 text-center"
            variants={fadeInUp}
            initial="hidden"
            animate={valuesInView ? 'visible' : 'hidden'}
          >
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: <Globe className="w-10 h-10 mb-4 text-blue-500" />,
                title: 'Inclusivity',
                description: 'We believe events should be accessible to everyone, regardless of background, location, or circumstances.',
              },
              {
                icon: <Heart className="w-10 h-10 mb-4 text-red-500" />,
                title: 'Community First',
                description: 'Our platform is built to foster genuine connections and strengthen communities through shared experiences.',
              },
              {
                icon: <Shield className="w-10 h-10 mb-4 text-green-500" />,
                title: 'Trust & Safety',
                description: 'We prioritize the security and privacy of our users, ensuring a safe environment for all interactions.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-8 transition-shadow shadow-sm bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-md"
                variants={fadeInUp}
                initial="hidden"
                animate={valuesInView ? 'visible' : 'hidden'}
                transition={{ delay: index * 0.2 }}
              >
                {item.icon}
                <h3 className="mb-3 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-24 bg-white">
        <div className="max-w-6xl px-6 mx-auto">
          <motion.div
            className="mb-16 text-center"
            variants={fadeInUp}
            initial="hidden"
            animate={statsInView ? 'visible' : 'hidden'}
          >
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900">Planora by the Numbers</h2>
            <p className="text-lg text-gray-600">Our growing community speaks volumes</p>
          </motion.div>

          <div className="grid gap-8 text-center md:grid-cols-4">
            {[
              { value: '10,000+', label: 'Events Hosted', color: 'text-blue-500' },
              { value: '50,000+', label: 'Happy Users', color: 'text-green-500' },
              { value: '500+', label: 'Event Organizers', color: 'text-purple-500' },
              { value: '25', label: 'Cities Covered', color: 'text-orange-500' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                initial="hidden"
                animate={statsInView ? 'visible' : 'hidden'}
                transition={{ delay: index * 0.2 }}
              >
                <div className={`mb-2 text-3xl font-semibold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="py-24 bg-gray-100">
  <div className="max-w-6xl px-6 mx-auto">
    <motion.div
      className="mb-16 text-center"
      variants={fadeInUp}
      initial="hidden"
      animate={teamInView ? 'visible' : 'hidden'}
    >
      <h2 className="mb-4 text-4xl font-semibold tracking-tight text-gray-900">Meet Our Team</h2>
      <p className="text-lg text-gray-600">The passionate people behind Planora</p>
    </motion.div>

    <div className="grid gap-8 md:grid-cols-3">
      {[
        {
          icon: <Users className="w-12 h-12 text-blue-500" />,
          name: 'Nimali Perera',
          role: 'CEO & Founder',
          description: 'Passionate about connecting communities through meaningful events and experiences.',
          roleColor: 'text-blue-500',
        },
        {
          icon: <Users className="w-12 h-12 text-green-500" />,
          name: 'Kusal Fernando',
          role: 'CTO',
          description: 'Technology enthusiast focused on building scalable, user-friendly platforms.',
          roleColor: 'text-green-500',
        },
        {
          icon: <Users className="w-12 h-12 text-purple-500" />,
          name: 'Amaya Silva',
          role: 'Head of Community',
          description: 'Dedicated to ensuring every user has an exceptional experience on our platform.',
          roleColor: 'text-purple-500',
        },
      ].map((member, index) => (
        <motion.div
          key={index}
          className="text-center"
          variants={fadeInUp}
          initial="hidden"
          animate={teamInView ? 'visible' : 'hidden'}
          transition={{ delay: index * 0.2 }}
        >
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 bg-white rounded-full shadow-sm">
            {member.icon}
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{member.name}</h3>
          <p className={`mb-2 font-medium ${member.roleColor}`}>{member.role}</p>
          <p className="text-sm text-gray-500">{member.description}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-24 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-4xl px-6 mx-auto text-center">
          <motion.h2
            className="mb-4 text-4xl font-semibold tracking-tight text-white"
            variants={fadeInUp}
            initial="hidden"
            animate={ctaInView ? 'visible' : 'hidden'}
          >
            Join Our Mission
          </motion.h2>
          <motion.p
            className="mb-8 text-lg text-gray-200"
            variants={fadeInUp}
            initial="hidden"
            animate={ctaInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.2 }}
          >
            Be part of a community that's revolutionizing how people discover and attend events.
          </motion.p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <motion.a
              href="/register"
              className="px-8 py-3 font-medium text-gray-900 transition-colors bg-white rounded-full hover:bg-gray-200"
              variants={scaleIn}
              initial="hidden"
              animate={ctaInView ? 'visible' : 'hidden'}
              transition={{ delay: 0.4 }}
            >
              Get Started Today
            </motion.a>
            <motion.a
              href="/contact"
              className="px-8 py-3 font-medium text-white transition-colors border-2 border-white rounded-full hover:bg-white hover:text-gray-900"
              variants={scaleIn}
              initial="hidden"
              animate={ctaInView ? 'visible' : 'hidden'}
              transition={{ delay: 0.6 }}
            >
              Contact Us
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;