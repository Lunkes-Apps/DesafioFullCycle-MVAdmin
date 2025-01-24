import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { GetCategoryUseCase } from "../../get-category.use-case";

describe("Get Category use case tests", () => {
  let useCase: GetCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase(repository);
  });

  it("Should delete a Category when execute the use case", async () => {
    const spyFindById = jest.spyOn(repository, "findById");

    const categ = Category.create({ name: "Category para buscar" });

    await repository.insert(categ);

    const catRetonada = await useCase.execute({ id: categ.category_id.id });

    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(catRetonada).toStrictEqual({
      id: catRetonada.id,
      name: catRetonada.name,
      description: catRetonada.description,
      is_active: catRetonada.is_active,
      created_at: catRetonada.created_at,
    });
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
