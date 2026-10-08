import { Stack, Typography } from "@mui/material";
import type { Category, Transaction } from "../types";
import CategoryChip from "./CategoryChip";

interface TransactionRowProps{
    category : Category,
    transaction: Transaction
}


function TransactionRow({ transaction, category} : TransactionRowProps){
    const isExpense = transaction.type === "expense"


    return(
        <Stack direction="row" spacing={2}>
            <Typography>{transaction.date}</Typography>
            <Typography sx={{ flexGrow: 1 }}>{transaction.comment ?? category.name}</Typography>
            <CategoryChip category={category}></CategoryChip>
            <Typography color = {isExpense ? "error.main" : "success.main"} sx={{fontWeight: "bold",
            color: isExpense ? "error.main" : "success.main" 
            }}>
                {(isExpense ? '- ' : '+ ') + transaction.amount.toLocaleString('ru-Ru')}
            </Typography>
        </Stack>
    )
}

export default TransactionRow