import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
      enum: {
        values: ['Electronics', 'Furniture', 'Clothing', 'Food', 'Books', 'Toys', 'Sports', 'Other'],
        message: '{VALUE} is not a valid category',
      },
    },
    sku: {
      type: String,
      unique: true,
      uppercase: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: [0, 'Price cannot be negative'],
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Low stock threshold cannot be negative'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate SKU before saving if not provided
inventorySchema.pre('save', async function (next) {
  if (!this.sku) {
    // Generate SKU: Category prefix + timestamp + random number
    const categoryPrefix = this.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.sku = `${categoryPrefix}-${timestamp}-${random}`;
  }
  next();
});

// Virtual field for stock status
inventorySchema.virtual('stockStatus').get(function () {
  if (this.quantity === 0) {
    return 'OUT_OF_STOCK';
  } else if (this.quantity <= this.lowStockThreshold) {
    return 'LOW_STOCK';
  }
  return 'IN_STOCK';
});

// Include virtuals in JSON
inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });

const InventoryItem = mongoose.model('InventoryItem', inventorySchema);

export default InventoryItem;
