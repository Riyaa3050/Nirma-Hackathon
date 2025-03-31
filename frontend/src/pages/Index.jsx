import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, ArrowRight, LineChart, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-white/80 backdrop-blur-lg dark:bg-gray-900/80">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              SecureFlow Insight
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline" className="bg-gradient-to-br bg-indigo-50">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="container py-20 md:py-32 px-4 md:px-8">
        <motion.div 
          className="grid gap-8 md:grid-cols-2 md:gap-12"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex flex-col justify-center space-y-6">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Secure Financial Transaction Monitoring
            </h1>
            <p className="text-gray-600 dark:text-gray-300 md:text-xl">
              Advanced fraud detection and transaction security for businesses and individuals.
              Monitor, analyze, and secure your financial activities with real-time insights.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/demo">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 gap-2">
                  Try Demo <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative h-full w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-3xl" />
              <div className="relative rounded-xl border border-indigo-100 dark:border-indigo-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-8 shadow-2xl">
                <Shield className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Secure Transactions</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2 mb-6">
                  Our platform helps protect and monitor all your financial activities
                </p>
                <div className="grid gap-4">
                  {[
                    { icon: AlertTriangle, color: "text-amber-500", text: "Real-time risk analysis" },
                    { icon: Clock, color: "text-indigo-600", text: "Transaction history monitoring" },
                    { icon: LineChart, color: "text-emerald-500", text: "Fraud pattern detection" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors duration-200"
                      whileHover={{ x: 5 }}
                    >
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <span className="font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features section */}
      <section className="container py-20 px-4 md:px-8">
        <motion.h2 
          className="text-3xl font-bold tracking-tight text-center mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Comprehensive Financial Security
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Shield,
              title: "Secure Transactions",
              description: "End-to-end encryption and advanced security protocols for all financial transfers.",
              color: "indigo"
            },
            {
              icon: AlertTriangle,
              title: "Risk Analysis",
              description: "Real-time risk detection using AI and machine learning algorithms.",
              color: "amber"
            },
            {
              icon: Clock,
              title: "Transaction History",
              description: "Complete audit trail and history of all your financial activities.",
              color: "emerald"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="rounded-xl border border-indigo-100 dark:border-indigo-800 bg-white/80 dark:bg-gray-800/80 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className={`mb-4 rounded-full bg-${feature.color}-500/10 p-3 w-fit`}>
                <feature.icon className={`h-6 w-6 text-${feature.color}-500`} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About us section */}
      <section className="container py-20 px-4 md:px-8">
        <motion.div 
          className="mx-auto max-w-3xl text-center rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-8 border border-indigo-100 dark:border-indigo-800 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            About Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            SecureFlow Insight is a leading financial security platform dedicated to providing
            state-of-the-art transaction monitoring and fraud detection services. Founded in 2023,
            we've helped thousands of users secure their financial activities.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Our team of security experts and data scientists work tirelessly to stay ahead of
            emerging threats and provide the most reliable security solutions for businesses and
            individuals alike.
          </p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-indigo-100 dark:border-indigo-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container py-10 px-4 md:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                SecureFlow Insight
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © 2023 SecureFlow Insight. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Terms", "Privacy", "Contact"].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;