"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
class Category {
    constructor(id, sortOrder, name, slug, isActive, icon, createdAt, updatedAt) {
        this.id = id;
        this.sortOrder = sortOrder;
        this.name = name;
        this.slug = slug;
        this.isActive = isActive;
        this.icon = icon;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Category = Category;
//# sourceMappingURL=category.entity.js.map