import { Box, styled } from "@mui/material";
import React from "react";
import CurrencyInput from "react-currency-input-field";
import { numberToCurrency } from "../utils/helper";
import { Invoice } from "../utils/types";
import { Btn } from "./InvoiceBuilder";
import DeleteIcon from "./svg-component/DeleteIcon";

interface ItemListProps {
  invoice: Invoice;
  setInvoice: any;
  hitBtn: boolean;
}

const ItemList: React.FC<ItemListProps> = ({ invoice, setInvoice, hitBtn }) => {
  const handleItemChange = (index: number, name: string, value: string) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    updatedItems[index].total =
      updatedItems[index].quantity * updatedItems[index].price;
    setInvoice((prev: Invoice) => ({ ...prev, items: updatedItems }));
  };

  const addItem = (): void => {
    setInvoice((prev: Invoice) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now().toString(),
          description: "",
          quantity: 1,
          price: 0,
          total: 0,
        },
      ],
    }));
  };

  const deleteItem = (index: number): void => {
    const updatedItems = invoice.items.filter((_, i) => i !== index);
    setInvoice((prev: Invoice) => ({ ...prev, items: updatedItems }));
  };

  return (
    <ItemSection>
      <ItemHeader>
        <Box>Description</Box>
        <Box>Quantity</Box>
        <Box>Price</Box>
        <Box>Total</Box>
      </ItemHeader>

      {invoice.items.map((item: any, index: number) => (
        <ItemRow>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={item.description}
            onChange={(e) =>
              handleItemChange(index, "description", e.target.value)
            }
            className={`input-field ${
              !hitBtn && !item.description ? "" : "required"
            }`}
          />
          <input
            type="number"
            name="quantity"
            value={item.quantity}
            onChange={(e) =>
              handleItemChange(index, "quantity", e.target.value)
            }
            className="input-field"
          />
          <CurrencyInput
            id="input-example"
            name="price"
            prefix="$"
            defaultValue={item.price}
            decimalsLimit={2}
            onValueChange={(value) =>
              handleItemChange(index, "price", value ? value : "")
            }
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
          >
            {numberToCurrency(item.total, "$")}
          </Box>
          <Btn disableRipple onClick={() => deleteItem(index)}>
            <DeleteIcon />
          </Btn>
        </ItemRow>
      ))}
      <Box>
        <button style={{ margin: "10px 7px" }} onClick={addItem}>
          + Add New Item
        </button>
      </Box>
    </ItemSection>
  );
};

export default ItemList;

const ItemSection = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  "& button": {
    backgroundColor: "transparent",
    border: "none",
    color: "#18181b66",
    cursor: "pointer",
    "&:hover": {
      color: "#18181bcc",
    },
  },
}));
const ItemHeader = styled(Box)(({ theme }) => [
  {
    display: "flex",
    width: "100%",
    height: "25px",
    marginBottom: "3px",
    position: "relative",
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: "#e5e7eb",
    "& > div": {
      width: "17%",
      textAlign: "right",
      fontWeight: 600,
      "&:first-child": {
        width: "49%",
        textAlign: "left",
      },
    },
  },
  theme.applyStyles("dark", {
    borderBottomColor: "#27272a",
  }),
]);

const ItemRow = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  position: "relative",

  "& > *": {
    width: "17%",
    textAlign: "right",
    border: "none",
    backgroundColor: "transparent",
    minHeight: "27px",
    paddingLeft: "7px",
    "&:first-child": {
      width: "49%",
      textAlign: "left",
    },
    "&:last-child": {
      position: "absolute",
      width: "30px",
      right: 0,
      transform: "translate(100%)",
      padding: 0,
      border: "none",
      "& > svg": {
        color: "#a6a5a5",
        width: "0.9rem",
        height: "0.9rem",
      },
      "&:hover svg": {
        color: "#282828",
      },
    },
  },
}));
