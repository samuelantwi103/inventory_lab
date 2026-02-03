/**
 * Base Repository
 * Abstract base class implementing common CRUD operations
 * Follows SOLID principles: Single Responsibility, Open/Closed, Dependency Inversion
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Find all documents with optional filters and pagination
   */
  async findAll(filters = {}, options = {}) {
    const { page = 1, limit = 10, sort = '-createdAt', populate = '' } = options;
    
    const skip = (page - 1) * limit;
    
    let query = this.model.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    if (populate) {
      query = query.populate(populate);
    }
    
    const items = await query;
    const total = await this.model.countDocuments(filters);
    
    return {
      items,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find document by ID
   */
  async findById(id, populate = '') {
    let query = this.model.findById(id);
    
    if (populate) {
      query = query.populate(populate);
    }
    
    return await query;
  }

  /**
   * Find one document by filter
   */
  async findOne(filters, populate = '') {
    let query = this.model.findOne(filters);
    
    if (populate) {
      query = query.populate(populate);
    }
    
    return await query;
  }

  /**
   * Create a new document
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Update document by ID
   */
  async updateById(id, data) {
    return await this.model.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete document by ID
   */
  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }

  /**
   * Count documents with filters
   */
  async count(filters = {}) {
    return await this.model.countDocuments(filters);
  }
}

export default BaseRepository;
