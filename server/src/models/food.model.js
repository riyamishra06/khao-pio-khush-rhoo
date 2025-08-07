import { Schema, model } from "mongoose";

const FoodSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true,
      index: true
    },
    brand: {
      type: String,
      trim: true,
      default: ""
    },
    category: {
      type: String,
      required: true,
      enum: [
        "fruits",
        "vegetables", 
        "grains",
        "proteins",
        "dairy",
        "nuts_seeds",
        "beverages",
        "snacks",
        "fast_food",
        "desserts",
        "oils_fats",
        "spices_herbs",
        "other"
      ],
      index: true
    },
    servingSize: {
      type: String,
      required: true,
      trim: true
    },
    servingUnit: {
      type: String,
      required: true,
      enum: ["g", "ml", "cup", "piece", "slice", "tbsp", "tsp", "oz", "lb"],
      default: "g"
    },
    // Nutrition per serving
    nutritionPer100g: {
      calories: { type: Number, required: true, min: 0 },
      protein: { type: Number, required: true, min: 0 },
      carbs: { type: Number, required: true, min: 0 },
      fat: { type: Number, required: true, min: 0 },
      fiber: { type: Number, default: 0, min: 0 },
      sugar: { type: Number, default: 0, min: 0 },
      sodium: { type: Number, default: 0, min: 0 },
      cholesterol: { type: Number, default: 0, min: 0 },
      saturatedFat: { type: Number, default: 0, min: 0 },
      transFat: { type: Number, default: 0, min: 0 }
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isPublic: {
      type: Boolean,
      default: true
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'admin',
      default: null
    },
    barcode: {
      type: String,
      trim: true,
      sparse: true,
      unique: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    tags: [{
      type: String,
      trim: true,
      lowercase: true
    }],
    usageCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for efficient searching
FoodSchema.index({ name: 'text', brand: 'text', description: 'text' });
FoodSchema.index({ category: 1, isVerified: 1 });
FoodSchema.index({ isPublic: 1, isVerified: 1 });
FoodSchema.index({ usageCount: -1 });

// Virtual for display name
FoodSchema.virtual('displayName').get(function() {
  return this.brand ? `${this.brand} - ${this.name}` : this.name;
});

// Method to increment usage count
FoodSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

export const MFood = model("Foods", FoodSchema);
