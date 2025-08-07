import { Schema, model } from "mongoose";

const NutritionGoalSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Users', 
      required: true,
      unique: true,
      index: true 
    },
    // Daily targets
    dailyCalories: { 
      type: Number, 
      required: true,
      min: 800,
      max: 5000
    },
    dailyProtein: { 
      type: Number, 
      required: true,
      min: 10,
      max: 500
    },
    dailyCarbs: { 
      type: Number, 
      required: true,
      min: 20,
      max: 800
    },
    dailyFat: { 
      type: Number, 
      required: true,
      min: 10,
      max: 300
    },
    dailyFiber: { 
      type: Number, 
      default: 25,
      min: 0,
      max: 100
    },
    dailySugar: { 
      type: Number, 
      default: 50,
      min: 0,
      max: 200
    },
    dailySodium: { 
      type: Number, 
      default: 2300,
      min: 0,
      max: 10000
    },
    // User profile data for goal calculation
    age: {
      type: Number,
      min: 13,
      max: 120
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },
    weight: {
      type: Number,
      min: 30,
      max: 500
    },
    height: {
      type: Number,
      min: 100,
      max: 250
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "lightly_active", "moderately_active", "very_active", "extremely_active"],
      default: "moderately_active"
    },
    goal: {
      type: String,
      enum: ["lose_weight", "maintain_weight", "gain_weight", "gain_muscle"],
      default: "maintain_weight"
    },
    weeklyWeightGoal: {
      type: Number,
      default: 0,
      min: -2,
      max: 2
    },
    setBy: {
      type: String,
      enum: ["user", "admin", "calculated"],
      default: "user"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for BMR calculation (Mifflin-St Jeor Equation)
NutritionGoalSchema.virtual('bmr').get(function() {
  if (!this.weight || !this.height || !this.age || !this.gender) {
    return null;
  }
  
  let bmr;
  if (this.gender === 'male') {
    bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) + 5;
  } else {
    bmr = (10 * this.weight) + (6.25 * this.height) - (5 * this.age) - 161;
  }
  
  return Math.round(bmr);
});

// Virtual for TDEE calculation
NutritionGoalSchema.virtual('tdee').get(function() {
  const bmr = this.bmr;
  if (!bmr) return null;
  
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  };
  
  return Math.round(bmr * activityMultipliers[this.activityLevel]);
});

// Method to calculate goals automatically
NutritionGoalSchema.methods.calculateGoals = function() {
  const tdee = this.tdee;
  if (!tdee) return this;
  
  // Adjust calories based on goal
  let targetCalories = tdee;
  switch (this.goal) {
    case 'lose_weight':
      targetCalories = tdee - (this.weeklyWeightGoal * 500 * 7) / 7;
      break;
    case 'gain_weight':
    case 'gain_muscle':
      targetCalories = tdee + (this.weeklyWeightGoal * 500 * 7) / 7;
      break;
  }
  
  this.dailyCalories = Math.round(targetCalories);
  
  // Calculate macros (40% carbs, 30% protein, 30% fat for muscle gain, adjust for other goals)
  if (this.goal === 'gain_muscle') {
    this.dailyProtein = Math.round((targetCalories * 0.30) / 4);
    this.dailyCarbs = Math.round((targetCalories * 0.40) / 4);
    this.dailyFat = Math.round((targetCalories * 0.30) / 9);
  } else {
    this.dailyProtein = Math.round((targetCalories * 0.25) / 4);
    this.dailyCarbs = Math.round((targetCalories * 0.45) / 4);
    this.dailyFat = Math.round((targetCalories * 0.30) / 9);
  }
  
  this.setBy = 'calculated';
  return this;
};

export const MNutritionGoal = model("NutritionGoals", NutritionGoalSchema);
