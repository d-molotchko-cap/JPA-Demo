import { Category } from './category';
import { Tag } from './tag';
export interface Pet {
    category: Category;
    id: number;
    category2: Category;
    name: string;
    photoUrls: string[];
    tags: Tag[];
    status: string;
}
