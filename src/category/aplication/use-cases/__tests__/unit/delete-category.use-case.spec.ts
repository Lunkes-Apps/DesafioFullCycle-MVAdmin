import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory-repository";
import { DeleteCategoryUseCase } from "../../delete-category.use-case";

describe("Delete Category use case tests", () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase(repository);
  });

  it("Should delete a Category when execute the use case", async () => {
    const spyInsert = jest.spyOn(repository, "delete");

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
