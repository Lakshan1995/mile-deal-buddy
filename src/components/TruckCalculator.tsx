import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Truck, DollarSign, Calculator, Settings, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TruckCalculator = () => {
  const [miles, setMiles] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [driverCostPerMile, setDriverCostPerMile] = useState<number>(1.50);
  const [tempDriverCost, setTempDriverCost] = useState<string>("1.50");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showProfitAnimation, setShowProfitAnimation] = useState(false);

  const customerCostPerMile = miles && price ? 
    parseFloat(price) / parseFloat(miles) : 0;
  
  const isProfit = customerCostPerMile > driverCostPerMile && customerCostPerMile > 0;
  const profitMargin = customerCostPerMile - driverCostPerMile;

  useEffect(() => {
    if (isProfit && customerCostPerMile > 0) {
      setShowProfitAnimation(true);
      const timer = setTimeout(() => setShowProfitAnimation(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isProfit, customerCostPerMile]);

  const handleUpdateDriverCost = () => {
    const newCost = parseFloat(tempDriverCost);
    if (newCost > 0) {
      setDriverCostPerMile(newCost);
      setIsDialogOpen(false);
      toast({
        title: "Updated successfully!",
        description: `Your cost per mile is now $${newCost.toFixed(2)}`,
      });
    } else {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid cost per mile",
        variant: "destructive",
      });
    }
  };

  const getProfitMessage = () => {
    if (!isProfit || customerCostPerMile === 0) return null;
    
    if (profitMargin >= 1.0) {
      return "🚀 Excellent Deal! High profit margin!";
    } else if (profitMargin >= 0.5) {
      return "💰 Great Deal! Good profit!";
    } else {
      return "✅ Profitable Deal!";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-6">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-primary-dark to-primary rounded-xl">
            <Truck className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Trip Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Calculate your cost per mile and check profitability
        </p>
      </div>

      {/* Main Calculator Card */}
      <Card className="card-elevated max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Calculator className="h-5 w-5" />
            Customer Offer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="miles" className="text-sm font-medium">
              Miles
            </Label>
            <Input
              id="miles"
              type="number"
              placeholder="Enter miles"
              value={miles}
              onChange={(e) => setMiles(e.target.value)}
              className="input-large"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Total Price ($)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter total price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input-large"
            />
          </div>

          {/* Cost Per Mile Result */}
          {customerCostPerMile > 0 && (
            <div className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              isProfit 
                ? 'border-success bg-success/5 profit-glow' 
                : 'border-accent bg-accent/5'
            } ${showProfitAnimation ? 'success-bounce' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Customer Cost/Mile:</span>
                <span className="text-2xl font-bold text-primary">
                  ${customerCostPerMile.toFixed(2)}
                </span>
              </div>
              
              {isProfit && (
                <div className="mt-2 p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-2 text-success font-medium">
                    <TrendingUp className="h-4 w-4" />
                    {getProfitMessage()}
                  </div>
                  <p className="text-sm text-success mt-1">
                    Profit: ${profitMargin.toFixed(2)} per mile
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Driver Cost Section */}
      <Card className="card-elevated max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <DollarSign className="h-5 w-5" />
            Your Cost Per Mile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Current Rate</p>
              <p className="text-2xl font-bold text-accent">
                ${driverCostPerMile.toFixed(2)}
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Your Cost Per Mile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="driverCost">Cost Per Mile ($)</Label>
                    <Input
                      id="driverCost"
                      type="number"
                      step="0.01"
                      value={tempDriverCost}
                      onChange={(e) => setTempDriverCost(e.target.value)}
                      className="input-large"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateDriverCost} className="btn-accent flex-1">
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TruckCalculator;