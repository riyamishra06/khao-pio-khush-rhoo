import { Schema, model } from "mongoose";

const DailySummarySchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Users', 
      required: true,
      index: true 
    },
    date: { 
      type: Date, 
      required: true,
      index: true 
    },
    // Totals for the day
    totalCalories: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    totalProtein: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    totalCarbs: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    totalFat: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    totalFiber: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    totalSugar: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    totalSodium: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    // Meal breakdown
    mealBreakdown: {
      breakfast: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        entryCount: { type: Number, default: 0 }
      },
      lunch: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        entryCount: { type: Number, default: 0 }
      },
      dinner: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        entryCount: { type: Number, default: 0 }
      },
      snack: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        entryCount: { type: Number, default: 0 }
      }
    },
    // Goals for comparison
    goalCalories: { type: Number, default: 0 },
    goalProtein: { type: Number, default: 0 },
    goalCarbs: { type: Number, default: 0 },
    goalFat: { type: Number, default: 0 },
    
    // Calculated fields
    calorieBalance: { type: Number, default: 0 },
    proteinBalance: { type: Number, default: 0 },
    carbsBalance: { type: Number, default: 0 },
    fatBalance: { type: Number, default: 0 },
    
    // Completion percentages
    calorieCompletion: { type: Number, default: 0, min: 0, max: 200 },
    proteinCompletion: { type: Number, default: 0, min: 0, max: 200 },
    carbsCompletion: { type: Number, default: 0, min: 0, max: 200 },
    fatCompletion: { type: Number, default: 0, min: 0, max: 200 },
    
    totalEntries: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound unique index
DailySummarySchema.index({ userId: 1, date: 1 }, { unique: true });

// Virtual for overall completion percentage
DailySummarySchema.virtual('overallCompletion').get(function() {
  const avg = (this.calorieCompletion + this.proteinCompletion + this.carbsCompletion + this.fatCompletion) / 4;
  return Math.round(avg);
});

// Method to calculate all balances and percentages
DailySummarySchema.methods.calculateBalances = function() {
  // Calculate balances
  this.calorieBalance = this.totalCalories - this.goalCalories;
  this.proteinBalance = this.totalProtein - this.goalProtein;
  this.carbsBalance = this.totalCarbs - this.goalCarbs;
  this.fatBalance = this.totalFat - this.goalFat;
  
  // Calculate completion percentages
  this.calorieCompletion = this.goalCalories > 0 ? Math.round((this.totalCalories / this.goalCalories) * 100) : 0;
  this.proteinCompletion = this.goalProtein > 0 ? Math.round((this.totalProtein / this.goalProtein) * 100) : 0;
  this.carbsCompletion = this.goalCarbs > 0 ? Math.round((this.totalCarbs / this.goalCarbs) * 100) : 0;
  this.fatCompletion = this.goalFat > 0 ? Math.round((this.totalFat / this.goalFat) * 100) : 0;
  
  this.lastUpdated = new Date();
  return this;
};

export const MDailySummary = model("DailySummaries", DailySummarySchema);
