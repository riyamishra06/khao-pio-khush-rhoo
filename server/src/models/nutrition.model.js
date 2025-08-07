import { Schema, model } from "mongoose";

const NutritionEntrySchema = new Schema(
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
    foodItem: { 
      type: String, 
      required: true,
      trim: true 
    },
    quantity: { 
      type: String, 
      required: true,
      trim: true 
    },
    calories: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    protein: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    carbs: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    fat: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    fiber: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    sugar: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    sodium: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      default: "snack"
    },
    foodId: {
      type: Schema.Types.ObjectId,
      ref: 'Foods',
      default: null
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

// Compound index for efficient queries
NutritionEntrySchema.index({ userId: 1, date: 1 });
NutritionEntrySchema.index({ userId: 1, createdAt: -1 });

// Virtual for total macros
NutritionEntrySchema.virtual('totalMacros').get(function() {
  return this.protein + this.carbs + this.fat;
});

export const MNutritionEntry = model("NutritionEntries", NutritionEntrySchema);
