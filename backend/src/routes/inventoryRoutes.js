import express from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  updateQuantity,
  getLowStockItems,
  getStatistics,
} from '../controllers/inventoryController.js';
import { protect } from '../middleware/auth.js';
import {
  createItemValidator,
  updateItemValidator,
  updateQuantityValidator,
  itemIdValidator,
} from '../validators/inventoryValidator.js';
import { handleValidationErrors } from '../validators/validationHandler.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management operations
 */

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all inventory items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, SKU, or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: -createdAt
 *         description: Sort field (prefix with - for descending)
 *     responses:
 *       200:
 *         description: List of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventoryItem'
 *                 pagination:
 *                   type: object
 */
router.get('/', protect, getAllItems);

/**
 * @swagger
 * /api/inventory/lowstock/items:
 *   get:
 *     summary: Get low stock items
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of low stock items
 */
router.get('/lowstock/items', protect, getLowStockItems);

/**
 * @swagger
 * /api/inventory/stats/summary:
 *   get:
 *     summary: Get inventory statistics
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory statistics
 */
router.get('/stats/summary', protect, getStatistics);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Get single inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Inventory item details
 *       404:
 *         description: Item not found
 */
router.get('/:id', protect, itemIdValidator, handleValidationErrors, getItemById);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create new inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - quantity
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop
 *               description:
 *                 type: string
 *                 example: High-performance laptop
 *               category:
 *                 type: string
 *                 example: Electronics
 *               quantity:
 *                 type: number
 *                 example: 50
 *               price:
 *                 type: number
 *                 example: 999.99
 *               lowStockThreshold:
 *                 type: number
 *                 example: 10
 *               sku:
 *                 type: string
 *                 example: ELE-123456-789
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', protect, createItemValidator, handleValidationErrors, createItem);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *               lowStockThreshold:
 *                 type: number
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 */
router.put('/:id', protect, updateItemValidator, handleValidationErrors, updateItem);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
router.delete('/:id', protect, itemIdValidator, handleValidationErrors, deleteItem);

/**
 * @swagger
 * /api/inventory/{id}/quantity:
 *   patch:
 *     summary: Update item quantity
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 75
 *     responses:
 *       200:
 *         description: Quantity updated successfully
 */
router.patch('/:id/quantity', protect, updateQuantityValidator, handleValidationErrors, updateQuantity);

export default router;
