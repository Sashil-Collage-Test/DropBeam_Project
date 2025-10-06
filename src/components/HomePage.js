import React, { useState } from 'react';
import { Upload, Shield, Zap, Globe, BarChart3, Lock, Clock, QrCode, Link2, Database, Sparkles, CheckCircle, ArrowRight, Users, Download, Eye, TrendingUp, Cpu, Cloud, FileText, Video, Image, Folder, Star } from 'lucide-react';

const DropBeamHomepage = ({ onNavigate }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const stats = [
    { label: 'Files Shared', value: '2.4M+', icon: Upload, color: 'blue' },
    { label: 'Active Users', value: '150K+', icon: Users, color: 'green' },
    { label: 'Total Downloads', value: '8.9M+', icon: Download, color: 'purple' },
    { label: 'Storage Used', value: '500TB+', icon: Database, color: 'orange' }
  ];

  const features = [
    {
      icon: Upload,
      title: 'Smart Chunked Upload',
      description: 'Upload files up to 2GB with intelligent chunking and auto-resume capability. Never lose progress on interrupted uploads.',
      color: 'blue',
      badge: 'Core Feature'
    },
    {
      icon: Shield,
      title: 'Adaptive Security',
      description: 'Set location, time, and device-based access controls. PIN protection and suspicious activity alerts keep your files secure.',
      color: 'green',
      badge: 'Security'
    },
    {
      icon: Link2,
      title: 'Short Link Generation',
      description: 'Get shareable short links instantly. Track views, downloads, and access patterns with detailed analytics.',
      color: 'purple',
      badge: 'Popular'
    },
    {
      icon: QrCode,
      title: 'QR Code Sharing',
      description: 'Generate QR codes for mobile-friendly sharing. Perfect for presentations, events, and quick file transfers.',
      color: 'pink',
      badge: 'Mobile'
    },
    {
      icon: BarChart3,
      title: 'Real-time Analytics',
      description: 'Track file access with heatmaps, geographic insights, and detailed access logs. Know who accessed your files and when.',
      color: 'orange',
      badge: 'Analytics'
    },
    {
      icon: Cpu,
      title: 'AI-Powered Intelligence',
      description: 'Auto-compress videos, extract thumbnails, generate summaries, and enable content-based search with AI.',
      color: 'indigo',
      badge: 'AI'
    }
  ];

  const platformFeatures = [
    {
      icon: Clock,
      title: 'Auto-Expiry',
      description: 'Files automatically expire after set duration',
      stat: '24h default'
    },
    {
      icon: Lock,
      title: 'Self-Destruct',
      description: 'Lock files after conditions are met',
      stat: '100% secure'
    },
    {
      icon: Globe,
      title: 'CDN Delivery',
      description: 'Global content delivery for fast access',
      stat: '< 100ms'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized upload and download speeds',
      stat: '10x faster'
    }
  ];

  const useCases = [
    {
      title: 'Education',
      description: 'Share course materials, assignments, and lecture recordings securely with students.',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Creative Work',
      description: 'Send large design files, videos, and media assets to clients and collaborators.',
      icon: Video,
      color: 'purple'
    },
    {
      title: 'Business',
      description: 'Distribute reports, presentations, and documents with advanced access controls.',
      icon: Folder,
      color: 'green'
    },
    {
      title: 'Personal',
      description: 'Share photos, videos, and memories with family and friends easily.',
      icon: Image,
      color: 'pink'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Designer',
      content: 'DropBeam made sharing large design files with clients incredibly easy. The analytics feature is a game-changer!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'University Professor',
      content: 'Perfect for distributing course materials. The auto-expiry feature ensures content stays relevant.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      content: 'The QR code feature is brilliant for events. We use it to share promotional materials instantly.',
      rating: 5
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-600' },
      green: { bg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-600' },
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', icon: 'text-purple-600' },
      orange: { bg: 'bg-orange-100', text: 'text-orange-600', icon: 'text-orange-600' },
      pink: { bg: 'bg-pink-100', text: 'text-pink-600', icon: 'text-pink-600' },
      indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', icon: 'text-indigo-600' }
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => onNavigate && onNavigate('home')}
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                DropBeam
              </span>
            </button>
            <div className="hidden md:flex gap-6 items-center">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#analytics" className="text-gray-600 hover:text-blue-600 transition-colors">Analytics</a>
              <a href="#use-cases" className="text-gray-600 hover:text-blue-600 transition-colors">Use Cases</a>
              <button 
                onClick={() => onNavigate('login')}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Sign In
              </button>
              <button 
                onClick={() => onNavigate('login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered File Sharing</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Share Files Securely with 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Upload, share, and track your files with advanced security, AI-powered features, and real-time analytics. Like Google Drive meets WeTransfer with AI.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('dashboard')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg flex items-center gap-2"
              >
                Start Sharing Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap gap-8 items-center">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">No account required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Up to 2GB per file</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">End-to-end secure</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                  <Upload className="w-8 h-8 text-blue-600" />
                  <div className="flex-1">
                    <div className="h-2 bg-blue-200 rounded-full w-3/4 mb-2"></div>
                    <div className="h-2 bg-blue-100 rounded-full w-1/2"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="flex-1">
                    <div className="h-2 bg-green-200 rounded-full w-2/3 mb-2"></div>
                    <div className="h-2 bg-green-100 rounded-full w-1/3"></div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-lg">
                  <Link2 className="w-8 h-8 text-purple-600" />
                  <div className="flex-1">
                    <div className="h-2 bg-purple-200 rounded-full w-4/5 mb-2"></div>
                    <div className="h-2 bg-purple-100 rounded-full w-2/5"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold transform rotate-12">
              NEW ✨
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const colorClass = getColorClasses(stat.color);
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${colorClass.bg} rounded-full mb-4`}>
                    <Icon className={`w-8 h-8 ${colorClass.icon}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to share files securely and intelligently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClass = getColorClasses(feature.color);
            return (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-200"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${colorClass.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${colorClass.icon}`} />
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 ${colorClass.bg} ${colorClass.text} rounded-full`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="bg-gradient-to-br from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl font-bold mb-6">Real-Time Analytics Dashboard</h2>
              <p className="text-xl text-blue-100 mb-8">
                Track every aspect of your shared files with detailed analytics, access logs, and geographic insights.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5" />
                  </div>
                  <span>Track views and downloads in real-time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span>Geographic access heatmaps</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span>Engagement trends and insights</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Analytics Overview</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Total Views</span>
                    <span className="font-bold text-blue-600">2,847</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Downloads</span>
                    <span className="font-bold text-green-600">1,456</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Unique Visitors</span>
                    <span className="font-bold text-purple-600">892</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-purple-600 h-3 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platformFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <Icon className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                <div className="text-2xl font-bold text-blue-600">{feature.stat}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Perfect For Every Use Case</h2>
            <p className="text-xl text-gray-600">From education to enterprise, DropBeam adapts to your needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              const colorClass = getColorClasses(useCase.color);
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className={`w-14 h-14 ${colorClass.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${colorClass.icon}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Loved by Users Worldwide</h2>
          <p className="text-xl text-gray-600">See what people are saying about DropBeam</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
              <div>
                <div className="font-bold text-gray-900">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Sharing?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users who trust DropBeam for secure, intelligent file sharing
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all font-bold text-lg"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">DropBeam</span>
              </div>
              <p className="text-sm">AI-powered file sharing for modern teams</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Product</h4>
              <div className="space-y-2 text-sm">
                <div>Features</div>
                <div>Pricing</div>
                <div>Security</div>
                <div>API</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Company</h4>
              <div className="space-y-2 text-sm">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
                <div>Contact</div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3">Legal</h4>
              <div className="space-y-2 text-sm">
                <div>Privacy</div>
                <div>Terms</div>
                <div>Cookie Policy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>© 2024 DropBeam. Created by Shashikant - College Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DropBeamHomepage;