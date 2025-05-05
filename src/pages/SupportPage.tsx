
import MobileLayout from "@/components/layout/MobileLayout";

const SupportPage = () => {
  return (
    <MobileLayout showBackButton title="Customer Support">
      <div className="p-4 space-y-6 animate-fade-in">
        <div className="bg-card rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-4">Contact Customer Support</h2>
          <p className="text-muted-foreground mb-6">
            Our customer service team is available 24/7 to assist you with any questions or issues.
          </p>
          
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-1">Email</p>
              <p className="text-lg">support@cryptotrader.com</p>
            </div>
            
            <div>
              <p className="text-muted-foreground mb-1">Phone</p>
              <p className="text-lg">+1 800-123-4567</p>
            </div>
            
            <div>
              <p className="text-muted-foreground mb-1">Live Chat</p>
              <p className="text-lg">Available on website and mobile app</p>
            </div>
          </div>
        </div>
        
        {/* Chat Form */}
        <div className="bg-card rounded-xl p-5">
          <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-muted-foreground mb-2">Subject</label>
              <select className="w-full bg-muted p-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Account Issue</option>
                <option>Deposit Problem</option>
                <option>Withdrawal Issue</option>
                <option>Trading Question</option>
                <option>Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-muted-foreground mb-2">Your Message</label>
              <textarea
                className="w-full bg-muted p-3 rounded-lg text-lg min-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Please describe your issue"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-primary text-white text-lg font-medium"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </MobileLayout>
  );
};

export default SupportPage;
