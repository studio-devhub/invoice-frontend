export interface Item {
  id: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  from: string;
  to: string;
  items: Item[];
  vat: number;
  paymentDetails: string;
  additionalNotes: string;
}
