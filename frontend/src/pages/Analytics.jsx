
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskDistributionChart } from "@/components/RiskDistributionChart";
import { FraudTrendChart } from "@/components/FraudTrendChart";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

// Sample data for category analysis
const categoryData = [
  { name: "Shopping", fraudCount: 15, totalCount: 120 },
  { name: "Travel", fraudCount: 23, totalCount: 78 },
  { name: "Financial", fraudCount: 30, totalCount: 85 },
  { name: "Food & Drink", fraudCount: 5, totalCount: 200 },
  { name: "Entertainment", fraudCount: 8, totalCount: 150 },
  { name: "Other", fraudCount: 12, totalCount: 95 },
];

// Sample data for time of day analysis
const timeOfDayData = [
  { name: "00:00-04:00", fraudCount: 25, totalCount: 60 },
  { name: "04:00-08:00", fraudCount: 10, totalCount: 40 },
  { name: "08:00-12:00", fraudCount: 15, totalCount: 120 },
  { name: "12:00-16:00", fraudCount: 20, totalCount: 150 },
  { name: "16:00-20:00", fraudCount: 30, totalCount: 180 },
  { name: "20:00-24:00", fraudCount: 35, totalCount: 100 },
];

// Calculate fraud rate per category
const categoryFraudRate = categoryData.map((item) => ({
  name: item.name,
  rate: ((item.fraudCount / item.totalCount) * 100).toFixed(1),
}));

// Calculate fraud rate per time of day
const timeOfDayFraudRate = timeOfDayData.map((item) => ({
  name: item.name,
  rate: ((item.fraudCount / item.totalCount) * 100).toFixed(1),
}));

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7days");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed fraud detection analytics and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Range</SelectLabel>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fraud Trend Analysis</CardTitle>
            <CardDescription>
              Transaction and fraud trends over time
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <FraudTrendChart />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Distribution</CardTitle>
            <CardDescription>
              Transaction risk level overview
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-80">
              <RiskDistributionChart />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fraud Analysis</CardTitle>
          <CardDescription>
            Detailed breakdown of fraud patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="category">
            <TabsList className="mb-4">
              <TabsTrigger value="category">By Category</TabsTrigger>
              <TabsTrigger value="time">By Time of Day</TabsTrigger>
            </TabsList>
            <TabsContent value="category">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        return [
                          value,
                          name === "fraudCount" ? "Fraud Transactions" : "Total Transactions",
                        ];
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="totalCount"
                      name="Total Transactions"
                      fill="#0EA5E9"
                      opacity={0.2}
                    />
                    <Bar
                      dataKey="fraudCount"
                      name="Fraud Transactions"
                      fill="#ef4444"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Fraud Rate by Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categoryFraudRate.map((item) => (
                    <div
                      key={item.name}
                      className="border rounded-md p-3 flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className={`font-bold ${
                        Number(item.rate) > 20 
                          ? "text-red-500" 
                          : Number(item.rate) > 10 
                          ? "text-amber-500" 
                          : "text-green-500"
                      }`}>
                        {item.rate}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="time">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeOfDayData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        return [
                          value,
                          name === "fraudCount" ? "Fraud Transactions" : "Total Transactions",
                        ];
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="totalCount"
                      name="Total Transactions"
                      fill="#0EA5E9"
                      opacity={0.2}
                    />
                    <Bar
                      dataKey="fraudCount"
                      name="Fraud Transactions"
                      fill="#ef4444"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Fraud Rate by Time of Day</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {timeOfDayFraudRate.map((item) => (
                    <div
                      key={item.name}
                      className="border rounded-md p-3 flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className={`font-bold ${
                        Number(item.rate) > 20 
                          ? "text-red-500" 
                          : Number(item.rate) > 10 
                          ? "text-amber-500" 
                          : "text-green-500"
                      }`}>
                        {item.rate}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
