import { Chip } from "@mui/material";
import type { Category } from "../types";

interface CategoryChipProps{
    category: Category

}

function CategoryChip({category} : CategoryChipProps) {
    return (
        <Chip label = {category.name} size="small" sx={{ backgroundColor: category.color, color: 'white' }}/>
    )
}

export default CategoryChip