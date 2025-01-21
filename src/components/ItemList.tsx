import { Box, Button, styled } from "@mui/material";
import { Field, FieldArray } from "formik";
import React from "react";
import CurrencyInput from "react-currency-input-field";
import { Btn } from "./InvoiceForm";
import DeleteIcon from "./svg-component/DeleteIcon";

interface ItemListProps {
  formik: any;
  items: any[];
  setFieldValue: (field: string, value: any) => void;
}

const ItemList: React.FC<ItemListProps> = ({
  formik,
  items,
  setFieldValue,
}) => {
  const calculateSubtotal = (quantity: number, price: number) =>
    quantity * price;

  return (
    <FieldArray name="items">
      {({ push, remove }) => (
        <ItemSection>
          <ItemHeader>
            <Box>Description</Box>
            <Box>Quantity</Box>
            <Box>Price</Box>
            <Box>Total</Box>
          </ItemHeader>
          {items.map((item, index) => (
            <ItemRow>
              {/* Description */}
              <Box>
                <Field
                  name={`items.${index}.description`}
                  placeholder={
                    formik.errors.items?.[index]?.description &&
                    formik.touched.items?.[index]?.description
                      ? "The description field is mandatory"
                      : "Description"
                  }
                  className={
                    formik.errors.items?.[index]?.description &&
                    formik.touched.items?.[index]?.description
                      ? "required placeholder-error"
                      : ""
                  }
                />
              </Box>

              {/* Quantity */}
              <Box>
                <Field
                  name={`items.${index}.quantity`}
                  type="number"
                  onChange={(e: any) => {
                    const quantity = parseFloat(e.target.value) || 0;
                    const price = item.price;
                    const subtotal = calculateSubtotal(quantity, price);
                    setFieldValue(`items.${index}.quantity`, quantity);
                    setFieldValue(`items.${index}.subtotal`, subtotal);
                  }}
                />
              </Box>

              {/* Price */}
              <Box>
                <CurrencyInput
                  id={`items.${index}.price`}
                  name={`items.${index}.price`}
                  decimalsLimit={2}
                  prefix="$"
                  defaultValue={item.price}
                  onValueChange={(value) => {
                    const price = parseFloat(value || "0");
                    const quantity = item.quantity;
                    const subtotal = calculateSubtotal(quantity, price);
                    setFieldValue(`items.${index}.price`, price);
                    setFieldValue(`items.${index}.subtotal`, subtotal);
                  }}
                />
              </Box>

              {/* Subtotal */}
              <Box>
                <CurrencyInput
                  id={`items.${index}.subtotal`}
                  name={`items.${index}.subtotal`}
                  decimalsLimit={2}
                  prefix="$"
                  value={item.subtotal}
                  readOnly
                />
              </Box>

              {/* Delete Button */}
              <Btn disableRipple onClick={() => remove(index)}>
                <DeleteIcon />
              </Btn>
            </ItemRow>
          ))}

          {/* Add New Item Button */}
          <Box>
            <AddBtn
              onClick={() =>
                push({ description: "", quantity: 1, price: 0, subtotal: 0 })
              }
            >
              + Add New Item
            </AddBtn>
          </Box>
        </ItemSection>
      )}
    </FieldArray>
  );
};

export default ItemList;

const ItemSection = styled(Box)(({ theme }) => [
  {
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
  },
  theme.applyStyles("dark", {
    "& button": {
      color: "#a6a5a5",
      "&:hover": {
        color: "#fafafa",
      },
    },
  }),
]);
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
    "& input": {
      maxWidth: "100%",
      textAlign: "right",
      minHeight: "27px",
    },
    "&:first-child": {
      width: "49%",
      textAlign: "left",
      paddingLeft: 0,
      "& input": {
        width: "90%",
        textAlign: "left",
      },
    },
    "&:last-child": {
      position: "absolute",
      width: "30px",
      right: 0,
      transform: "translate(100%)",
      padding: 0,
      marginTop: "-1px",
      border: "none",
      "& > svg": {
        width: "0.9rem",
        height: "0.9rem",
      },
    },
  },
}));
const AddBtn = styled(Button)(({ theme }) => [
  {
    margin: "10px 7px",
    marginLeft: 0,
    textTransform: "unset",
    fontSize: "13px",
    padding: 0,
  },
  theme.applyStyles("dark", {
    borderBottomColor: "#27272a",
  }),
]);
