import { Navbar } from "@/components/Navbar";
import { QueueDashboard } from "@/components/QueueDashboard";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-mainText">
      <Navbar />
      <main className="flex-1 flex flex-col items-center">
        <QueueDashboard />
      </main>
      <Footer />
    </div>
  );
}
