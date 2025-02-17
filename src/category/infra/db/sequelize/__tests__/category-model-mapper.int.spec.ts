import { Sequelize } from "sequelize-typescript";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { CategoryModel } from "../category.model";
import { CategoryModelMapper } from "../category-model-mapper";
import { Category } from "../../../../domain/category.entity";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("CategoryModelMapper Integration Tests", () => {
  setupSequelize({ models: [CategoryModel] });
 
  it("should convert a category model to a category aggregate", () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      category_id: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });
    const aggregate = CategoryModelMapper.toEntity(model);
    expect(aggregate.toJSON()).toStrictEqual(
      new Category({
        category_id: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
        name: "some value",
        description: "some description",
        is_active: true,
        created_at,
      }).toJSON()
    );
  });

  test("should convert a category aggregate to a category model", () => {
    const created_at = new Date();
    const aggregate = new Category({
      category_id: new Uuid("5490020a-e866-4229-9adc-aa44b83234c4"),
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });
    const model = CategoryModelMapper.toModel(aggregate);
    expect(model.toJSON()).toStrictEqual({
      category_id: "5490020a-e866-4229-9adc-aa44b83234c4",
      name: "some value",
      description: "some description",
      is_active: true,
      created_at,
    });
  });
});
