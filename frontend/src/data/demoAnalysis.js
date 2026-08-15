export const demoAnalysis = {
  currentProcess: [
    {
      id: 1,
      name: "Receive Order",
      type: "activity",
      role: "Sales Team"
    },
    {
      id: 2,
      name: "Check Inventory",
      type: "activity",
      role: "Warehouse Staff"
    },
    {
      id: 3,
      name: "Pick Items",
      type: "activity",
      role: "Warehouse Staff"
    },
    {
      id: 4,
      name: "Pack Items",
      type: "activity",
      role: "Warehouse Staff"
    },
    {
      id: 5,
      name: "Ship",
      type: "activity",
      role: "Logistics Team"
    },
    {
      id: 6,
      name: "Notify Customer",
      type: "activity",
      role: "Customer Service"
    }
  ],

  problems: [
    {
      id: 1,
      title: "Inventory checking",
      description: "Manual checking causes delays",
      severity: "High"
    },
    {
      id: 2,
      title: "Picking",
      description: "Human picking errors",
      severity: "Medium"
    }
  ],

  aiOpportunities: [
    {
      id: 1,
      title: "AI inventory prediction",
      description: "Predict stock availability before processing an order"
    },
    {
      id: 2,
      title: "Computer vision picking",
      description: "Assist warehouse workers in identifying the correct items"
    }
  ],

  futureProcess: [
    {
      id: 1,
      name: "Receive Order",
      type: "activity",
      responsibility: "Human"
    },
    {
      id: 2,
      name: "AI Inventory Check",
      type: "ai",
      responsibility: "AI"
    },
    {
      id: 3,
      name: "Human Approval",
      type: "decision",
      responsibility: "Human"
    },
    {
      id: 4,
      name: "AI Picking Recommendation",
      type: "ai",
      responsibility: "AI"
    },
    {
      id: 5,
      name: "Pack Items",
      type: "activity",
      responsibility: "Human"
    },
    {
      id: 6,
      name: "Ship",
      type: "activity",
      responsibility: "Human"
    },
    {
      id: 7,
      name: "AI Customer Notification",
      type: "ai",
      responsibility: "AI"
    }
  ],

  benefits: [
    "Reduced manual processing",
    "Fewer inventory errors",
    "Faster order fulfilment",
    "Better customer communication"
  ]
}