import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { DeleteCategoryUseCase } from "../../delete-category.use-case";

describe("Delete Category use case tests", () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({models: [CategoryModel]})

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  });

  it("Should delete a Category when execute the use case", async () => {
    const categ = Category.create({ name: "Category para deletar" });

    await repository.insert(categ);

    await useCase.execute({ id: categ.category_id.id });

    const categs = await repository.findAll();
    expect(categs.length).toBe(0);
  });

  it("Shoul throw a error exception to incorret uuid", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new InvalidUuidError()
    );
  });

  it("Shoul throw a error exception to not found id", async () => {
    const uuid = new Uuid();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    );
  });
});
