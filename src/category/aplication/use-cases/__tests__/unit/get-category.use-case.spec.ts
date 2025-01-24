import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { CategorySearchResult } from "../../../../domain/category.repository";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory-repository";
import { GetCategoryUseCase } from "../../get-category.use-case";

describe("Get Category use case tests", () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
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
    })
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
