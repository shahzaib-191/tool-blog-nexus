
import MainLayout from '@/components/Layout/MainLayout';

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">About ToolNexus</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 mb-10">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            At ToolNexus, we're committed to providing reliable, easy-to-use web tools that simplify your digital workflow.
            Our platform brings together essential utilities for document conversion, image editing, SEO optimization, and more,
            all in one convenient location.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
          <p className="text-gray-700 mb-6">
            Our growing collection of tools spans multiple categories including productivity, SEO, image processing, 
            and web development. Each tool is designed with simplicity and efficiency in mind, 
            helping you accomplish tasks quickly without complicated software installations.
          </p>
          
          <h2 className="text-2xl font-bold mb-4">Why Choose ToolNexus</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-tool-blue">Free to Use</h3>
              <p className="text-gray-700">Most of our tools are completely free to use without any registration required.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-tool-blue">Privacy Focused</h3>
              <p className="text-gray-700">Your files and data are processed securely and never stored on our servers without permission.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 text-tool-blue">Continuously Improving</h3>
              <p className="text-gray-700">We regularly add new tools and improve existing ones based on user feedback.</p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <p className="text-gray-700">
            ToolNexus is developed by a dedicated team of web developers, designers, and digital enthusiasts
            who are passionate about creating useful web applications that solve everyday problems.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
