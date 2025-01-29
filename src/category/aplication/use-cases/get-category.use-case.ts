import { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";
import { CategoryOutpout } from "./shared/category-output";

export class GetCategoryUseCase
  implements IUseCase<GetCategoryInput, GetCategoryOutput>
{
  constructor(private readonly categoryRepo: ICategoryRepository) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const categ = await this.categoryRepo.findById(new Uuid(input.id));
    if (!categ) {
      throw new NotFoundError(input.id, Category);
    }

    return {
      id: categ.category_id.id,
      name: categ.name,
      description: categ.description,
      is_active: categ.is_active,
      created_at: categ.created_at,
    };
  }
}

export type GetCategoryInput = {
  id: string;
};

export type GetCategoryOutput = CategoryOutpout;