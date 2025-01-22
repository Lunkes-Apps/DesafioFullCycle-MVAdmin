import { CreatedAt } from "sequelize-typescript";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";
import { CategoryModel } from "./category.model";

export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      created_at: entity.created_at,
      is_active: entity.is_active,
    });
  }

  static toEntity(model: CategoryModel): Category {
    const entity = new Category({
      category_id: new Uuid(model.category_id),
      name: model.name,
      description: model.description,
      created_at: model.created_at,
      is_active: model.is_active,
    });
    Category.validate(entity);
    return entity;
  }
}
