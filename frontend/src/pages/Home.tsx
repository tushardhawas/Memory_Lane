import { Button } from "@/components/ui/button"; 
import logo from "../assets/svgviewer-png-output.png";

const Home = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="bg-teal-600 p-4 fixed w-full top-0 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-32 h-auto mr-4" /> {/* Adjusted logo size */}
          </div>
          <div className="hidden md:flex space-x-6">
            <Button variant="link">Home</Button>
            <Button variant="link">About</Button>
            <Button variant="link">Features</Button>
            <Button variant="link">Contact</Button>
          </div>
          <Button variant="ghost">Logout</Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 bg-teal-100 p-8">
        <h1 className="text-4xl text-center text-teal-700">Welcome to Memory Lane</h1>
        <p className="text-center text-teal-600 mt-4">Start creating your digital scrapbook today!</p>
      </div>

      {/* Mobile Menu (optional) */}
      <div className="md:hidden flex justify-center mt-4">
        <Button variant="outline">Menu</Button>
      </div>
    </>
  );
};

export default Home;
