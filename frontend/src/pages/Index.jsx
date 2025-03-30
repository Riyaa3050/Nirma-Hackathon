import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, ArrowRight, LineChart, AlertTriangle, Clock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted px-20 p-10">
      {/* Header/Navigation */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SecureFlow Insight</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="container py-20 md:py-24">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none">
              Secure Financial Transaction Monitoring
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Advanced fraud detection and transaction security for businesses and individuals.
              Monitor, analyze, and secure your financial activities with real-time insights.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link to="/demo">
                <Button size="lg" className="gap-2">
                  Try Demo <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-full w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-3xl" />
              <div className="relative rounded-lg border bg-card p-6 shadow-lg">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-bold">Secure Transactions</h3>
                <p className="text-muted-foreground mt-2 mb-4">
                  Our platform helps protect and monitor all your financial activities
                </p>
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span>Real-time risk analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Transaction history monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-green-500" />
                    <span>Fraud pattern detection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="container py-16 md:py-20">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          Comprehensive Financial Security
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-md transition-all hover:shadow-lg">
            <div className="mb-4 rounded-full bg-primary/10 p-3 w-fit">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Transactions</h3>
            <p className="text-muted-foreground">
              End-to-end encryption and advanced security protocols for all financial transfers.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-md transition-all hover:shadow-lg">
            <div className="mb-4 rounded-full bg-amber-500/10 p-3 w-fit">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Risk Analysis</h3>
            <p className="text-muted-foreground">
              Real-time risk detection using AI and machine learning algorithms.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-md transition-all hover:shadow-lg">
            <div className="mb-4 rounded-full bg-green-500/10 p-3 w-fit">
              <Clock className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Transaction History</h3>
            <p className="text-muted-foreground">
              Complete audit trail and history of all your financial activities.
            </p>
          </div>
        </div>
      </section>

      {/* About us section */}
      <section className="container py-16 md:py-20 bg-muted/50 rounded-lg">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">About Us</h2>
          <p className="text-muted-foreground mb-8">
            SecureFlow Insight is a leading financial security platform dedicated to providing
            state-of-the-art transaction monitoring and fraud detection services. Founded in 2023,
            we've helped thousands of users secure their financial activities.
          </p>
          <p className="text-muted-foreground">
            Our team of security experts and data scientists work tirelessly to stay ahead of
            emerging threats and provide the most reliable security solutions for businesses and
            individuals alike.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container py-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">SecureFlow Insight</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2023 SecureFlow Insight. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;