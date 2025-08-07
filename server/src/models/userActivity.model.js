import { Schema, model } from "mongoose";

const UserActivitySchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Users', 
      required: true,
      index: true 
    },
    activityType: {
      type: String,
      required: true,
      enum: [
        "nutrition_entry_added",
        "nutrition_entry_updated", 
        "nutrition_entry_deleted",
        "goal_updated",
        "profile_updated",
        "food_added",
        "login",
        "logout"
      ],
      index: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    ipAddress: {
      type: String,
      trim: true
    },
    userAgent: {
      type: String,
      trim: true
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for efficient queries
UserActivitySchema.index({ userId: 1, createdAt: -1 });
UserActivitySchema.index({ activityType: 1, createdAt: -1 });

export const MUserActivity = model("UserActivities", UserActivitySchema);
